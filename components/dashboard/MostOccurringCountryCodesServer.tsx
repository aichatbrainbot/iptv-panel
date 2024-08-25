import { getMostOccurringCountryCodes } from "@/db/aggregations/sales-aggregation";
import MostOccurringCountryCodes from "./MostOccurringCountryCodes";
import TotaleVisitorsOfWebsite from "./TotaleVisitorsOfWebsite";
import redis from "@/lib/redis";

const MostOccurringCountryCodesServer = async () => {
  const [data, totalVisitorsOfSite] = await Promise.all([
    getMostOccurringCountryCodes(5),
    redis.get("mycount"),
  ]);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <MostOccurringCountryCodes data={data} />
      <TotaleVisitorsOfWebsite
        data={data}
        totalVisitorsOfSite={totalVisitorsOfSite as number}
      />
    </div>
  );
};

export default MostOccurringCountryCodesServer;
