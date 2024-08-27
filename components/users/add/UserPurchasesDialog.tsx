import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { getUserSubscriptions } from "@/db/data/subscriptions-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type UserPurchasesDialogProps = {
  userEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const UserPurchasesDialog = ({
  userEmail,
  open,
  onOpenChange,
}: UserPurchasesDialogProps) => {
  const {
    data: purchases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["purchases", userEmail],
    queryFn: () => getUserSubscriptions(userEmail),
    enabled: open,
  });
  if (isError) toast.error("Failed to fetch user purchases");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>User Purchases</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order N°</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                purchases?.map((purchase) => (
                  <TableRow key={purchase.id} className="cursor-pointer">
                    <TableCell>{purchase.order_number}</TableCell>
                    <TableCell>
                      {format(new Date(purchase.created_at!), "PPP")}
                    </TableCell>
                    <TableCell>{purchase.plan}</TableCell>
                    <TableCell className="text-right">
                      ${purchase.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserPurchasesDialog;
