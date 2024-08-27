import PageWrapper from "@/components/PageWrapper";
import { SearchFilter } from "@/types/search.types";
import TabedOrders from "./TabedOrders";
import SearchBarAndFilters from "./OrdersSearch";

const selectItems = [
  { value: SearchFilter.ORDER_NUMBER, label: "Order Number" },
  { value: SearchFilter.USER_EMAIL, label: "User Email" },
  { value: SearchFilter.USER_NAME, label: "User Name" },
  { value: SearchFilter.USER_PHONE, label: "User Phone" },
  { value: SearchFilter.SUB_ID, label: "Sub ID" },
  { value: SearchFilter.COUNTRY_CODE, label: "Country Code" },
  { value: SearchFilter.PAYMENT_FULL_NAME, label: "Payment Full Name" },
  { value: SearchFilter.PAYMENT_ORDER_ID, label: "Paypal Transaction ID" },
  { value: SearchFilter.PAYMENT_EMAIL, label: "Payment Email" },
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
