import type { Metadata } from "next";

import { ReadingsPage } from "@/components/dashboard/readings-page";

export const metadata: Metadata = {
  title: "Readings",
};

export default function Readings() {
  return <ReadingsPage />;
}
