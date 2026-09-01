import type { Metadata } from "next";

import { TechnologiesManager } from "@/components/admin/technologies-manager";
import { getAllTechnologies } from "@/features/home/lib/technologies";

export const metadata: Metadata = {
  title: "Manage technologies - Admin",
};

export default async function AdminTechnologiesPage() {
  const technologies = await getAllTechnologies();

  return <TechnologiesManager initialTechnologies={technologies} />;
}
