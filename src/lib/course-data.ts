// ITS Ghaziabad — CCSU Affiliated
// BCA & BBA — 3 Year Programme (6 Semesters)
// Syllabus based on CCSU official curriculum (gngroup.org BCA PDF + CCSU BBA 2024-25)

export type CourseCode = "BCA" | "BBA";

export interface SemesterData {
  sem: number;
  year: number;
  label: string;
  subjects: string[];
}

// ─────────────────────────────────────────────────
// BCA — Bachelor of Computer Applications (CCSU)
// Source: gngroup.org BCA Syllabus PDF
// ─────────────────────────────────────────────────
export const BCA_SEMESTERS: SemesterData[] = [
  {
    sem: 1, year: 1,
    label: "Ist Year - Ist Semester",
    subjects: [
      "BCA-101: Mathematics - I",
      "BCA-102: Programming Principle & Algorithm",
      "BCA-103: Computer Fundamental & Office Automation",
      "BCA-104: Principle of Management",
      "BCA-105: Business Communication",
      "BCA-106P: Computer Lab (Office Automation & C Programming)",
    ],
  },
  {
    sem: 2, year: 1,
    label: "Ist Year - IInd Semester",
    subjects: [
      "BCA-201: Mathematics - II",
      "BCA-202: Object Oriented Programming Using C++",
      "BCA-203: Digital Electronics & Computer Organization",
      "BCA-204: Organizational Behavior",
      "BCA-205: Financial Accounting",
      "BCA-206P: C++ Programming Lab",
    ],
  },
  {
    sem: 3, year: 2,
    label: "IInd Year - IIIrd Semester",
    subjects: [
      "BCA-301: Mathematics - III",
      "BCA-302: Data Structures Using C",
      "BCA-303: Database Management System",
      "BCA-304: Software Engineering",
      "BCA-305: Business Economics",
      "BCA-306P: Data Structures & DBMS Lab",
    ],
  },
  {
    sem: 4, year: 2,
    label: "IInd Year - IVth Semester",
    subjects: [
      "BCA-401: Operating System",
      "BCA-402: Computer Graphics & Multimedia Application (CGMA)",
      "BCA-403: Operations Research (OT)",
      "BCA-404: Computer Architecture",
      "BCA-405: Elements of Statistics",
      "BCA-406P: CGMA Lab & OS Lab",
    ],
  },
  {
    sem: 5, year: 3,
    label: "IIIrd Year - Vth Semester",
    subjects: [
      "BCA-501: Computer Network",
      "BCA-502: Internet & Web Technology",
      "BCA-503: Java Programming",
      "BCA-504: System Analysis & Design",
      "BCA-505: Elective - I (Python / AI Fundamentals)",
      "BCA-506P: Java & Web Technology Lab",
    ],
  },
  {
    sem: 6, year: 3,
    label: "IIIrd Year - VIth Semester",
    subjects: [
      "BCA-601: Computer Network Security",
      "BCA-602: Information System Analysis, Design & Implementation",
      "BCA-603: E-Commerce",
      "BCA-604: Knowledge Management",
      "BCA-605P: Major Project",
      "BCA-606: Viva Voce",
    ],
  },
];

// ─────────────────────────────────────────────────
// BBA — Bachelor of Business Administration (CCSU NEP 2024-25)
// Source: bbaguru.in / CCSU official NEP updated syllabus
// ─────────────────────────────────────────────────
export const BBA_SEMESTERS: SemesterData[] = [
  {
    sem: 1, year: 1,
    label: "Ist Year - Ist Semester",
    subjects: [
      "BBA-101: Principles & Practices of Management",
      "BBA-102: Business Communication",
      "BBA-103: Financial Accounting",
      "BBA-104: Business Statistics & Logic",
      "BBA-105: General English",
      "BBA-106: Indian Knowledge System & Environmental Science",
    ],
  },
  {
    sem: 2, year: 1,
    label: "Ist Year - IInd Semester",
    subjects: [
      "BBA-201: Human Behaviour & Organization",
      "BBA-202: Marketing Management",
      "BBA-203: Cost & Management Accounting",
      "BBA-204: Business Law",
      "BBA-205: Computer Applications in Business",
      "BBA-206: Business Mathematics",
    ],
  },
  {
    sem: 3, year: 2,
    label: "IInd Year - IIIrd Semester",
    subjects: [
      "BBA-301: Management Accounting",
      "BBA-302: Legal & Ethical Issues in Business",
      "BBA-303: Human Resource Management",
      "BBA-304: Research Methodology",
      "BBA-305: Financial Management",
      "BBA-306: Summer Training Project Report (STPR)",
    ],
  },
  {
    sem: 4, year: 2,
    label: "IInd Year - IVth Semester",
    subjects: [
      "BBA-401: Entrepreneurship & Startup Ecosystem",
      "BBA-402: Operations Management",
      "BBA-403: Taxation (Direct & Indirect Tax)",
      "BBA-404: Banking & Insurance",
      "BBA-405: E-Commerce & Digital Marketing",
      "BBA-406: Business Ethics & Corporate Governance",
    ],
  },
  {
    sem: 5, year: 3,
    label: "IIIrd Year - Vth Semester",
    subjects: [
      "BBA-501: Strategic Management",
      "BBA-502: International Business",
      "BBA-503: Supply Chain & Logistics Management",
      "BBA-504: DSE-I (Marketing: Consumer Behavior / Finance: Security Analysis / HR: Training & Development)",
      "BBA-505: DSE-II (Retail Management / Investment Management / IR & Labour Laws)",
      "BBA-506: Project Work - I",
    ],
  },
  {
    sem: 6, year: 3,
    label: "IIIrd Year - VIth Semester",
    subjects: [
      "BBA-601: Project Management",
      "BBA-602: Business Taxation & GST",
      "BBA-603: Corporate Governance & Business Ethics",
      "BBA-604: DSE-III (Brand Management / Financial Derivatives / HR Analytics)",
      "BBA-605: DSE-IV (Services Marketing / Mergers & Acquisitions / Compensation Management)",
      "BBA-606: Major Project & Viva Voce",
    ],
  },
];

export const COURSE_SEMESTERS: Record<CourseCode, SemesterData[]> = {
  BCA: BCA_SEMESTERS,
  BBA: BBA_SEMESTERS,
};

export const COURSES = [
  { code: "BCA" as CourseCode, label: "BCA — Bachelor of Computer Applications", years: 3, sems: 6 },
  { code: "BBA" as CourseCode, label: "BBA — Bachelor of Business Administration", years: 3, sems: 6 },
];

export const SEMESTER_LABELS: Record<number, string> = {
  1: "Ist Semester", 2: "IInd Semester", 3: "IIIrd Semester",
  4: "IVth Semester", 5: "Vth Semester",  6: "VIth Semester",
};

export const YEAR_LABELS: Record<number, string> = {
  1: "Ist Year", 2: "IInd Year", 3: "IIIrd Year",
};

export function getSubjectsForSem(course: CourseCode, sem: number): string[] {
  return COURSE_SEMESTERS[course].find((s) => s.sem === sem)?.subjects ?? [];
}

export function getSemLabel(course: CourseCode, sem: number): string {
  return COURSE_SEMESTERS[course].find((s) => s.sem === sem)?.label ?? `Semester ${sem}`;
}
