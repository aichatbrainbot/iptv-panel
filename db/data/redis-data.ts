"use server";

import redis from "@/lib/redis";
import { Offer } from "@/types/plans.types";

const updateOffer = async (offer: Offer) => {
  await redis.set(`offer:${offer.id}`, offer);
};

const deleteOffer = async (offerId: string) => {
  await redis.del(`offer:${offerId}`);
};

export { updateOffer, deleteOffer };
