"use client";

import { Button, Card } from "@heroui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";

import { dashboardNav } from "./data";
import { HealthcareDashboard } from "./healthcare-dashboard";

export function DashboardHome() {
  const params = useSearchParams();
  const key = params.get("dashboard");
  const match = dashboardNav.find((item) => item.key === key);

  if (match && match.key !== "overview") {
    return (
      <Card className="border border-separator bg-surface">
        <Card.Header>
          <Card.Title className="text-xl font-semibold">{match.label}</Card.Title>
          <Card.Description>
            Open Overview to see remote monitoring.
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <NextLink href="/">
            <Button variant="primary">Open Overview</Button>
          </NextLink>
        </Card.Footer>
      </Card>
    );
  }

  return <HealthcareDashboard />;
}
