export type ViolationCategory = {
  key: string;
  label: string;
  items: { code: string; label: string; defaultHours: number }[];
};

export const VIOLATION_CATEGORIES: ViolationCategory[] = [
  {
    key: "A",
    label: "Inappropriate Civilian Attire",
    items: [
      { code: "A1", label: "Croptop", defaultHours: 10 },
      { code: "A2", label: "Shorts", defaultHours: 10 },
      { code: "A3", label: "Mini-skirt", defaultHours: 10 },
      { code: "A4", label: "Leggings", defaultHours: 10 },
      { code: "A5", label: "Tattered jeans", defaultHours: 10 },
      { code: "A6", label: "Sandals / Slippers", defaultHours: 10 },
    ],
  },
  {
    key: "B",
    label: "Hair Violation",
    items: [
      { code: "B1", label: "Long hair", defaultHours: 10 },
      { code: "B2", label: "Colored hair", defaultHours: 10 },
      { code: "B3", label: "Improper haircut / hairstyle", defaultHours: 10 },
    ],
  },
  {
    key: "C",
    label: "Incomplete Uniform (Criminology)",
    items: [
      { code: "C1", label: "Lanyard", defaultHours: 8 },
      { code: "C2", label: "Whistle", defaultHours: 8 },
      { code: "C3", label: "Nameplate", defaultHours: 8 },
      { code: "C4", label: "Belt", defaultHours: 8 },
      { code: "C5", label: "Charol", defaultHours: 8 },
    ],
  },
  {
    key: "D",
    label: "Not Wearing Prescribed Uniform",
    items: [
      { code: "D1", label: "No patch", defaultHours: 10 },
      { code: "D2", label: "No necktie", defaultHours: 10 },
      { code: "D3", label: "Black or other pants", defaultHours: 10 },
      { code: "D4", label: "Colored footsocks", defaultHours: 10 },
      { code: "D5", label: "Unofficial P.E. or org shirt", defaultHours: 10 },
      { code: "D6", label: "Wearing P.E. uniform outside PE class/time", defaultHours: 12 },
      { code: "D7", label: "Wearing rubber shoes outside PE class/time", defaultHours: 12 },
    ],
  },
  {
    key: "E",
    label: "Identification",
    items: [
      { code: "E1", label: "Entering campus without official ID", defaultHours: 12 },
      { code: "E2", label: "Using unofficial ID", defaultHours: 15 },
      { code: "E3", label: "Using someone's ID", defaultHours: 20 },
      { code: "E4", label: "ID tampering", defaultHours: 25 },
      { code: "E5", label: "Using unofficial ID lace", defaultHours: 8 },
      { code: "E6", label: "No ID lace", defaultHours: 8 },
    ],
  },
  {
    key: "F",
    label: "Other Violations (OSD Rm. 108c)",
    items: [
      { code: "F1", label: "Disobedience / Disrespect", defaultHours: 20 },
    ],
  },
];
