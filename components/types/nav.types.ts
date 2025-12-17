import type React from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type NavItem = {
  title: string;
  to?: string;
  icon?: () => React.ReactNode;
  badge?: number;
  description?: string;
  children?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  groups: NavGroup[];
  footer?: NavItem[];
};

export type { User, NavItem, NavGroup, SidebarData };
