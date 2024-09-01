import OrderForm from "@/components/orders/id/OrderForm";
import PageWrapper from "@/components/PageWrapper";
import { getSubscription } from "@/db/data/subscriptions-data";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const order = await getSubscription(params.id);
  if (!order) return notFound();

  return (
    <PageWrapper className="justify-center">
      <OrderForm
        numberOfConnections={parseInt(order.connections || "1")}
        order={order}
      />
    </PageWrapper>
  );
};

export default page;
