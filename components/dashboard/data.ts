import { navIcons } from "./icons";

export type DashboardKey = (typeof dashboardNav)[number]["key"];

export const dashboardNav = [
  { key: "overview", label: "Overview", icon: "grid", href: "/" },
  { key: "patients", label: "Patients", icon: "users", href: "/patients" },
  { key: "readings", label: "Readings", icon: "chart", href: "/readings" },
  { key: "devices", label: "Devices", icon: "medical", href: "/devices" },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  icon: keyof typeof navIcons;
  href: string;
}>;

export const statusFilters = [
  "all",
  "Stable",
  "Active",
  "At risk",
  "Review",
] as const;

export type StatusFilter = (typeof statusFilters)[number];
export type Period = "30d" | "90d" | "12m";
export type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

export const periods: Period[] = ["30d", "90d", "12m"];

export const periodLabel: Record<Period, string> = {
  "12m": "12 months",
  "30d": "30 days",
  "90d": "90 days",
};

type Snapshot = {
  range: string;
  rpm: Array<{
    detail: string;
    label: string;
    spark: number[];
    tone: "danger" | "foreground" | "accent";
    trend?: { color: ChipColor; label: string };
    value: string;
  }>;
  care: Array<{
    detail: string;
    label: string;
    progress?: number;
    progressColor?: "accent" | "danger" | "success" | "warning";
    value: string;
  }>;
  services: {
    completed: number[];
    labels: string[];
    scheduled: number[];
  };
  compliance: {
    labels: string[];
    late: number[];
    missed: number[];
    onTime: number[];
  };
};

export const snapshots: Record<Period, Snapshot> = {
  "30d": {
    range: "9/22/2026 – 10/21/2026",
    rpm: [
      {
        label: "Active RPM patients",
        value: "1,284",
        detail: "142 enrolled this month",
        trend: { label: "+6%", color: "success" },
        spark: [18, 19, 21, 20, 23, 25, 24, 28],
        tone: "foreground",
      },
      {
        label: "Readings captured",
        value: "18.4k",
        detail: "94% of expected transmissions",
        trend: { label: "+3%", color: "success" },
        spark: [40, 44, 42, 48, 46, 52, 55, 58],
        tone: "accent",
      },
      {
        label: "Critical alerts",
        value: "17",
        detail: "BP and SpO2 out of range",
        trend: { label: "+4", color: "danger" },
        spark: [4, 5, 4, 6, 8, 7, 11, 17],
        tone: "danger",
      },
    ],
    care: [
      {
        label: "Care plan adherence",
        value: "81%",
        detail: "1,040 of 1,284 patients on plan",
        progress: 81,
        progressColor: "success",
      },
      {
        label: "Patients at risk",
        value: "24",
        detail: "12 rising BP · 8 low adherence",
        progress: 24,
        progressColor: "warning",
      },
      {
        label: "Overdue follow-ups",
        value: "11",
        detail: "11 of 29 calls still open",
        progress: 38,
        progressColor: "danger",
      },
    ],
    services: {
      labels: ["RPM setup", "Education", "Monitoring", "Care mgmt", "CCM"],
      completed: [42, 36, 96, 74, 61],
      scheduled: [48, 40, 110, 88, 70],
    },
    compliance: {
      labels: ["Sep 22", "Sep 29", "Oct 6", "Oct 13", "Oct 20"],
      onTime: [18, 21, 19, 23, 20],
      late: [34, 31, 36, 29, 27],
      missed: [12, 14, 11, 15, 10],
    },
  },
  "90d": {
    range: "7/24/2026 – 10/21/2026",
    rpm: [
      {
        label: "Active RPM patients",
        value: "1,196",
        detail: "310 enrolled this quarter",
        trend: { label: "+11%", color: "success" },
        spark: [12, 14, 16, 18, 19, 22, 25, 28],
        tone: "foreground",
      },
      {
        label: "Readings captured",
        value: "51.2k",
        detail: "91% of expected transmissions",
        trend: { label: "+8%", color: "success" },
        spark: [30, 34, 33, 38, 41, 44, 49, 52],
        tone: "accent",
      },
      {
        label: "Critical alerts",
        value: "46",
        detail: "Mostly overnight BP spikes",
        trend: { label: "-6", color: "success" },
        spark: [18, 16, 15, 14, 12, 11, 9, 8],
        tone: "danger",
      },
    ],
    care: [
      {
        label: "Care plan adherence",
        value: "78%",
        detail: "932 of 1,196 patients on plan",
        progress: 78,
        progressColor: "success",
      },
      {
        label: "Patients at risk",
        value: "31",
        detail: "19 rising BP · 12 missed CCM",
        progress: 31,
        progressColor: "warning",
      },
      {
        label: "Overdue follow-ups",
        value: "18",
        detail: "18 of 64 calls still open",
        progress: 28,
        progressColor: "danger",
      },
    ],
    services: {
      labels: ["RPM setup", "Education", "Monitoring", "Care mgmt", "CCM"],
      completed: [118, 104, 286, 210, 176],
      scheduled: [130, 112, 310, 240, 198],
    },
    compliance: {
      labels: ["Aug", "Sep", "Oct"],
      onTime: [24, 21, 19],
      late: [40, 34, 28],
      missed: [16, 13, 11],
    },
  },
  "12m": {
    range: "10/21/2025 – 10/21/2026",
    rpm: [
      {
        label: "Active RPM patients",
        value: "1,284",
        detail: "468 net new this year",
        trend: { label: "+28%", color: "success" },
        spark: [8, 10, 12, 14, 16, 19, 23, 28],
        tone: "foreground",
      },
      {
        label: "Readings captured",
        value: "196k",
        detail: "89% of expected transmissions",
        trend: { label: "+19%", color: "success" },
        spark: [22, 24, 28, 30, 36, 41, 48, 55],
        tone: "accent",
      },
      {
        label: "Critical alerts",
        value: "163",
        detail: "Down after the summer review",
        trend: { label: "-14%", color: "success" },
        spark: [28, 26, 24, 22, 18, 16, 14, 12],
        tone: "danger",
      },
    ],
    care: [
      {
        label: "Care plan adherence",
        value: "84%",
        detail: "1,078 of 1,284 patients on plan",
        progress: 84,
        progressColor: "success",
      },
      {
        label: "Patients at risk",
        value: "19",
        detail: "7 rising BP · 12 low adherence",
        progress: 19,
        progressColor: "warning",
      },
      {
        label: "Overdue follow-ups",
        value: "9",
        detail: "9 of 40 calls still open",
        progress: 22,
        progressColor: "danger",
      },
    ],
    services: {
      labels: ["RPM setup", "Education", "Monitoring", "Care mgmt", "CCM"],
      completed: [420, 388, 1104, 860, 742],
      scheduled: [460, 410, 1210, 940, 810],
    },
    compliance: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      onTime: [30, 26, 22, 18],
      late: [48, 40, 34, 27],
      missed: [20, 16, 13, 10],
    },
  },
};

