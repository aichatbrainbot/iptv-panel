"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";

import { Offer, Plan } from "@/types/plans.types";
import React from "react";
import PlanCard from "./PlanCard";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  // Add more offers as needed
];
const PlansList = () => {
  const { data: offers } = useQuery({
    queryKey: ["offers"],
  });
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Offers</h1>
      <Accordion type="single" collapsible>
        {initialOffers.map((offer) => (
          <AccordionItem value={offer.id} key={offer.id}>
            <AccordionTrigger>{offer.name}</AccordionTrigger>
            <AccordionContent>
              <PlanCard key={offer.id} offer={offer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PlansList;
