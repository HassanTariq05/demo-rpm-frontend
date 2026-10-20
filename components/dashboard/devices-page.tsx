"use client";

import {
  Avatar,
  Button,
  Card,
  Chip,
  Disclosure,
  Dropdown,
  EmptyState,
  Input,
  InputGroup,
  Modal,
  ProgressBar,
  Separator,
  Table,
  TextField,
} from "@heroui/react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { SearchIcon } from "@/components/icons";

import {
  deviceFamilies,
  deviceStatuses,
  rpmDevices,
  statusLabel,
  type DeviceFamily,
  type DeviceStatus,
  type RpmDevice,
} from "./devices-data";

const panelStyle: CSSProperties = {
  borderRadius: 16,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const toolbarButton =
  "button button--tertiary button--sm !inline-flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 rounded-full px-3";

const statusColor: Record<DeviceStatus, "danger" | "default" | "success" | "warning"> = {
  deactivated: "default",
  "no-readings": "warning",
  suspended: "danger",
  "with-readings": "success",
};

const summaryRows: Array<{ id: DeviceStatus | "total"; label: string; color: string }> = [
  { id: "total", label: "Total", color: "var(--foreground)" },
  { id: "with-readings", label: "Active · with readings", color: "var(--success)" },
  { id: "no-readings", label: "Active · no readings yet", color: "var(--warning)" },
  { id: "suspended", label: "Suspended", color: "var(--danger)" },
  { id: "deactivated", label: "Deactivated", color: "var(--muted)" },
];

const familyTone: Record<DeviceFamily, { color: string; hint: string }> = {
  bp: { color: "var(--accent)", hint: "Blood pressure cuffs" },
  glucose: { color: "var(--warning)", hint: "Glucose meters" },
  pulse: { color: "var(--danger)", hint: "Pulse oximeters" },
  scale: { color: "var(--success)", hint: "Weight scales" },
};

const statusOrder: DeviceStatus[] = ["with-readings", "no-readings", "suspended", "deactivated"];

const statusPaint: Record<DeviceStatus, string> = {
  deactivated: "var(--muted)",
  "no-readings": "var(--warning)",
  suspended: "var(--danger)",
  "with-readings": "var(--success)",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function FamilyIcon({ family }: { family: DeviceFamily }) {
  const common = {
    "aria-hidden": true as const,
    fill: "none",
    height: 18,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.75,
    viewBox: "0 0 24 24",
    width: 18,
  };

  if (family === "bp") {
    return (
      <svg {...common}>
        <rect height="14" rx="3" width="16" x="4" y="5" />
        <path d="M8 12h2.2l1.2-2.2L13 15l1.3-3H16" />
      </svg>
    );
  }

  if (family === "pulse") {
    return (
      <svg {...common}>
        <path d="M4 13h3l2-4 2 8 2-4h7" />
        <circle cx="18" cy="8" r="2" />
      </svg>
    );
  }

  if (family === "scale") {
    return (
      <svg {...common}>
        <rect height="14" rx="3" width="16" x="4" y="6" />
        <path d="M12 10v4" />
        <path d="M9.5 12.5h5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M8 4.5h8l1 4.5H7L8 4.5Z" />
      <path d="M7 9h10v8.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9Z" />
      <path d="M12 12.5v4" />
    </svg>
  );
}

function StatusChip({ status }: { status: DeviceStatus }) {
  return (
    <Chip color={statusColor[status]} size="sm" variant="soft">
      <Chip.Label>{statusLabel(status)}</Chip.Label>
    </Chip>
  );
}

function MixBar({
  segments,
}: {
  segments: Array<{ color: string; value: number }>;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-default">
      {segments
        .filter((segment) => segment.value > 0)
        .map((segment) => (
          <div
            key={segment.color}
            style={{
              background: segment.color,
              width: `${(segment.value / total) * 100}%`,
            }}
          />
        ))}
    </div>
  );
}

function ShareRing({ color, total, value }: { color: string; total: number; value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const share = total === 0 ? 0 : value / total;

  return (
    <div className="relative size-20 shrink-0">
      <svg aria-hidden="true" className="size-full" viewBox="0 0 72 72">
        <circle cx="36" cy="36" fill="none" r={radius} stroke="var(--default)" strokeWidth="7" />
        <circle
          cx="36"
          cy="36"
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={`${circumference * share} ${circumference}`}
          strokeLinecap="round"
          strokeWidth="7"
          transform="rotate(-90 36 36)"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold leading-none tabular-nums">{value}</span>
        <span className="mt-0.5 text-[10px] text-muted">live</span>
      </span>
    </div>
  );
}

function SummaryCard({
  count,
  family,
  label,
  onFilter,
  selected,
}: {
  count: (id: DeviceStatus | "total") => number;
  family: DeviceFamily;
  label: string;
  onFilter: () => void;
  selected: boolean;
}) {
  const tone = familyTone[family];
  const segments = statusOrder.map((status) => ({
    color: statusPaint[status],
    value: count(status),
  }));

  return (
    <Card
      className={`overflow-hidden border bg-surface shadow-none ${selected ? "border-accent" : "border-separator"}`}
      style={panelStyle}
    >
      <Disclosure className="w-full">
        <Disclosure.Heading className="w-full">
          <Disclosure.Trigger className="!flex w-full items-center gap-3 px-4 py-4 text-left">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `color-mix(in oklab, ${tone.color} 16%, transparent)`, color: tone.color }}
            >
              <FamilyIcon family={family} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold tracking-tight">{label}</span>
              <span className="mt-1 block text-xs text-muted">{tone.hint}</span>
              <span className="mt-2 block">
                <MixBar segments={segments} />
              </span>
            </span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ShareRing color={tone.color} total={count("total")} value={count("with-readings")} />
              <ul className="min-w-0 flex-1">
                {summaryRows.map((row, index) => (
                  <li key={row.id}>
                    {index > 0 ? <Separator /> : null}
                    <div className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-muted">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: row.id === "total" ? tone.color : row.color }}
                        />
                        {row.label}
                      </span>
                      <span className="font-semibold tabular-nums">{count(row.id)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="mt-3" size="sm" variant={selected ? "primary" : "secondary"} onPress={onFilter}>
              {selected ? "Clear inventory filter" : "Show in inventory"}
            </Button>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </Card>
  );
}

function FleetStat({
  color,
  detail,
  label,
  share,
  value,
}: {
  color: "accent" | "danger" | "success" | "warning";
  detail: string;
  label: string;
  share: number;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-separator bg-background/60 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <ProgressBar aria-label={label} className="mt-2" color={color} value={share}>
        <ProgressBar.Track style={{ borderRadius: 999, height: 6 }}>
          <ProgressBar.Fill style={{ borderRadius: 999 }} />
        </ProgressBar.Track>
      </ProgressBar>
      <p className="mt-2 text-xs text-muted">{detail}</p>
    </div>
  );
}

function Detail({ children, label }: { children: ReactNode; label: string }) {
  return (
    <p>
      <span className="text-muted">{label} </span>
      {children}
    </p>
  );
}

export function DevicesPage() {
  const [family, setFamily] = useState<DeviceFamily | "all">("all");
  const [status, setStatus] = useState<DeviceStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RpmDevice | null>(null);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rpmDevices.filter((device) => {
      if (family !== "all" && device.family !== family) return false;
      if (status !== "all" && device.status !== status) return false;
      if (!query) return true;

      return [device.model, device.serial, device.imei, device.patient ?? "", device.lastReading ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [family, search, status]);

  const countFor = (id: DeviceFamily, key: DeviceStatus | "total") =>
    rpmDevices.filter(
      (device) => device.family === id && (key === "total" || device.status === key),
    ).length;

  const reporting = rpmDevices.filter((device) => device.status === "with-readings").length;
  const waiting = rpmDevices.filter((device) => device.status === "no-readings").length;
  const attention = rpmDevices.filter(
    (device) => device.status === "suspended" || device.status === "deactivated",
  ).length;
  const unassigned = rpmDevices.filter((device) => device.patient == null).length;
  const fleetTotal = rpmDevices.length;
  const share = (value: number) => (fleetTotal === 0 ? 0 : Math.round((value / fleetTotal) * 100));

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border border-separator bg-surface shadow-none" style={panelStyle}>
        <Card.Content className="grid gap-6 p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="text-sm font-medium text-accent">Fleet</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Devices</h1>
            <p className="mt-1 max-w-md text-sm text-muted">
              {fleetTotal} remote monitoring devices. Expand a family to see how many are reporting.
            </p>
            <div className="mt-5">
              <MixBar
                segments={statusOrder.map((status) => ({
                  color: statusPaint[status],
                  value: rpmDevices.filter((device) => device.status === status).length,
                }))}
              />
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: statusPaint["with-readings"] }} />
                  Reporting
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: statusPaint["no-readings"] }} />
                  Waiting
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: statusPaint.suspended }} />
                  Suspended
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: statusPaint.deactivated }} />
                  Deactivated
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FleetStat
              color="success"
              detail={`${share(reporting)}% of the fleet`}
              label="Reporting"
              share={share(reporting)}
              value={reporting}
            />
            <FleetStat
              color="warning"
              detail="Assigned, no reading yet"
              label="Waiting"
              share={share(waiting)}
              value={waiting}
            />
            <FleetStat
              color="danger"
              detail="Suspended or deactivated"
              label="Needs attention"
              share={share(attention)}
              value={attention}
            />
            <FleetStat
              color="accent"
              detail="Ready to assign"
              label="Unassigned"
              share={share(unassigned)}
              value={unassigned}
            />
          </div>
        </Card.Content>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {deviceFamilies.map((item) => (
          <SummaryCard
            key={item.id}
            count={(key) => countFor(item.id, key)}
            family={item.id}
            label={item.label}
            selected={family === item.id}
            onFilter={() => setFamily((current) => (current === item.id ? "all" : item.id))}
          />
        ))}
      </div>

      <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
        <Card.Header className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Card.Title>Inventory</Card.Title>
            <Card.Description>
              {rows.length} {rows.length === 1 ? "device" : "devices"} in this view
            </Card.Description>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown>
              <Dropdown.Trigger className={toolbarButton}>
                {family === "all"
                  ? "All types"
                  : deviceFamilies.find((item) => item.id === family)?.label}
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu
                  aria-label="Filter by device type"
                  selectedKeys={new Set([family])}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const next = Array.from(keys)[0];

                    if (next) setFamily(String(next) as DeviceFamily | "all");
                  }}
                >
                  <Dropdown.Item id="all" textValue="All types">
                    All types
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                  {deviceFamilies.map((item) => (
                    <Dropdown.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                      <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
            <Dropdown>
              <Dropdown.Trigger className={toolbarButton}>
                {status === "all" ? "All statuses" : statusLabel(status)}
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu
                  aria-label="Filter by status"
                  selectedKeys={new Set([status])}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const next = Array.from(keys)[0];

                    if (next) setStatus(String(next) as DeviceStatus | "all");
                  }}
                >
                  <Dropdown.Item id="all" textValue="All statuses">
                    All statuses
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                  {deviceStatuses.map((item) => (
                    <Dropdown.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                      <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
            <TextField aria-label="Search devices" className="w-full sm:w-56" value={search} onChange={setSearch}>
              <InputGroup>
                <InputGroup.Prefix>
                  <SearchIcon className="pointer-events-none text-base text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Search..." />
              </InputGroup>
            </TextField>
          </div>
        </Card.Header>
        <Card.Content className="px-2 pb-4">
          <Table aria-label="RPM devices" variant="primary">
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>Device</Table.Column>
                  <Table.Column>Patient</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Last reading</Table.Column>
                  <Table.Column>Battery</Table.Column>
                  <Table.Column className="text-end">Actions</Table.Column>
                </Table.Header>
                <Table.Body
                  items={rows}
                  renderEmptyState={() => (
                    <EmptyState className="py-10 text-center text-sm text-muted">
                      No devices match this filter.
                    </EmptyState>
                  )}
                >
                  {(device) => (
                    <Table.Row id={device.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-default text-accent">
                            <FamilyIcon family={device.family} />
                          </span>
                          <div>
                            <p className="font-medium">{device.model}</p>
                            <p className="text-xs text-muted">{device.serial}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {device.patient ? (
                          <div className="flex items-center gap-2">
                            <Avatar size="sm">
                              <Avatar.Fallback>{initials(device.patient)}</Avatar.Fallback>
                            </Avatar>
                            <span>{device.patient}</span>
                          </div>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <StatusChip status={device.status} />
                      </Table.Cell>
                      <Table.Cell>{device.lastReading ?? "—"}</Table.Cell>
                      <Table.Cell>
                        {device.battery == null ? (
                          "—"
                        ) : (
                          <div className="flex min-w-24 items-center gap-2">
                            <ProgressBar
                              aria-label={`${device.serial} battery`}
                              className="min-w-0 flex-1"
                              color={device.battery < 20 ? "danger" : device.battery < 50 ? "warning" : "success"}
                              value={device.battery}
                            >
                              <ProgressBar.Track style={{ borderRadius: 999, height: 6 }}>
                                <ProgressBar.Fill style={{ borderRadius: 999 }} />
                              </ProgressBar.Track>
                            </ProgressBar>
                            <span className="w-8 text-xs tabular-nums text-muted">{device.battery}%</span>
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        <Button size="sm" variant="ghost" onPress={() => setSelected(device)}>
                          View
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card.Content>
      </Card>

      <Modal
        isOpen={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>{selected?.model ?? "Device"}</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                {selected ? (
                  <div className="flex flex-col gap-3 text-sm">
                    <StatusChip status={selected.status} />
                    <Detail label="Serial">{selected.serial}</Detail>
                    <Detail label="IMEI">{selected.imei}</Detail>
                    <Detail label="Patient">{selected.patient ?? "Unassigned"}</Detail>
                    <Detail label="Last reading">{selected.lastReading ?? "None yet"}</Detail>
                    <Detail label="Battery">
                      {selected.battery == null ? "—" : `${selected.battery}%`}
                    </Detail>
                    <Detail label="Last check-in">{selected.checkedIn ?? "Has not checked in"}</Detail>
                  </div>
                ) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onPress={() => setSelected(null)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