export const patients = [
  {
    name: "Maria Alvarez",
    initial: "MA",
    age: 67,
    program: "RPM",
    condition: "Hypertension",
    reading: "BP 132/84",
    when: "2h ago",
    device: "BP cuff",
    status: "Active",
    color: "accent" as ChipColor,
  },
  {
    name: "James Carter",
    initial: "JC",
    age: 74,
    program: "RPM + CCM",
    condition: "Heart failure",
    reading: "Weight 188 lb",
    when: "6h ago",
    device: "Scale",
    status: "At risk",
    color: "warning" as ChipColor,
  },
  {
    name: "Priya Shah",
    initial: "PS",
    age: 58,
    program: "RPM",
    condition: "Type 2 diabetes",
    reading: "Glucose 142",
    when: "1h ago",
    device: "Glucometer",
    status: "Stable",
    color: "success" as ChipColor,
  },
  {
    name: "Noah Bennett",
    initial: "NB",
    age: 71,
    program: "RPM + CCM",
    condition: "COPD",
    reading: "SpO2 93%",
    when: "25m ago",
    device: "Pulse ox",
    status: "Review",
    color: "danger" as ChipColor,
  },
  {
    name: "Elena Rossi",
    initial: "ER",
    age: 63,
    program: "CCM",
    condition: "Hypertension",
    reading: "BP 118/76",
    when: "1d ago",
    device: "BP cuff",
    status: "Stable",
    color: "success" as ChipColor,
  },
  {
    name: "Omar Haddad",
    initial: "OH",
    age: 69,
    program: "RPM",
    condition: "Heart failure",
    reading: "Weight +3.1 lb",
    when: "4h ago",
    device: "Scale",
    status: "At risk",
    color: "warning" as ChipColor,
  },
];

export const activity = [
  {
    title: "Critical blood pressure",
    detail: "Maria Alvarez",
    time: "12 min ago",
    icon: "plus" as const,
  },
  {
    title: "Missed transmission",
    detail: "James Carter",
    time: "1 hour ago",
    icon: "calendar" as const,
  },
  {
    title: "Care plan updated",
    detail: "Priya Shah",
    time: "3 hours ago",
    icon: "file" as const,
  },
  {
    title: "CCM minutes logged",
    detail: "Noah Bennett",
    time: "Yesterday",
    icon: "check" as const,
  },
];

