"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/types/zod-schemas/auth-schemas";
import { z } from "zod";
import redis from "@/lib/redis";

export async function login({ email, password }: z.infer<typeof loginSchema>) {
  if (await redis.sismember("allowed-emails", email)) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    redirect("/");
  } else {
    throw new Error("Email not allowed");
  }
}
