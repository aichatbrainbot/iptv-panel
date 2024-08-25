"use client";
import { supabase } from "@/clients/supabaseCLient";
import { getEmailAndDevices } from "@/db/service/email-service";
import { OrderStatus } from "@/types/search.types";
import { Subscriptions } from "@/types/tables.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  initialOrders: Subscriptions[];
}

const OrderRows = ({ initialOrders }: Props) => {
  const [orders, setOrders] = useState<Subscriptions[]>(initialOrders);
  useEffect(() => {
    const channel = supabase
      .channel("realtime orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "subscriptions" },
        (payload) => {
          // keep only the last 5 orders
          setOrders((prev) => {
            const updatedOrders = [payload.new as Subscriptions, ...prev];
            return updatedOrders.slice(0, 5);
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orders, setOrders]);
  return orders.map((order, index) => (
    <OrderRow order={order} index={index} key={order.id} />
  ));
};

export default OrderRows;

export const OrderRow = ({
  order,
  index,
}: {
  order: Subscriptions;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["devices", order.id],
    queryFn: () => getEmailAndDevices(order.id, order.user_id),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <TableRow key={index}>
          {" "}
          <TableCell>{index + 1}</TableCell>{" "}
          <TableCell>
            <Badge variant={order.quick_delivery ? "quick" : "outline"}>
              {order.quick_delivery ? "Quick Delivery" : "Standard Delivery"}
            </Badge>
          </TableCell>{" "}
          <TableCell>{order.plan}</TableCell>{" "}
          <TableCell>$ {order.price}</TableCell>{" "}
          <TableCell className="text-right">
            <Badge variant={order.status as OrderStatus}>{order.status}</Badge>
          </TableCell>{" "}
        </TableRow>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="my-4 grid grid-cols-3 items-center">
          <div className="col-span-2">
            {" "}
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Detailed information about order #{order.order_number}
            </DialogDescription>
          </div>
          <Button
            variant={order.quick_delivery ? "quick" : "outline"}
            className="col-span-1"
          >
            Process Order
          </Button>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Customer Information</h3>
            <p className="flex items-center gap-2">
              <strong>Email:</strong>{" "}
              {isLoading ? <Skeleton className="h-4 w-full" /> : data?.email}
            </p>
            <p>
              <strong>Name:</strong> {order.full_name}
            </p>
            <p>
              <strong>Payement Email:</strong> {order.email}
            </p>
            <p>
              <strong>Country:</strong> {order.country_code}
            </p>
            <p>
              <strong>User ID:</strong> {order.user_id}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Order Information</h3>
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>

            <p>
              <strong>Plan:</strong> {order.plan}
            </p>
            <p>
              <strong>Price:</strong> ${order.price}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.created_at
                ? format(new Date(order.created_at), "PPP")
                : "N/A"}
            </p>
            <p>
              <strong>PayPal Transaction ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>VOD:</strong> {order.vod ? "Yes" : "No"}
            </p>
            <p>
              <strong>Adult Content:</strong>{" "}
              {order.adult_content ? "Yes" : "No"}
            </p>
            <p>
              <strong>Quick Delivery:</strong>{" "}
              {order.quick_delivery ? "Yes" : "No"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">
            Device Types and Max Addresses
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Type</TableHead>
                <TableHead className="text-right">Mac Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.devices?.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell>{device.device_type}</TableCell>
                      <TableCell className="text-right">
                        {device.mac_address}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
