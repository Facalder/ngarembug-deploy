"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatSegment(str: string) {
  // Decode URL encoding (e.g., %20 -> space, &amp; -> &)
  const decoded = decodeURIComponent(str);

  // Replace hyphens with spaces and capitalize each word
  return decoded
    .split(/[-\s]+/) // Split by hyphens or spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ClientBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .replace(/^\/dashboard/, "")
    .split("/")
    .filter(Boolean);

  const paths = segments.map((seg, i) => ({
    label: formatSegment(seg),
    href: "/dashboard/" + segments.slice(0, i + 1).join("/"),
  }));

  const last = paths.at(-1);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {paths.map((item, i) => {
              const isLast = i === paths.length - 1;

              return (
                <Fragment key={item.href}>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        <span suppressHydrationWarning>{item.label}</span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>
                          <span suppressHydrationWarning>{item.label}</span>
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="block sm:hidden">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {paths.length > 0 && (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>

                {paths.length > 1 && (
                  <>
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BreadcrumbEllipsis className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {paths.slice(0, -1).map((p) => (
                            <DropdownMenuItem key={p.href} asChild>
                              <Link href={p.href}>{p.label}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  </>
                )}

                <BreadcrumbItem>
                  <BreadcrumbPage>{last?.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}
