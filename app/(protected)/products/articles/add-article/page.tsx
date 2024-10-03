import PageWrapper from "@/components/PageWrapper";
import TailwindEditor from "@/components/products/content-management/Wrapper";
import React from "react";

const page = () => {
  return (
    <PageWrapper className="items-start">
      <TailwindEditor
        type="articles"
        seoTitle=""
        seoDescription=""
        seoKeywords={[]}
      />
    </PageWrapper>
  );
};

export default page;
