import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardHome } from "@/components/dashboard/dashboard-home";

export const metadata: Metadata = {
  title: "Remote Patient Monitoring",
};

export default function Home() {
  return (
    <Suspense fallback={null}>
      <DashboardHome />
    </Suspense>
  );
}
