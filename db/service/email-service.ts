"use server";

import { ConnectionInfo } from "@/components/orders/id/OrderForm";
import logger from "@/lib/logger";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { getSubDevices } from "../data/device-data";
import { EmailTemplate } from "./EmailTemplate";
import { updateOrder } from "../drizzle-queries/data/subscriptions-data";
import { StatusEnum } from "../schema";

const transporter = nodemailer.createTransport({
  service: "titan",
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `You Order ${orderNumber} is completed`,
    text: `You Order ${orderNumber} is completed`,
    html: await emailHtml,
  });
  logger.info("Email sent");
  console.log({ info });

  await updateOrder(orderId, { status: StatusEnum.COMPLETED });
};

export { getEmailAndDevices, sendCompletedEmail };
