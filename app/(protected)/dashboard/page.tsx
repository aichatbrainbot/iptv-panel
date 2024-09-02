import AddonsAnalyticsServer from "@/components/dashboard/AddonsAnalyticsServer";
import MostOccurringCountryCodesServer from "@/components/dashboard/MostOccurringCountryCodesServer";
import PayementsPerDayServer from "@/components/dashboard/PayementsPerDayServer";
import PageWrapper from "@/components/PageWrapper";
import { Suspense } from "react";

const page = async () => {
  return (
    <PageWrapper className="gap-4">
      <Suspense>
        <PayementsPerDayServer />
      </Suspense>
      <Suspense>
        <MostOccurringCountryCodesServer />
      </Suspense>
      <Suspense>
        <AddonsAnalyticsServer />
      </Suspense>
    </PageWrapper>
  );
};

export default page;
