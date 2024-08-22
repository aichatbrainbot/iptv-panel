"use client";

import { supabase } from "@/clients/supabaseCLient";
import { OrderRow } from "@/components/home/OrderRows";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentOrders } from "@/db/data/subscriptions-data";
import { SearchFilter } from "@/types/search.types";
import { Subscriptions } from "@/types/tables.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

const OrdersTable = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [filter] = useQueryState("filter", {
    defaultValue: SearchFilter.ORDER_ID,
  });
  const [tab] = useQueryState("tab", {
    defaultValue: "completed",
  });

  const [search] = useQueryState("search");
  const [debouncedSearch] = useDebounce(search, 500);
  const [itemsPerPage, setItemsPerPage] = useQueryState(
    "itemsPerPage",
    parseAsInteger.withDefault(10),
  );
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: [
      `subscriptions?page=${page}`,
      page,
      itemsPerPage,
      filter,
      debouncedSearch,
      tab,
    ],
    queryFn: () =>
      getRecentOrders(
        page,
        itemsPerPage,
        tab,
        filter as SearchFilter,
        debouncedSearch,
      ),
    refetchOnMount: true,
  });

  useEffect(() => {
    const channel = supabase
      .channel("realtime subscriptions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "subscriptions" },
        (payload) => {
          toast.info(`New order: ${payload.new.id}`);
          queryClient.setQueryData(
            [`subscriptions?page=${1}`, page],
            (oldData: Subscriptions[] | undefined) => {
              if (!oldData) return [payload.new as Subscriptions];
              return [payload.new as Subscriptions, ...oldData.slice(0, 9)];
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, page]);

  return (
    <div className="flex w-full flex-col items-center gap-4 pb-10">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
              </TableRow>
            ))
          ) : orders ? (
            orders.map((order, index) => (
              <OrderRow
                key={order.id}
                order={order}
                index={index + (page - 1) * itemsPerPage}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </Button>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          disabled={!orders || orders.length < itemsPerPage}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrdersTable;
