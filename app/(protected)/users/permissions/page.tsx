import PageWrapper from "@/components/PageWrapper";
import UserAdminManagement from "@/components/users/permissions/UserAdminManagement";
import React from "react";

const page = () => {
  return (
    <PageWrapper>
      <UserAdminManagement />
    </PageWrapper>
  );
};

export default page;
