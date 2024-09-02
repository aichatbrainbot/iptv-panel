"use server";

import { db } from "@/db";

const getOrderDevices = async (id: string) => {
  const devices = await db.query.devices.findMany({
    where: (devices, { eq }) => eq(devices.subscription_id, id),
  });
  return devices;
};

export { getOrderDevices };