export function statusColor(status: string): ChipColor {
  switch (status) {
    case "Active":
      return "accent";
    case "Stable":
      return "success";
    case "At risk":
      return "warning";
    case "Review":
      return "danger";
    default:
      return "default";
  }
}

export function matchesQuery(query: string, values: string[]) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) return true;

  return values.some((value) => value.toLowerCase().includes(normalized));
}

export function matchesStatus(filter: StatusFilter, status: string) {
  return filter === "all" || filter === status;
}

export function dashboardHref(key: string) {
  return dashboardNav.find((item) => item.key === key)?.href ?? "/";
}

export type PatientProgram = "RPM" | "CCM" | "RPM + CCM";
export type PatientStatus = "Stable" | "Active" | "At risk" | "Review";

export type DirectoryPatient = {
  id: string;
  code: string;
  name: string;
  email: string;
  initials: string;
  program: PatientProgram;
  status: PatientStatus;
  condition: string;
  device: string;
  reading: string;
  color: ChipColor;
};

export const patientPrograms: PatientProgram[] = ["RPM", "CCM", "RPM + CCM"];
export const patientStatuses: PatientStatus[] = [
  "Stable",
  "Active",
  "At risk",
  "Review",
];

export const directoryPatients: DirectoryPatient[] = [
  {
    id: "pt-4586101",
    code: "#4586101",
    name: "Maria Alvarez",
    email: "maria.alvarez@caremail.com",
    initials: "MA",
    program: "RPM",
    status: "Active",
    condition: "Hypertension",
    device: "BP cuff",
    reading: "132/84 mmHg",
    color: "accent",
  },
  {
    id: "pt-4586102",
    code: "#4586102",
    name: "James Carter",
    email: "james.carter@caremail.com",
    initials: "JC",
    program: "RPM + CCM",
    status: "At risk",
    condition: "Heart failure",
    device: "Scale",
    reading: "188 lb, +2.4 lb",
    color: "warning",
  },
  {
    id: "pt-4586103",
    code: "#4586103",
    name: "Priya Shah",
    email: "priya.shah@caremail.com",
    initials: "PS",
    program: "RPM",
    status: "Stable",
    condition: "Type 2 diabetes",
    device: "Glucometer",
    reading: "142 mg/dL",
    color: "success",
  },
  {
    id: "pt-4586104",
    code: "#4586104",
    name: "Noah Bennett",
    email: "noah.bennett@caremail.com",
    initials: "NB",
    program: "RPM + CCM",
    status: "Review",
    condition: "COPD",
    device: "Pulse ox",
    reading: "SpO2 93%",
    color: "danger",
  },
  {
    id: "pt-4586105",
    code: "#4586105",
    name: "Elena Rossi",
    email: "elena.rossi@caremail.com",
    initials: "ER",
    program: "CCM",
    status: "Stable",
    condition: "Hypertension",
    device: "BP cuff",
    reading: "118/76 mmHg",
    color: "accent",
  },
  {
    id: "pt-4586106",
    code: "#4586106",
    name: "Omar Haddad",
    email: "omar.haddad@caremail.com",
    initials: "OH",
    program: "RPM",
    status: "At risk",
    condition: "Heart failure",
    device: "Scale",
    reading: "+3.1 lb overnight",
    color: "warning",
  },
  {
    id: "pt-4586107",
    code: "#4586107",
    name: "Helen Cho",
    email: "helen.cho@caremail.com",
    initials: "HC",
    program: "RPM",
    status: "Review",
    condition: "Type 2 diabetes",
    device: "Glucometer",
    reading: "168 mg/dL",
    color: "danger",
  },
  {
    id: "pt-4586108",
    code: "#4586108",
    name: "Luis Ortega",
    email: "luis.ortega@caremail.com",
    initials: "LO",
    program: "RPM",
    status: "Active",
    condition: "COPD",
    device: "Pulse ox",
    reading: "SpO2 96%",
    color: "success",
  },
  {
    id: "pt-4586109",
    code: "#4586109",
    name: "Amina Diallo",
    email: "amina.diallo@caremail.com",
    initials: "AD",
    program: "CCM",
    status: "Stable",
    condition: "Hypertension",
    device: "BP cuff",
    reading: "124/78 mmHg",
    color: "accent",
  },
  {
    id: "pt-4586110",
    code: "#4586110",
    name: "Robert Klein",
    email: "robert.klein@caremail.com",
    initials: "RK",
    program: "RPM + CCM",
    status: "Active",
    condition: "Heart failure",
    device: "Scale",
    reading: "176 lb",
    color: "success",
  },
];
