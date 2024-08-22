"use server";

import { supabase } from "@/clients/supabaseCLient";
import { handleStatus } from "@/lib/handleStatus";
import { Devices } from "@/types/tables.types";

const getSubDevices = async (id: string) => {
  const { data, status, error } = await supabase
    .from("devices")
    .select("*")
    .eq("subscription_id", id);

  console.log(data);

  return handleStatus(status, data, error) as Devices[];
};

export { getSubDevices };
