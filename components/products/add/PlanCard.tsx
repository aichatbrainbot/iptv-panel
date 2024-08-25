import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { updateOffer, deleteOffer } from "@/db/data/redis-data";
import { Offer } from "@/types/plans.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, PlusCircle } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const planSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  placeholder: z.string(),
  price: z.string().min(1, "Price is required"),
  features: z.array(z.string()),
});

const offerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  plans: z.array(planSchema),
});

type Props = {
  offer: Offer;
  isNewOffer?: boolean;
};

const PlanCard = ({ offer, isNewOffer = false }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer,
  });

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn: (updatedOffer: Offer) => updateOffer(updatedOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const { mutateAsync: deleteOff, isPending: isDeleting } = useMutation({
    mutationFn: (offerId: string) => deleteOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof offerSchema>) => {
    toast.promise(update(data), {
      loading: isNewOffer ? "Creating offer..." : "Updating offer...",
      success: isNewOffer
        ? "Offer created successfully"
        : "Offer updated successfully",
      error: isNewOffer ? "Failed to create offer" : "Failed to update offer",
    });
  };

  const onDelete = async () => {
    toast.promise(deleteOff(offer.id), {
      loading: "Deleting offer...",
      success: "Offer deleted successfully",
      error: "Failed to delete offer",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card key={offer.id} className="w-full">
          <CardHeader>
            <CardTitle>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="text-2xl font-bold" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardTitle>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} className="mt-2" />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.watch("plans").map((plan, planIndex) => (
                <Card key={plan.id}>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name={`plans.${planIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} className="w-1/2" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`price-${plan.id}`}>Price: $</Label>
                        <FormField
                          control={form.control}
                          name={`plans.${planIndex}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id={`price-${plan.id}`}
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                  className="w-24"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <Label htmlFor={`placeholder-${plan.id}`}>
                        Placeholder:
                      </Label>
                      <FormField
                        control={form.control}
                        name={`plans.${planIndex}.placeholder`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                id={`placeholder-${plan.id}`}
                                {...field}
                                placeholder="Enter placeholder"
                                className="w-full"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex w-full items-center space-x-2"
                        >
                          <FormField
                            control={form.control}
                            name={`plans.${planIndex}.features.${featureIndex}`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newPlans = [...form.getValues("plans")];
                              newPlans[planIndex].features.splice(
                                featureIndex,
                                1,
                              );
                              form.setValue("plans", newPlans);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newPlans = [...form.getValues("plans")];
                          newPlans[planIndex].features.push("");
                          form.setValue("plans", newPlans);
                        }}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    const newPlans = [...form.getValues("plans")];
                    newPlans.push({
                      id: form.getValues("plans").length.toString(),
                      name: "",
                      placeholder: "",
                      price: "0",
                      features: [],
                    });
                    form.setValue("plans", newPlans);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Plan
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const newPlans = [...form.getValues("plans")];
                    newPlans.pop();
                    form.setValue("plans", newPlans);
                  }}
                  disabled={form.watch("plans").length <= 1}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove Last Plan
                </Button>
              </div>
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
              {isNewOffer ? "Create Offer" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={onDelete}
              disabled={isDeleting}
            >
              Delete Offer <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default PlanCard;
