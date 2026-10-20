export type ReadingRange = "day" | "week" | "30d" | "3m" | "6m" | "all";
export type ReadingNote = "Normal" | "Caution" | "Critical";

export type BloodPressureReading = {
  id: string;
  label: string;
  daysAgo: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  map: number;
  battery: number;
};

export const readingPatient = {
  name: "Maria Alvarez",
  initials: "MA",
  email: "maria.alvarez@caremail.com",
  condition: "Hypertension",
  device: "Pylo Blood Pressure Cuff",
  imei: "868369081384802",
};

export const readingRanges: Array<{ id: ReadingRange; label: string; days: number | null }> = [
  { id: "day", label: "Day", days: 1 },
  { id: "week", label: "Week", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "3m", label: "3 months", days: 90 },
  { id: "6m", label: "6 months", days: 180 },
  { id: "all", label: "All", days: null },
];

export const bloodPressureReadings: BloodPressureReading[] = [
  { id: "r1", label: "10/20/2026 07:46 AM", daysAgo: 0.2, systolic: 145, diastolic: 77, heartRate: 65, map: 100, battery: 60 },
  { id: "r2", label: "10/19/2026 10:33 PM", daysAgo: 0.7, systolic: 157, diastolic: 77, heartRate: 70, map: 104, battery: 60 },
  { id: "r3", label: "10/19/2026 10:52 AM", daysAgo: 1.1, systolic: 112, diastolic: 54, heartRate: 66, map: 73, battery: 60 },
  { id: "r4", label: "10/19/2026 07:36 AM", daysAgo: 1.2, systolic: 185, diastolic: 85, heartRate: 64, map: 118, battery: 60 },
  { id: "r5", label: "10/18/2026 10:21 PM", daysAgo: 1.6, systolic: 169, diastolic: 82, heartRate: 67, map: 111, battery: 60 },
  { id: "r6", label: "10/18/2026 10:20 PM", daysAgo: 1.7, systolic: 169, diastolic: 83, heartRate: 66, map: 112, battery: 60 },
  { id: "r7", label: "10/18/2026 07:44 AM", daysAgo: 2.2, systolic: 152, diastolic: 71, heartRate: 66, map: 98, battery: 60 },
  { id: "r8", label: "10/17/2026 10:59 PM", daysAgo: 2.6, systolic: 136, diastolic: 62, heartRate: 74, map: 87, battery: 60 },
  { id: "r9", label: "10/17/2026 07:55 PM", daysAgo: 2.7, systolic: 147, diastolic: 63, heartRate: 62, map: 91, battery: 80 },
  { id: "r10", label: "10/17/2026 08:10 AM", daysAgo: 3.2, systolic: 146, diastolic: 76, heartRate: 60, map: 99, battery: 80 },
  { id: "r11", label: "10/15/2026 08:05 AM", daysAgo: 5.2, systolic: 128, diastolic: 78, heartRate: 68, map: 95, battery: 80 },
  { id: "r12", label: "10/14/2026 09:12 PM", daysAgo: 5.7, systolic: 138, diastolic: 84, heartRate: 72, map: 102, battery: 70 },
  { id: "r13", label: "10/12/2026 07:40 AM", daysAgo: 8.2, systolic: 122, diastolic: 74, heartRate: 64, map: 90, battery: 90 },
  { id: "r14", label: "10/10/2026 08:18 AM", daysAgo: 10.2, systolic: 118, diastolic: 70, heartRate: 63, map: 86, battery: 90 },
  { id: "r15", label: "10/08/2026 07:55 PM", daysAgo: 12.1, systolic: 151, diastolic: 88, heartRate: 71, map: 109, battery: 50 },
  { id: "r16", label: "10/06/2026 06:48 AM", daysAgo: 14.3, systolic: 109, diastolic: 66, heartRate: 61, map: 80, battery: 80 },
  { id: "r17", label: "10/03/2026 09:05 PM", daysAgo: 17, systolic: 142, diastolic: 81, heartRate: 69, map: 101, battery: 70 },
  { id: "r18", label: "09/28/2026 08:11 AM", daysAgo: 22, systolic: 91, diastolic: 49, heartRate: 68, map: 63, battery: 60 },
  { id: "r19", label: "09/24/2026 07:30 AM", daysAgo: 26, systolic: 134, diastolic: 79, heartRate: 66, map: 97, battery: 80 },
  { id: "r20", label: "09/18/2026 08:44 PM", daysAgo: 32, systolic: 126, diastolic: 76, heartRate: 64, map: 93, battery: 70 },
  { id: "r21", label: "09/02/2026 07:15 AM", daysAgo: 48, systolic: 148, diastolic: 86, heartRate: 73, map: 107, battery: 60 },
  { id: "r22", label: "08/16/2026 09:20 AM", daysAgo: 65, systolic: 119, diastolic: 72, heartRate: 62, map: 88, battery: 90 },
  { id: "r23", label: "07/20/2026 08:05 AM", daysAgo: 92, systolic: 155, diastolic: 90, heartRate: 70, map: 112, battery: 50 },
  { id: "r24", label: "06/11/2026 07:50 PM", daysAgo: 131, systolic: 132, diastolic: 80, heartRate: 67, map: 97, battery: 80 },
  { id: "r25", label: "05/04/2026 08:30 AM", daysAgo: 169, systolic: 121, diastolic: 73, heartRate: 65, map: 89, battery: 80 },
  { id: "r26", label: "03/12/2026 09:10 AM", daysAgo: 222, systolic: 140, diastolic: 85, heartRate: 68, map: 103, battery: 70 },
];

export function readingNote(reading: BloodPressureReading): ReadingNote {
  const critical =
    reading.systolic >= 180 ||
    reading.systolic < 70 ||
    reading.diastolic >= 120 ||
    reading.diastolic < 40;
  if (critical) return "Critical";

  const caution =
    reading.systolic >= 140 ||
    reading.systolic < 90 ||
    reading.diastolic >= 90 ||
    reading.diastolic < 60;
  if (caution) return "Caution";

  return "Normal";
}

export function inReadingRange(reading: BloodPressureReading, range: ReadingRange) {
  const window = readingRanges.find((item) => item.id === range);

  if (!window || window.days == null) return true;

  return reading.daysAgo <= window.days;
}
