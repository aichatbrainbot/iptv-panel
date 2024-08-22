"use client";
import { supabase } from "@/clients/supabaseCLient";
import { Devices, Subscriptions } from "@/types/tables.types";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { format } from "date-fns";
import { getSubDevices } from "@/db/data/device-data";
import { toast } from "sonner";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

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
  }, [supabase, orders, setOrders]);
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

  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices", order.id],
    queryFn: () => getSubDevices(order.id),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TableRow key={index}>
          {" "}
          <TableCell>{index + 1}</TableCell>{" "}
          <TableCell>{order.full_name}</TableCell>{" "}
          <TableCell>{order.plan}</TableCell>{" "}
          <TableCell className="text-right">$ {order.price}</TableCell>{" "}
        </TableRow>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Detailed information about order #{index + 1}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Customer Information</h3>
            <p>
              <strong>Name:</strong> {order.full_name}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Country:</strong> {order.country_code}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Order Information</h3>
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>User ID:</strong> {order.user_id}
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
                : devices?.map((device, index) => (
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
