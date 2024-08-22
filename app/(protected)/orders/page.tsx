import PageWrapper from "@/components/PageWrapper";
import { SearchFilter } from "@/types/search.types";
import TabedOrders from "./TabedOrders";
import SearchBarAndFilters from "./OrdersSearch";

const selectItems = [
  { value: SearchFilter.ORDER_ID, label: "Order ID" },
  { value: SearchFilter.USER_EMAIL, label: "User Email" },
  { value: SearchFilter.PAYMENT_EMAIL, label: "Payment Email" },
  { value: SearchFilter.COUNTRY_CODE, label: "Country Code" },
  { value: SearchFilter.PAYMENT_FULL_NAME, label: "Payment Full Name" },
  { value: SearchFilter.USER_PHONE, label: "User Phone" },
  { value: SearchFilter.USER_ID, label: "User ID" },
];

const page = () => {
  return (
    <PageWrapper className="gap-4">
      <SearchBarAndFilters selectItems={selectItems} />
      <TabedOrders />
    </PageWrapper>
  );
};

export default page;
