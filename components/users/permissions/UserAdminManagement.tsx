"use client";

import error from "@/app/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllUsers,
  isAdmin as verifyRole,
  setAdmin,
} from "@/db/data/users-data";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UserAdminManagement = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    try {
      const verifyRoleFn = async (email: string) => {
        setVerifying(true);
        const isAdmin = await verifyRole(email);
        setIsAdmin(isAdmin);
        setVerifying(false);
      };
      if (selectedUser) {
        verifyRoleFn(selectedUser?.email!);
      }
    } catch (error) {
      toast.error("Failed to verify user permissions");
    }
  }, [selectedUser]);

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getAllUsers(page, itemsPerPage),
  });

  const mutation = useMutation({
    mutationFn: (user: User) => setAdmin(user.email!),
    onSuccess: () => {
      toast.success("Admin status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update admin status");
    },
  });

  if (isError) return error();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">User Admin Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Admin Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-28" />
                  </TableCell>
                </TableRow>
              ))
            : users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => setSelectedUser(user)}>
                      Set Admin
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
      <AlertDialog
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(null)}
      >
        <AlertDialogContent>
          {verifying ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Admin Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                  {isAdmin
                    ? `${selectedUser?.email} is already an admin`
                    : `Are you sure you want to set admin privileges for ${selectedUser?.email}?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => selectedUser && mutation.mutate(selectedUser)}
                  disabled={isAdmin}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserAdminManagement;
