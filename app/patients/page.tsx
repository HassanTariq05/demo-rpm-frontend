import type { Metadata } from "next";

import { PatientsPage } from "@/components/dashboard/patients-page";

export const metadata: Metadata = {
  title: "Patients",
};

export default function Patients() {
  return <PatientsPage />;
}
