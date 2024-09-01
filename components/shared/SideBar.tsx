"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "@/db/data/users-data";
import { OrderStatus } from "@/types/search.types";
import { createClient } from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import {
  BarChart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type OpenSections = {
  orderManagement: boolean;
  userManagement: boolean;
  productManagement: boolean;
  paymentInvoicing: boolean;
  reportsAnalytics: boolean;
  generalSettings: boolean;
  support: boolean;
  uiSettings: boolean;
};

export default function Component({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  useEffect(() => {
    const channel = supabase
      .channel("realtime notifications")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "subscriptions" },
        (payload) => {
          if (payload.new.status === OrderStatus.PAID) {
            toast.info(`New order: ${payload.new.order_number}`);
          }
        },
      )
      .subscribe();
  }, [supabase]);

  const router = useRouter();
  const [openSections, setOpenSections] = useState<OpenSections>({
    orderManagement: false,
    userManagement: false,
    productManagement: false,
    paymentInvoicing: false,
    reportsAnalytics: false,
    generalSettings: false,
    support: false,
    uiSettings: false,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = () => {
    toast.promise(mutateAsync(), {
      loading: "Signing out...",
      success: "Signed out successfully",
      error: "Failed to sign out",
    });
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: signOut,
  });

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const NavItem: React.FC<{
    icon: React.ElementType;
    children: React.ReactNode;
    onClick?: () => void;
    isOpen?: boolean;
  }> = ({ icon: Icon, children, onClick, isOpen }) => (
    <div
      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-muted"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </div>
      {onClick &&
        (isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        ))}
    </div>
  );

  const SubNavItem = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <div
      className="cursor-pointer rounded-md px-10 py-1 text-sm hover:bg-muted"
      onClick={() => router.push(href)}
    >
      {children}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`fixed left-0 top-0 z-40 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex h-full w-64 flex-col border-r bg-background">
          <div className="border-b p-4">
            <Link href="/">
              <h1 className="text-lg font-semibold">E-commerce Admin</h1>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="space-y-2">
              <NavItem icon={LayoutDashboard}>
                <Link href="/dashboard">Dashboard</Link>
              </NavItem>

              <NavItem
                icon={ShoppingCart}
                onClick={() => toggleSection("orderManagement")}
                isOpen={openSections.orderManagement}
              >
                Order Management
              </NavItem>
              {openSections.orderManagement && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/orders">View Orders</SubNavItem>
                </div>
              )}

              <NavItem
                icon={Users}
                onClick={() => toggleSection("userManagement")}
                isOpen={openSections.userManagement}
              >
                User Management
              </NavItem>
              {openSections.userManagement && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/users/add">
                    Add/Edit/Delete Users
                  </SubNavItem>
                  <SubNavItem href="/users/permissions">
                    Set User Permissions
                  </SubNavItem>
                </div>
              )}

              <NavItem
                icon={Package}
                onClick={() => toggleSection("productManagement")}
                isOpen={openSections.productManagement}
              >
                Product Management
              </NavItem>
              {openSections.productManagement && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/products/add">
                    Add and Edit Packages
                  </SubNavItem>
                  <SubNavItem href="/products/content-management">
                    Content Management
                  </SubNavItem>
                </div>
              )}

              <NavItem
                icon={CreditCard}
                onClick={() => toggleSection("paymentInvoicing")}
                isOpen={openSections.paymentInvoicing}
              >
                Payment & Invoicing
              </NavItem>
              {openSections.paymentInvoicing && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/payment-methods">
                    Set Up Payment Methods
                  </SubNavItem>
                  <SubNavItem href="/track-payments">Track Payments</SubNavItem>
                  <SubNavItem href="/issue-invoices">Issue Invoices</SubNavItem>
                </div>
              )}

              <NavItem
                icon={BarChart}
                onClick={() => toggleSection("reportsAnalytics")}
                isOpen={openSections.reportsAnalytics}
              >
                Reports & Analytics
              </NavItem>
              {openSections.reportsAnalytics && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/reports/sales">Sales Report</SubNavItem>
                  <SubNavItem href="/reports/orders">Order Report</SubNavItem>
                  <SubNavItem href="/reports/users">User Statistics</SubNavItem>
                </div>
              )}

              <NavItem
                icon={Settings}
                onClick={() => toggleSection("generalSettings")}
                isOpen={openSections.generalSettings}
              >
                General Settings
              </NavItem>
              {openSections.generalSettings && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/settings/basic">
                    Change Basic Settings
                  </SubNavItem>
                  <SubNavItem href="/settings/notifications">
                    Manage Notifications
                  </SubNavItem>
                </div>
              )}

              <NavItem
                icon={LifeBuoy}
                onClick={() => toggleSection("support")}
                isOpen={openSections.support}
              >
                Support
              </NavItem>
              {openSections.support && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/support/ticket-management">
                    Ticket Management
                  </SubNavItem>
                  <SubNavItem href="/support/customer-communication">
                    Customer Communication
                  </SubNavItem>
                </div>
              )}

              <NavItem
                icon={Palette}
                onClick={() => toggleSection("uiSettings")}
                isOpen={openSections.uiSettings}
              >
                UI Settings
              </NavItem>
              {openSections.uiSettings && (
                <div className="ml-4 space-y-1">
                  <SubNavItem href="/ui/customize">
                    Customize User Interface
                  </SubNavItem>
                  <SubNavItem href="/ui/menu-settings">
                    Menu Settings
                  </SubNavItem>
                </div>
              )}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              disabled={isPending}
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-1 flex-col ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}
      >
        <div className="sticky top-0 z-30 flex items-center bg-background p-4 shadow-sm">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            size="icon"
            className="mr-4"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
