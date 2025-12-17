"use client";

import { Add01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type DashboardTitleProps = {
  title: string;
  subtitle?: string;
  createLabel?: string;
  createHref?: string;
  onCreateClick?: () => void;
  hideCreateButton?: boolean;
  customAction?: React.ReactNode;
};

export default function DashboardLayout(data: DashboardTitleProps) {
  const {
    title,
    subtitle,
    createLabel = "Buat Baru",
    createHref,
    onCreateClick,
    hideCreateButton = false,
    customAction,
  } = data;

  return (
    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 md:mb-6 lg:mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold  text-2xl md:text-3xl">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {!hideCreateButton && (
        <div className="flex items-center gap-2">
          {customAction}

          {createHref ? (
            <Button asChild size="sm" className="gap-2">
              <Link href={createHref}>
                <HugeiconsIcon icon={Add01FreeIcons} className="size-4" />
                {createLabel}
              </Link>
            </Button>
          ) : onCreateClick ? (
            <Button onClick={onCreateClick} size="sm" className="gap-2">
              <HugeiconsIcon icon={Add01FreeIcons} className="size-4" />
              {createLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
