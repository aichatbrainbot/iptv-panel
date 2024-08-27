import UsersTable from "@/components/users/add/UsersTable";
import SearchBarAndFilters from "../../orders/OrdersSearch";
import { SearchFilter } from "@/types/search.types";
import PageWrapper from "@/components/PageWrapper";

const selectItems = [
  { value: SearchFilter.USER_EMAIL, label: "User Email" },
  { value: SearchFilter.USER_PHONE, label: "User Phone" },
];

const page = async () => {
  return (
    <PageWrapper>
      <SearchBarAndFilters selectItems={selectItems} />
      <UsersTable />
    </PageWrapper>
  );
};

export default page;
