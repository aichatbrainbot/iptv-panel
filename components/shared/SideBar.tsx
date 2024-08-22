"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import {
  BarChart,
  ChevronDown,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/db/data/users-data";
import { toast } from "sonner";

export default function Component({ children }: { children: React.ReactNode }) {
  const [openSections, setOpenSections] = useState({
    orderManagement: false,
    userManagement: false,
    productManagement: false,
    paymentInvoicing: false,
    reportsAnalytics: false,
    generalSettings: false,
    support: false,
    uiSettings: false,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const NavItem: React.FC<{
    icon: React.ElementType;
    children: React.ReactNode;
    onClick?: () => void;
    isOpen?: boolean;
  }> = ({ icon: Icon, children, onClick, isOpen }) => (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-muted ${
        isSidebarOpen ? "" : "hidden"
      }`}
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
    children: string;
    href: string;
  }) => (
    <div
      className={`cursor-pointer rounded-md px-10 py-1 text-sm hover:bg-muted ${
        isSidebarOpen ? "" : "hidden"
      }`}
    >
      <Link href={href}>{children}</Link>
    </div>
  );

  return (
    <div className="flex">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex h-screen w-64 flex-col border-r bg-background">
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
                  <SubNavItem href="/orders" children="View Orders" />
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
                  <SubNavItem
                    href="/users/add"
                    children="Add/Edit/Delete Users"
                  />
                  <SubNavItem
                    href="/users/permissions"
                    children="Set User Permissions"
                  />
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
                  <SubNavItem
                    href="/products/add"
                    children="Add and Edit Packages"
                  />
                  <SubNavItem
                    href="/products/content"
                    children="Content Management"
                  />
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
                  <SubNavItem
                    href="/payment-methods"
                    children="Set Up Payment Methods"
                  />
                  <SubNavItem href="/" children="Track Payments" />
                  <SubNavItem href="/" children="Issue Invoices" />
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
                  <SubNavItem href="/" children="Sales Report" />
                  <SubNavItem href="/" children="Order Report" />
                  <SubNavItem href="/" children="User Statistics" />
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
                  <SubNavItem href="/" children="Change Basic Settings" />
                  <SubNavItem href="/" children="Manage Notifications" />
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
                  <SubNavItem
                    href="/support/ticket-management"
                    children="Ticket Management"
                  />
                  <SubNavItem
                    href="/support/customer-communication"
                    children="Customer Communication"
                  />
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
                  <SubNavItem href="/" children="Customize User Interface" />
                  <SubNavItem href="/" children="Menu Settings" />
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
      <div className="flex-1">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="m-4 p-2"
        >
          {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </Button>
        {children}
      </div>
    </div>
  );
}
