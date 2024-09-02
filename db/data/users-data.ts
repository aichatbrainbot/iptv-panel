"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import redis from "@/lib/redis";
import supabaseAdmin from "@/lib/supabase-admin";
import { SearchFilter } from "@/types/search.types";
import { TypedSupabaseClient } from "@/types/TypedSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { Session, User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const getUser = async (supabase: TypedSupabaseClient): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  return data.user;
};

const getUserSession = async (
  supabase: TypedSupabaseClient,
): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
};

const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/login");
  redirect("/login");
};

const getAllUsersAsAdmin = async (page: number, perPage: number) => {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: page,
    perPage: perPage,
  });
  if (error) throw new Error(error.message);
  return users;
};

const setAdmin = async (email: string) => {
  await redis.sadd("allowed-emails", email);
};

const isAdmin = async (email: string) => {
  return (await redis.sismember("allowed-emails", email)) === 1;
};

export {
  getUser,
  getUserSession,
  isAdmin,
  setAdmin,
  signOut,
  getAllUsersAsAdmin,
};
