import type { Metadata } from "next";

import { DevicesPage } from "@/components/dashboard/devices-page";

export const metadata: Metadata = {
  title: "Devices",
};

export default function Devices() {
  return <DevicesPage />;
}
