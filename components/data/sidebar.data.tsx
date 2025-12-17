import {
  Agreement01FreeIcons,
  Sofa01FreeIcons,
  Store03FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SidebarData, User } from "@/components/types/nav.types";

export const user: User = {
  name: "Najla",
  email: "najlaaisy@gmail.com",
  avatar: "",
};

export const sidebarData: SidebarData = {
  groups: [
    {
      title: "Platform",
      items: [
        {
          title: "Cafe",
          to: "/dashboard/cafes",
          icon: () => <HugeiconsIcon icon={Store03FreeIcons} />,
        },
        {
          title: "Fasilitas Cafe",
          to: "/dashboard/facilities",
          icon: () => <HugeiconsIcon icon={Sofa01FreeIcons} />,
        },
        {
          title: "Syarat dan Ketentuan",
          to: "/dashboard/terms",
          icon: () => <HugeiconsIcon icon={Agreement01FreeIcons} />,
        },
      ],
    },
  ],
};
