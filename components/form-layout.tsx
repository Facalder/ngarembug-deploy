"use client";

import type { ReactNode } from "react";

export function FormLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
      {children}
    </div>
  );
}

FormLayout.Form = function FormLayoutForm({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
};

FormLayout.Actions = function FormLayoutActions({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <aside className="space-y-4 md:sticky md:top-24 h-fit">{children}</aside>
  );
};
