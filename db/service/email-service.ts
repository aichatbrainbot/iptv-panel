"use server";

import supabaseAdmin from "@/lib/supabase-admin";
import { getSubDevices } from "../data/device-data";
import { ConnectionInfo } from "@/components/orders/id/OrderForm";
import { render } from "@react-email/components";
import { EmailTemplate } from "./EmailTemplate";
import nodemailer from "nodemailer";
import { updateSubscription } from "../data/subscriptions-data";
import logger from "@/lib/logger";
import { OrderStatus } from "@/types/search.types";

const transporter = nodemailer.createTransport({
  service: "titan",
  host: "smtp.titan.email",
  port: 465,
  secure: true,
  auth: {
    user: "order@ronotv.com",
    pass: "senpay@2021G",
  },
});

const getEmailAndDevices = async (subId: string) => {
  const devices = await getSubDevices(subId);

  return devices;
};

const sendCompletedEmail = async (
  connectionInfo: ConnectionInfo[],
  userEmail: string,
  orderId: string,
  orderNumber: number,
) => {
  const emailHtml = render(EmailTemplate({ connectionInfo }));

  const info = await transporter.sendMail({
    from: "order@ronotv.com",
    to: userEmail,
    subject: `You Order ${orderNumber} is completed`,
    text: `You Order ${orderNumber} is completed`,
    html: await emailHtml,
  });
  logger.info("Email sent");
  console.log({ info });

  await updateSubscription(orderId, { status: OrderStatus.COMPLETED });
};

export { getEmailAndDevices, sendCompletedEmail };
