"use server";

import { ConnectionInfo } from "@/components/orders/id/OrderForm";
import { Resend } from "resend";
import { getSubDevices } from "../data/device-data";
import { updateOrder } from "../drizzle-queries/data/subscriptions-data";
import { StatusEnum } from "../schema";
import { EmailTemplate } from "./EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  // const emailHtml = render(EmailTemplate({ connectionInfo }));

  await resend.emails.send({
    from: "contact@rimotv.com",
    to:
      process.env.NODE_ENV === "development"
        ? "ayoubbensalah2004@gmail.com"
        : userEmail,
    subject: `You Order ${orderNumber} is completed`,
    text: `You Order ${orderNumber} is completed`,
    react: EmailTemplate({ connectionInfo }),
  });

  await updateOrder(orderId, { status: StatusEnum.COMPLETED });
};

export { getEmailAndDevices, sendCompletedEmail };
