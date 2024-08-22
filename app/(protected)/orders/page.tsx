import OrdersTable from "@/components/orders/OrdersTable";
import PageWrapper from "@/components/PageWrapper";

const page = () => {
  return (
    <PageWrapper className="gap-4">
      <OrdersTable key={1} />
    </PageWrapper>
  );
};

export default page;
