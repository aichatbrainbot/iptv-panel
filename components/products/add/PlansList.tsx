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
const initialOffers: Offer[] = [
  {
    id: "1",
    name: "1 Connection",
    description: "IPTV on 1 device",
    plans: [
      {
        id: "1",
        name: "monthly",
        placeholder: "Monthly Plan",
        price: "11.99",
        features: [],
      },
      {
        id: "2",
        name: "quarterly",
        placeholder: "Quarterly Plan",
        price: "24.99",
        features: ["Save 11.98 dollars"],
      },
      {
        id: "3",
        name: "semi-annual",
        placeholder: "Semi-Annual Plan",
        price: "39.99",
        features: ["Save 31.95 dollars"],
      },
      {
        id: "4",
        name: "annual",
        placeholder: "Annual Plan",
        price: "59.99",
        features: ["Save 83.89 dollars"],
      },
    ],
  },
  {
    id: "2",
    name: "2 Connections",
    description: "IPTV on 2 devices",
    plans: [
      {
        id: "1",
        name: "monthly",
        placeholder: "Monthly Plan",
        price: "19.99",
        features: [],
      },
      {
        id: "2",
        name: "quarterly",
        placeholder: "Quarterly Plan",
        price: "43.99",
        features: ["Save 11.98 dollars"],
      },
      {
        id: "3",
        name: "semi-annual",
        placeholder: "Semi-Annual Plan",
        price: "69.99",
        features: ["Save 31.95 dollars"],
      },
      {
        id: "4",
        name: "annual",
        placeholder: "Annual Plan",
        price: "99.99",
        features: ["Save 83.89 dollars"],
      },
    ],
  },
  {
    id: "3",
    name: "3 Connections",
    description: "IPTV on 3 devices",
    plans: [
      {
        id: "1",
        name: "monthly",
        placeholder: "Monthly Plan",
        price: "28.99",
        features: [],
      },
      {
        id: "2",
        name: "quarterly",
        placeholder: "Quarterly Plan",
        price: "58.99",
        features: ["Save 11.98 dollars"],
      },
      {
        id: "3",
        name: "semi-annual",
        placeholder: "Semi-Annual Plan",
        price: "98.99",
        features: ["Save 31.95 dollars"],
      },
      {
        id: "4",
        name: "annual",
        placeholder: "Annual Plan",
        price: "129.99",
        features: ["Save 83.89 dollars"],
      },
    ],
  },
];
const PlansList = () => {
  // const { data: offers } = useQuery({
  //   queryKey: ["offers"],
  // });
  const [offers, setOffers] = useState(initialOffers);
  const handleAddOffer = () => {
    setOffers([
      ...offers,
      {
        id: `${offers.length + 1}`,
        name: `${offers.length + 1} Connections`,
        description: `IPTV on ${offers.length + 1} devices`,
        plans: [],
      },
    ]);
  };
  return (
    <div className="flex w-full flex-col gap-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Offers</h1>
      <Accordion type="single" collapsible>
        {offers.map((offer) => (
          <AccordionItem value={offer.id} key={offer.id}>
            <AccordionTrigger>{offer.name}</AccordionTrigger>
            <AccordionContent>
              <PlanCard key={offer.id} offer={offer} />
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
