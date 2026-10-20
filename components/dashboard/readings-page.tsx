"use client";

import {
  Avatar,
  Button,
  Card,
  Chip,
  Dropdown,
  EmptyState,
  Modal,
  Pagination,
  Table,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { Fragment, useEffect, useMemo, useState, type CSSProperties } from "react";

import {
  bloodPressureReadings,
  inReadingRange,
  readingNote,
  readingPatient,
  readingRanges,
  type BloodPressureReading,
  type ReadingNote,
  type ReadingRange,
} from "./readings-data";

const panelStyle: CSSProperties = {
  borderRadius: 16,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const toolbarButton =
  "button button--tertiary button--sm !inline-flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 rounded-full px-3";

const pageSize = 6;

const noteColor: Record<ReadingNote, "danger" | "success" | "warning"> = {
  Caution: "warning",
  Critical: "danger",
  Normal: "success",
};

const sysBands = [
  { from: 80, to: 90, level: 1 },
  { from: 90, to: 140, level: 0 },
  { from: 140, to: 180, level: 1 },
  { from: 180, to: 220, level: 2 },
];

const diaBands = [
  { from: 40, to: 60, level: 1 },
  { from: 60, to: 90, level: 0 },
  { from: 90, to: 120, level: 1 },
  { from: 120, to: 200, level: 2 },
];

const zoneFill = ["#86efac", "#fde047", "#fdba74"];

const chart = {
  height: 340,
  pad: { bottom: 36, left: 44, right: 16, top: 16 },
  width: 520,
  xMax: 220,
  xMin: 80,
  yMax: 200,
  yMin: 40,
};

function scaleX(value: number) {
  const width = chart.width - chart.pad.left - chart.pad.right;

  return chart.pad.left + ((value - chart.xMin) / (chart.xMax - chart.xMin)) * width;
}

function scaleY(value: number) {
  const height = chart.height - chart.pad.top - chart.pad.bottom;

  return chart.pad.top + ((chart.yMax - value) / (chart.yMax - chart.yMin)) * height;
}

function average(readings: BloodPressureReading[], key: "diastolic" | "heartRate" | "map" | "systolic") {
  const total = readings.reduce((sum, reading) => sum + reading[key], 0);

  return Math.round(total / readings.length);
}

function PressureChart({ readings }: { readings: BloodPressureReading[] }) {
  const xTicks = [80, 100, 120, 140, 160, 180, 200, 220];
  const yTicks = [40, 60, 80, 100, 120, 140, 160, 180, 200];

  return (
    <svg
      aria-label="Systolic and diastolic scatter"
      className="h-auto w-full text-muted"
      role="img"
      viewBox={`0 0 ${chart.width} ${chart.height}`}
    >
      {diaBands.map((dia) =>
        sysBands.map((sys) => {
          const level = Math.max(sys.level, dia.level);

          return (
            <rect
              key={`${sys.from}-${dia.from}`}
              fill={zoneFill[level]}
              height={scaleY(dia.from) - scaleY(dia.to)}
              width={scaleX(sys.to) - scaleX(sys.from)}
              x={scaleX(sys.from)}
              y={scaleY(dia.to)}
            />
          );
        }),
      )}
      {xTicks.map((tick) => (
        <g key={`x-${tick}`}>
          <line
            stroke="currentColor"
            strokeOpacity="0.18"
            x1={scaleX(tick)}
            x2={scaleX(tick)}
            y1={chart.pad.top}
            y2={chart.height - chart.pad.bottom}
          />
          <text
            fill="currentColor"
            fontSize="11"
            textAnchor="middle"
            x={scaleX(tick)}
            y={chart.height - 12}
          >
            {tick}
          </text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y-${tick}`}>
          <line
            stroke="currentColor"
            strokeOpacity="0.12"
            x1={chart.pad.left}
            x2={chart.width - chart.pad.right}
            y1={scaleY(tick)}
            y2={scaleY(tick)}
          />
          <text fill="currentColor" fontSize="11" textAnchor="end" x={chart.pad.left - 8} y={scaleY(tick) + 4}>
            {tick}
          </text>
        </g>
      ))}
      <text
        fill="currentColor"
        fontSize="12"
        textAnchor="middle"
        x={(chart.pad.left + chart.width - chart.pad.right) / 2}
        y={chart.height - 1}
      >
        Systolic
      </text>
      <text
        fill="currentColor"
        fontSize="12"
        textAnchor="middle"
        transform={`translate(14 ${(chart.pad.top + chart.height - chart.pad.bottom) / 2}) rotate(-90)`}
      >
        Diastolic
      </text>
      {readings.map((reading) => (
        <circle
          key={reading.id}
          aria-label={`${reading.label}: ${reading.systolic}/${reading.diastolic} mmHg`}
          cx={scaleX(reading.systolic)}
          cy={scaleY(reading.diastolic)}
          fill="white"
          r="4.5"
          stroke="#334155"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

function StatCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
      <Card.Header className="px-4 pt-4">
        <p className="text-sm text-muted">{label}</p>
      </Card.Header>
      <Card.Content className="px-4 pb-4">
        <p className="text-xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted">{detail}</p>
      </Card.Content>
    </Card>
  );
}

function NoteChip({ note }: { note: ReadingNote }) {
  return (
    <Chip color={noteColor[note]} size="sm" variant="soft">
      <Chip.Label>{note}</Chip.Label>
    </Chip>
  );
}

function PressureValue({ reading }: { reading: BloodPressureReading }) {
  const note = readingNote(reading);

  return (
    <span className={note === "Normal" ? "text-success" : note === "Caution" ? "text-warning" : "text-danger"}>
      <span className="font-medium">
        {reading.systolic}/{reading.diastolic}
      </span>{" "}
      <span className="text-xs">mmHg</span>
    </span>
  );
}

function RangeScale({
  markers,
  segments,
  title,
}: {
  markers: number[];
  segments: Array<{ color: string; from: number; to: number }>;
  title: string;
}) {
  const max = 200;

  return (
    <div>
      <p className="mb-8 text-sm font-medium">{title}</p>
      <div className="relative pt-1">
        {markers.map((value) => (
          <span
            key={value}
            className="absolute -top-7 -translate-x-1/2 rounded-md border border-separator bg-surface px-1.5 py-0.5 text-[11px] text-muted"
            style={{ left: `${(value / max) * 100}%` }}
          >
            {value}
          </span>
        ))}
        <div className="flex h-2.5 overflow-hidden rounded-full">
          {segments.map((segment) => (
            <div
              key={`${segment.from}-${segment.to}`}
              style={{
                background: segment.color,
                width: `${((segment.to - segment.from) / max) * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export function ReadingsPage() {
  const [range, setRange] = useState<ReadingRange>("30d");
  const [note, setNote] = useState<ReadingNote | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BloodPressureReading | null>(null);

  const ranged = useMemo(
    () => bloodPressureReadings.filter((reading) => inReadingRange(reading, range)),
    [range],
  );

  const feed = useMemo(
    () => ranged.filter((reading) => note === "all" || readingNote(reading) === note),
    [note, ranged],
  );

  const pageCount = Math.max(1, Math.ceil(feed.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = feed.length === 0 ? 0 : (currentPage - 1) * pageSize;
  const pageRows = feed.slice(start, start + pageSize);
  const lowest = [...ranged].sort((a, b) => a.systolic - b.systolic || a.diastolic - b.diastolic)[0];
  const highest = [...ranged].sort((a, b) => b.systolic - a.systolic || b.diastolic - a.diastolic)[0];

  useEffect(() => {
    setPage(1);
  }, [note, range]);

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === pageCount || Math.abs(item - currentPage) <= 1,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <Avatar color="accent" size="lg">
            <Avatar.Fallback>{readingPatient.initials}</Avatar.Fallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted">Blood pressure monitor</p>
            <h1 className="text-xl font-semibold tracking-tight">{readingPatient.name}</h1>
            <p className="text-sm text-muted">
              {readingPatient.device} · {readingPatient.condition}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Chip size="sm" variant="soft">
            <Chip.Label>IMEI {readingPatient.imei}</Chip.Label>
          </Chip>
          <ToggleButtonGroup
            disallowEmptySelection
            className="flex-wrap"
            selectedKeys={new Set([range])}
            selectionMode="single"
            size="sm"
            onSelectionChange={(keys) => {
              const next = Array.from(keys)[0];

              if (next) setRange(String(next) as ReadingRange);
            }}
          >
            {readingRanges.map((item) => (
              <ToggleButton key={item.id} id={item.id}>
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
          <Card.Header className="flex flex-row items-center justify-between px-4 pt-4">
            <div>
              <Card.Title>Blood pressure</Card.Title>
              <Card.Description>Systolic against diastolic for this window.</Card.Description>
            </div>
            <div className="flex gap-2">
              <NoteChip note="Normal" />
              <NoteChip note="Caution" />
              <NoteChip note="Critical" />
            </div>
          </Card.Header>
          <Card.Content className="px-3 pb-4">
            {ranged.length === 0 ? (
              <EmptyState className="py-16 text-center text-sm text-muted">
                No readings in this window.
              </EmptyState>
            ) : (
              <PressureChart readings={ranged} />
            )}
          </Card.Content>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {lowest && highest ? (
              <>
                <StatCard
                  detail={`${lowest.label} · ${lowest.heartRate} bpm · MAP ${lowest.map}`}
                  label="Lowest"
                  value={`${lowest.systolic}/${lowest.diastolic} mmHg`}
                />
                <StatCard
                  detail={`${highest.label} · ${highest.heartRate} bpm · MAP ${highest.map}`}
                  label="Highest"
                  value={`${highest.systolic}/${highest.diastolic} mmHg`}
                />
                <StatCard
                  detail={`${average(ranged, "heartRate")} bpm · MAP ${average(ranged, "map")} · ${ranged.length} readings`}
                  label="Average"
                  value={`${average(ranged, "systolic")}/${average(ranged, "diastolic")} mmHg`}
                />
              </>
            ) : (
              <Card className="border border-separator bg-surface shadow-none sm:col-span-3" style={panelStyle}>
                <Card.Content className="px-4 py-8 text-sm text-muted">
                  Summary appears when this window has readings.
                </Card.Content>
              </Card>
            )}
          </div>

          <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
            <Card.Header className="px-4 pt-4">
              <Card.Title>Recent readings</Card.Title>
              <Card.Description>
                {lowest
                  ? `Lowest in this window is ${lowest.systolic}/${lowest.diastolic} mmHg.`
                  : "Nothing recorded in this window."}
              </Card.Description>
            </Card.Header>
            <Card.Content className="px-2 pb-3">
              <Table aria-label="Recent blood pressure readings" variant="primary">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column isRowHeader>When</Table.Column>
                      <Table.Column>Pressure</Table.Column>
                      <Table.Column>Rate</Table.Column>
                      <Table.Column>Note</Table.Column>
                    </Table.Header>
                    <Table.Body
                      items={ranged.slice(0, 6)}
                      renderEmptyState={() => (
                        <EmptyState className="py-8 text-center text-sm text-muted">
                          No readings in this window.
                        </EmptyState>
                      )}
                    >
                      {(reading) => (
                        <Table.Row id={reading.id}>
                          <Table.Cell>{reading.label}</Table.Cell>
                          <Table.Cell>
                            <PressureValue reading={reading} />
                          </Table.Cell>
                          <Table.Cell>{reading.heartRate} bpm</Table.Cell>
                          <Table.Cell>
                            <NoteChip note={readingNote(reading)} />
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
        <Card.Header className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Card.Title>Measurement feed</Card.Title>
            <Card.Description>
              {readingRanges.find((item) => item.id === range)?.label} · {feed.length}{" "}
              {feed.length === 1 ? "blood pressure reading" : "blood pressure readings"}
            </Card.Description>
          </div>
          <Dropdown>
            <Dropdown.Trigger className={toolbarButton}>
              {note === "all" ? "All notes" : note}
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                aria-label="Filter by note"
                selectedKeys={new Set([note])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const next = Array.from(keys)[0];

                  if (next) setNote(String(next) as ReadingNote | "all");
                }}
              >
                <Dropdown.Item id="all" textValue="All notes">
                  All notes
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                {(["Normal", "Caution", "Critical"] as ReadingNote[]).map((item) => (
                  <Dropdown.Item key={item} id={item} textValue={item}>
                    {item}
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3 px-2 pb-4">
          <Table aria-label="Measurement feed" variant="primary">
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>Date</Table.Column>
                  <Table.Column>Blood pressure</Table.Column>
                  <Table.Column>Heart rate</Table.Column>
                  <Table.Column>MAP</Table.Column>
                  <Table.Column>Battery</Table.Column>
                  <Table.Column>Notes</Table.Column>
                  <Table.Column className="text-end"> </Table.Column>
                </Table.Header>
                <Table.Body
                  items={pageRows}
                  renderEmptyState={() => (
                    <EmptyState className="py-10 text-center text-sm text-muted">
                      No readings match this filter.
                    </EmptyState>
                  )}
                >
                  {(reading) => (
                    <Table.Row id={`feed-${reading.id}`}>
                      <Table.Cell>{reading.label}</Table.Cell>
                      <Table.Cell>
                        <PressureValue reading={reading} />
                      </Table.Cell>
                      <Table.Cell>{reading.heartRate} bpm</Table.Cell>
                      <Table.Cell>{reading.map}</Table.Cell>
                      <Table.Cell>{reading.battery}%</Table.Cell>
                      <Table.Cell>
                        <NoteChip note={readingNote(reading)} />
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        <Button size="sm" variant="ghost" onPress={() => setSelected(reading)}>
                          View
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          <Pagination className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
            <Pagination.Summary className="text-sm text-muted">
              {feed.length === 0
                ? "Showing 0 readings"
                : `Showing ${start + 1} to ${Math.min(start + pageSize, feed.length)} of ${feed.length}`}
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={currentPage === 1}
                  onPress={() => setPage(Math.max(1, currentPage - 1))}
                >
                  Previous
                </Pagination.Previous>
              </Pagination.Item>
              {pages.map((item, index) => {
                const previous = pages[index - 1];

                return (
                  <Fragment key={item}>
                    {previous && item - previous > 1 ? (
                      <Pagination.Item>
                        <Pagination.Ellipsis />
                      </Pagination.Item>
                    ) : null}
                    <Pagination.Item>
                      <Pagination.Link isActive={item === currentPage} onPress={() => setPage(item)}>
                        {item}
                      </Pagination.Link>
                    </Pagination.Item>
                  </Fragment>
                );
              })}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={currentPage === pageCount || feed.length === 0}
                  onPress={() => setPage(Math.min(pageCount, currentPage + 1))}
                >
                  Next
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Card.Content>
      </Card>

      <Card className="border border-separator bg-surface shadow-none" style={panelStyle}>
        <Card.Header className="px-4 pt-4">
          <Card.Title>Warning and critical ranges</Card.Title>
          <Card.Description>
            Green is the target band. Yellow is a warning, and orange is critical.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-10 px-4 pb-6 pt-2">
          <RangeScale
            markers={[70, 90, 140, 180]}
            segments={[
              { color: "#fdba74", from: 0, to: 70 },
              { color: "#fde047", from: 70, to: 90 },
              { color: "#4ade80", from: 90, to: 140 },
              { color: "#fde047", from: 140, to: 180 },
              { color: "#fdba74", from: 180, to: 200 },
            ]}
            title="Systolic"
          />
          <RangeScale
            markers={[40, 60, 90, 120]}
            segments={[
              { color: "#fdba74", from: 0, to: 40 },
              { color: "#fde047", from: 40, to: 60 },
              { color: "#4ade80", from: 60, to: 90 },
              { color: "#fde047", from: 90, to: 120 },
              { color: "#fdba74", from: 120, to: 200 },
            ]}
            title="Diastolic"
          />
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
                <Modal.Heading>Reading</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                {selected ? (
                  <div className="flex flex-col gap-3 text-sm">
                    <p className="font-medium">{selected.label}</p>
                    <p>
                      <span className="text-muted">Blood pressure </span>
                      {selected.systolic}/{selected.diastolic} mmHg
                    </p>
                    <p>
                      <span className="text-muted">Heart rate </span>
                      {selected.heartRate} bpm
                    </p>
                    <p>
                      <span className="text-muted">MAP </span>
                      {selected.map}
                    </p>
                    <p>
                      <span className="text-muted">Battery </span>
                      {selected.battery}%
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Note</span>
                      <NoteChip note={readingNote(selected)} />
                    </div>
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
