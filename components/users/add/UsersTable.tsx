"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getAllUsers } from "@/db/data/users-data";
import UserPurchasesDialog from "./UserPurchasesDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilter } from "@/types/search.types";
import { useDebounce } from "use-debounce";

const UsersTable = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const itemsPerPage = 10;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filter] = useQueryState("filter", {
    defaultValue: SearchFilter.USER_EMAIL,
  });

  const [search] = useQueryState("search", {
    defaultValue: "",
  });
  const [debouncedSearch] = useDebounce(search, 500);
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", page, filter, debouncedSearch],
    queryFn: () =>
      getAllUsers(page, itemsPerPage, filter as SearchFilter, debouncedSearch),
  });

  if (isError) toast.error("Error fetching users");

  return (
    <div className="w-full py-10">
      <h1 className="mb-5 text-2xl font-bold">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-28" />
                  </TableCell>
                </TableRow>
              ))
            : users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setSelectedUserId(user.user_id)}
                      variant="outline"
                    >
                      View Purchases
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          variant="outline"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={users && users.length < itemsPerPage}
          variant="outline"
        >
          Next <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {selectedUserId && (
        <UserPurchasesDialog
          userId={selectedUserId}
          open={!!selectedUserId}
          onOpenChange={(open) => !open && setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default UsersTable;
