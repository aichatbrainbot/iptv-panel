"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Offer } from "@/types/plans.types";
import { useQuery } from "@tanstack/react-query";
import PlanCard from "./PlanCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { getOffers } from "@/db/data/redis-data";
import { Skeleton } from "@/components/ui/skeleton";

const PlansList = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: () =>
      getOffers().then((offers) => {
        setOffers(offers);
        return offers;
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const handleAddOffer = () => {
    if (!data) return;
    const newOffer = {
      id: `${offers.length + 1}`,
      name: `${offers.length + 1} Connections`,
      description: `IPTV on ${offers.length + 1} devices`,
      plans: [],
    };

    setOffers([...offers, newOffer]);
  };

  return (
    <div className="flex w-full flex-col gap-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Offers</h1>
      <Accordion type="single" collapsible>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <AccordionItem key={index} value={`skeleton-${index}`}>
                <AccordionTrigger>
                  <Skeleton className="h-6 w-48" />
                </AccordionTrigger>
                <AccordionContent>
                  <Skeleton className="h-64 w-full" />
                </AccordionContent>
              </AccordionItem>
            ))
          : offers.map((offer) => (
              <AccordionItem value={offer.id} key={offer.id}>
                <AccordionTrigger>{offer.name}</AccordionTrigger>
                <AccordionContent>
                  <PlanCard
                    offer={offer}
                    isNewOffer={parseInt(offer.id) > (data?.length || 0)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
      </Accordion>
      <Button onClick={handleAddOffer} variant={"ringHover"}>
        <Plus className="h-4 w-4" /> Add Offer
      </Button>
    </div>
  );
};

export default PlansList;
