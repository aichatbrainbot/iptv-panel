"use server";

import supabaseAdmin from "@/lib/supabase-admin";
import { getSubDevices } from "../data/device-data";

const getEmailAndDevices = async (subId: string, userId: string) => {
  const [devices, user] = await Promise.all([
    getSubDevices(subId),
    supabaseAdmin.auth.admin.getUserById(userId),
  ]);

  return {
    email: user.data.user?.email,
    devices,
  };
};

export { getEmailAndDevices };
