import PageWrapper from "@/components/PageWrapper";
import TailwindEditor from "@/components/products/content-management/Wrapper";
import React from "react";

const page = () => {
  return (
    <PageWrapper className="items-start">
      <TailwindEditor />
    </PageWrapper>
  );
};

export default page;
