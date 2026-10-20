"use client";

import {
  Avatar,
  Card,
  Chip,
  EmptyState,
  ProgressBar,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { ChartLegend, ComplianceChart, ServiceBarChart, Sparkline } from "./charts";
import { useDashboard } from "./dashboard-context";
import {
  matchesQuery,
  matchesStatus,
  patients,
  periodLabel,
  periods,
  snapshots,
  statusColor,
  statusFilters,
  type Period,
  type StatusFilter,
} from "./data";
import {
  CalendarIcon,
  HeartIcon,
  MedicalIcon,
  UsersIcon,
} from "./icons";

const panelStyle: CSSProperties = {
  borderRadius: 16,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const sparkColor = {
  accent: "var(--accent)",
  danger: "var(--danger)",
  foreground: "var(--foreground)",
};

function SectionHeading({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

function MetricIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-7 items-center justify-center rounded-lg bg-default text-muted">
      {children}
    </span>
  );
}

function StatusChip({
  children,
  color,
}: {
  children: string;
  color: "accent" | "danger" | "default" | "success" | "warning";
}) {
  return (
    <Chip color={color} size="sm" variant="soft">
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}

export function HealthcareDashboard() {
  const { query, setStatusFilter, statusFilter } = useDashboard();
  const [period, setPeriod] = useState<Period>("30d");
  const snapshot = snapshots[period];

  const visiblePatients = patients.filter(
    (patient) =>
      matchesStatus(statusFilter, patient.status) &&
      matchesQuery(query, [
        patient.name,
        patient.program,
        patient.condition,
        patient.device,
        patient.status,
        patient.reading,
      ]),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Remote Patient Monitoring
          </h1>
          <p className="mt-1 text-sm text-muted">
            Enrollment, device readings, and care follow-through.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-separator bg-surface px-3 py-2 text-sm">
            <CalendarIcon className="text-muted" size={16} />
            {snapshot.range}
          </div>
          <ToggleButtonGroup
            disallowEmptySelection
            selectedKeys={new Set([period])}
            selectionMode="single"
            size="sm"
            onSelectionChange={(keys) => {
              const next = Array.from(keys)[0];

              if (next) setPeriod(String(next) as Period);
            }}
          >
            {periods.map((item) => (
              <ToggleButton key={item} id={item}>
                {periodLabel[item]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>

      <section>
        <SectionHeading
          description="Who is enrolled, and whether devices are checking in."
          title="RPM summary"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {snapshot.rpm.map((item, index) => {
            const icons = [UsersIcon, HeartIcon, MedicalIcon];
            const Icon = icons[index] ?? UsersIcon;

            return (
              <Card
                key={item.label}
                className="border border-separator bg-surface"
                style={{ ...panelStyle, padding: 20 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <MetricIcon>
                      <Icon size={15} />
                    </MetricIcon>
                    {item.label}
                  </div>
                  {item.trend ? (
                    <StatusChip color={item.trend.color}>{item.trend.label}</StatusChip>
                  ) : null}
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </div>
                  <Sparkline color={sparkColor[item.tone]} values={item.spark} />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          description="Plans, rising risk, and calls that still need a clinician."
          title="Care management summary"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {snapshot.care.map((item) => (
            <Card
              key={item.label}
              className="border border-separator bg-surface"
              style={{ ...panelStyle, padding: 20 }}
            >
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {item.value}
              </p>
              {item.progress != null ? (
                <ProgressBar
                  aria-label={item.label}
                  className="mt-4"
                  color={item.progressColor}
                  value={item.progress}
                >
                  <ProgressBar.Track
                    style={{ borderRadius: 999, height: 6 }}
                  >
                    <ProgressBar.Fill style={{ borderRadius: 999 }} />
                  </ProgressBar.Track>
                </ProgressBar>
              ) : null}
              <p className="mt-3 text-sm text-muted">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-2">
        <Card
          className="border border-separator bg-surface"
          style={{ ...panelStyle, padding: 20 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Completed services</h2>
              <p className="text-sm text-muted">
                Finished work against what was scheduled.
              </p>
            </div>
            <ChartLegend
              items={[
                { label: "Completed", color: "var(--foreground)" },
                { label: "Scheduled", color: "var(--accent)" },
              ]}
            />
          </div>
          <ServiceBarChart
            completed={snapshot.services.completed}
            labels={snapshot.services.labels}
            scheduled={snapshot.services.scheduled}
          />
        </Card>

        <Card
          className="border border-separator bg-surface"
          style={{ ...panelStyle, padding: 20 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Time to review</h2>
              <p className="text-sm text-muted">
                Hours from a device reading to clinician review.
              </p>
            </div>
            <ChartLegend
              items={[
                { label: "Typical", color: "var(--foreground)" },
                { label: "Delayed", color: "var(--accent)" },
                { label: "Escalated", color: "var(--danger)" },
              ]}
            />
          </div>
          <ComplianceChart
            labels={snapshot.compliance.labels}
            series={[
              {
                name: "Typical",
                color: "var(--foreground)",
                values: snapshot.compliance.onTime,
              },
              {
                name: "Delayed",
                color: "var(--accent)",
                values: snapshot.compliance.late,
              },
              {
                name: "Escalated",
                color: "var(--danger)",
                values: snapshot.compliance.missed,
              },
            ]}
          />
        </Card>
      </section>

      <section>
        <Card
          className="border border-separator bg-surface"
          style={{ ...panelStyle, padding: 20 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Patient summary</h2>
              <p className="text-sm text-muted">
                Latest device reading for patients in RPM and care management.
              </p>
            </div>
            <ToggleButtonGroup
              disallowEmptySelection
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
              size="sm"
              onSelectionChange={(keys) => {
                const next = Array.from(keys)[0];

                if (next) setStatusFilter(String(next) as StatusFilter);
              }}
            >
              {statusFilters.map((filter) => (
                <ToggleButton key={filter} id={filter}>
                  {filter === "all" ? "All" : filter}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          {visiblePatients.length === 0 ? (
            <EmptyState className="py-10 text-center text-sm text-muted">
              No patients match the current search or status.
            </EmptyState>
          ) : (
            <ul className="mt-4">
              {visiblePatients.map((patient, index) => (
                <li key={patient.name}>
                  {index > 0 ? <Separator /> : null}
                  <div className="grid items-center gap-3 py-3 sm:grid-cols-[1.4fr_0.8fr_1fr_auto]">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <Avatar.Fallback>{patient.initial}</Avatar.Fallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted">
                          {patient.age} years · {patient.condition}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{patient.program}</p>
                    <div>
                      <p className="text-sm font-medium">{patient.reading}</p>
                      <p className="text-xs text-muted">
                        {patient.device} · {patient.when}
                      </p>
                    </div>
                    <StatusChip color={statusColor(patient.status)}>
                      {patient.status}
                    </StatusChip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
