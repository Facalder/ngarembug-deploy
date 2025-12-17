"use client";

import { SidebarLeft01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import DashboardBreadcrumbs from "@/components/dashboard-breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export default function DashboardNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="top-0 z-50 sticky flex items-center bg-background border-b w-full">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="size-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <HugeiconsIcon icon={SidebarLeft01FreeIcons} />
        </Button>
        <Separator orientation="vertical" className="mr-2" />
        <DashboardBreadcrumbs />
      </div>
    </header>
  );
}
