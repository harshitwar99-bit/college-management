// Demo data used to seed localStorage for offline/demo mode
// In production, this data lives in Firestore

export const DEMO_USERS = [
    {
        uid: "student-demo-001",
        email: "harshitbbt_bca24_27@its.edu.in",
        password: "student123",
        role: "student",
        name: "HARSHIT",
        rollNumber: "240934106129",
        semester: "IInd Year - IVth Semester",
        branch: "BCA",
        division: "Section A",
        phone: "+91 9310830664",
        photo: "",
        fatherName: "Late Sh. Bansh Bahadur Tiwari",
        address: "A-458 Street No -04 Kabir Nagar Shahdara, Delhi 110094",
        seatType: "Merit",
        batch: "2024",
    },
    {
        uid: "faculty-demo-001",
        email: "faculty@college.edu",
        password: "faculty123",
        role: "faculty",
        name: "Dr. Priya Mehta",
        department: "Computer Science",
        subjects: ["Data Structures", "Algorithms", "DBMS"],
        classes: ["CS-4A", "CS-4B"],
        phone: "+91 91234 56789",
        photo: "",
    },
    {
        uid: "coordinator-demo-001",
        email: "coordinator@college.edu",
        password: "coordinator123",
        role: "coordinator",
        name: "Mr. Anil Kapoor",
        phone: "+91 99887 76655",
        photo: "",
    },
];

export const DEMO_ATTENDANCE = [
    { subject: "CGMA-Lab", total: 5, present: 5, percent: 100 },
    { subject: "OT-Theory", total: 17, present: 17, percent: 100 },
    { subject: "CGMA-Theory", total: 16, present: 15, percent: 93.75 },
    { subject: "CET-Theory", total: 6, present: 5, percent: 83.33 },
    { subject: "Mathematics - III-Theory", total: 15, present: 12, percent: 80.00 },
    { subject: "SE-Theory", total: 14, present: 11, percent: 78.57 },
    { subject: "OS-Theory", total: 9, present: 7, percent: 77.78 },
];

export const DEMO_TIMETABLE: Record<string, Array<{ time: string; end: string; subject: string; faculty: string; room: string }>> = {
    Monday: [
        { time: "09:15", end: "10:10", subject: "Mathematics - III", faculty: "Dr. Abhay Pratap Singh", room: "101" },
        { time: "10:10", end: "11:05", subject: "OS-Theory", faculty: "Mrs. Arpana Jain", room: "102" },
        { time: "11:15", end: "12:10", subject: "CGMA-Lab", faculty: "Mr. Alok Kapil", room: "Lab-1" },
        { time: "12:10", end: "13:05", subject: "OT-Theory", faculty: "Mr. Prashant Tyagi", room: "103" },
        { time: "13:45", end: "14:35", subject: "CGMA-Theory", faculty: "Mr. Alok Kapil", room: "104" },
    ],
    Tuesday: [
        { time: "09:15", end: "10:10", subject: "Mathematics - III", faculty: "Dr. Abhay Pratap Singh", room: "101" },
        { time: "10:10", end: "11:05", subject: "OS-Theory", faculty: "Mrs. Arpana Jain", room: "102" },
        { time: "11:15", end: "12:10", subject: "CGMA-Lab", faculty: "Mr. Alok Kapil", room: "Lab-1" },
        { time: "12:10", end: "13:05", subject: "OT-Theory", faculty: "Mr. Prashant Tyagi", room: "103" },
        { time: "13:45", end: "14:35", subject: "CGMA-Theory", faculty: "Mr. Alok Kapil", room: "104" },
    ],
    Wednesday: [
        { time: "09:15", end: "10:10", subject: "CET-Theory", faculty: "Dr. Priya Mehta", room: "105" },
        { time: "10:10", end: "11:05", subject: "SE-Theory", faculty: "Prof. Rajan Kumar", room: "106" },
        { time: "11:15", end: "12:10", subject: "Mathematics - III", faculty: "Dr. Abhay Pratap Singh", room: "101" },
        { time: "12:10", end: "13:05", subject: "OS-Theory", faculty: "Mrs. Arpana Jain", room: "102" },
    ],
    Thursday: [
        { time: "09:15", end: "10:10", subject: "CET-Theory", faculty: "Dr. Priya Mehta", room: "105" },
        { time: "10:10", end: "11:05", subject: "SE-Theory", faculty: "Prof. Rajan Kumar", room: "106" },
        { time: "11:15", end: "12:10", subject: "Mathematics - III", faculty: "Dr. Abhay Pratap Singh", room: "101" },
        { time: "12:10", end: "13:05", subject: "OS-Theory", faculty: "Mrs. Arpana Jain", room: "102" },
    ],
    Friday: [
        { time: "09:15", end: "11:05", subject: "CGMA-Lab", faculty: "Mr. Alok Kapil", room: "Lab-1" },
        { time: "11:15", end: "12:10", subject: "OT-Theory", faculty: "Mr. Prashant Tyagi", room: "103" },
        { time: "12:10", end: "13:05", subject: "CGMA-Theory", faculty: "Mr. Alok Kapil", room: "104" },
    ],
    Saturday: [
        { time: "09:15", end: "10:10", subject: "SE-Theory", faculty: "Prof. Rajan Kumar", room: "106" },
        { time: "10:10", end: "11:05", subject: "CET-Theory", faculty: "Dr. Priya Mehta", room: "105" },
    ],
};

export const DEMO_EXAMS = [
    { id: "e1", subject: "Data Structures", date: "2026-03-10", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
    { id: "e2", subject: "Algorithms", date: "2026-03-12", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
    { id: "e3", subject: "DBMS", date: "2026-03-14", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
    { id: "e4", subject: "Computer Networks", date: "2026-03-17", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
    { id: "e5", subject: "Operating Systems", date: "2026-03-19", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
    { id: "e6", subject: "Software Engineering", date: "2026-03-21", time: "10:00", duration: "3 hours", type: "Mid-Semester" },
];

export const DEMO_SEATING = [
    { examId: "e1", subject: "Data Structures", date: "2026-03-10", hall: "Hall A", row: "C", seat: "15", rollNumber: "CS2024001" },
    { examId: "e2", subject: "Algorithms", date: "2026-03-12", hall: "Hall B", row: "A", seat: "08", rollNumber: "CS2024001" },
    { examId: "e3", subject: "DBMS", date: "2026-03-14", hall: "Hall A", row: "D", seat: "22", rollNumber: "CS2024001" },
    { examId: "e4", subject: "Computer Networks", date: "2026-03-17", hall: "Hall C", row: "B", seat: "11", rollNumber: "CS2024001" },
    { examId: "e5", subject: "Operating Systems", date: "2026-03-19", hall: "Hall B", row: "E", seat: "03", rollNumber: "CS2024001" },
    { examId: "e6", subject: "Software Engineering", date: "2026-03-21", hall: "Hall A", row: "A", seat: "31", rollNumber: "CS2024001" },
];

export const DEMO_RESULTS = [
    { subject: "Data Structures", internal: 38, external: 72, total: 110, max: 150, grade: "A" },
    { subject: "Algorithms", internal: 35, external: 68, total: 103, max: 150, grade: "B+" },
    { subject: "DBMS", internal: 28, external: 55, total: 83, max: 150, grade: "B" },
    { subject: "Computer Networks", internal: 40, external: 78, total: 118, max: 150, grade: "A+" },
    { subject: "Operating Systems", internal: 32, external: 62, total: 94, max: 150, grade: "B+" },
    { subject: "Software Engineering", internal: 36, external: 65, total: 101, max: 150, grade: "A-" },
];

export const DEMO_NOTICES = [
    {
        id: "n1",
        title: "Mid-Semester Exam Schedule Released",
        body: "The Mid-Semester examination schedule for 4th semester students has been published. Please check the exam schedule section for details. All students must carry their hall ticket.",
        date: "2026-02-20",
        author: "Examination Department",
        type: "exam",
    },
    {
        id: "n2",
        title: "Data Structures Assignment Due",
        body: "Assignment 3 on Balanced Trees and Graph Algorithms is due on 5th March 2026. Submit through the department office.",
        date: "2026-02-22",
        author: "Dr. Priya Mehta",
        type: "assignment",
    },
    {
        id: "n3",
        title: "College Annual Tech Fest — TechSurge 2026",
        body: "Registration open for TechSurge 2026! Events include Hackathon, Code Sprint, Project Display, and Robotics Challenge. Last date to register: 28th February 2026.",
        date: "2026-02-18",
        author: "Student Council",
        type: "event",
    },
    {
        id: "n4",
        title: "Library Books Return Notice",
        body: "All students are reminded to return borrowed library books before 28th February 2026 to avoid fines. Semester-end clearance is mandatory.",
        date: "2026-02-15",
        author: "Library Department",
        type: "general",
    },
    {
        id: "n5",
        title: "Holiday Notice — Holi",
        body: "The college will remain closed on 14th March 2026 on account of Holi. Classes will resume on 15th March 2026.",
        date: "2026-02-10",
        author: "Principal Office",
        type: "holiday",
    },
];

export const DEMO_STUDENTS = [
    { rollNumber: "CS2024001", name: "Arjun Sharma", status: "present" },
    { rollNumber: "CS2024002", name: "Priya Patel", status: "present" },
    { rollNumber: "CS2024003", name: "Rahul Verma", status: "absent" },
    { rollNumber: "CS2024004", name: "Sneha Iyer", status: "present" },
    { rollNumber: "CS2024005", name: "Karan Malhotra", status: "absent" },
    { rollNumber: "CS2024006", name: "Ananya Singh", status: "present" },
    { rollNumber: "CS2024007", name: "Vikram Nair", status: "present" },
    { rollNumber: "CS2024008", name: "Pooja Reddy", status: "present" },
    { rollNumber: "CS2024009", name: "Aditya Joshi", status: "absent" },
    { rollNumber: "CS2024010", name: "Deepika Rao", status: "present" },
];

export const DEMO_ASSIGNMENTS = [
    { id: "a1", title: "Balanced Trees Implementation", subject: "Data Structures", dueDate: "2026-03-05", status: "pending", faculty: "Dr. Priya Mehta" },
    { id: "a2", title: "Graph Traversal Algorithms", subject: "Algorithms", dueDate: "2026-03-08", status: "submitted", faculty: "Prof. Rajan Kumar" },
    { id: "a3", title: "SQL Normalization Setup", subject: "DBMS", dueDate: "2026-03-10", status: "graded", marks: "9/10", faculty: "Dr. Priya Mehta" },
    { id: "a4", title: "Socket Programming Client/Server", subject: "Computer Networks", dueDate: "2026-03-12", status: "pending", faculty: "Prof. Anita Desai" },
];

export const DEMO_LEAVES = [
    { id: "l1", applicant: "Arjun Sharma", role: "student", startDate: "2026-02-28", endDate: "2026-03-01", reason: "Medical Appointment", status: "approved" },
    { id: "l2", applicant: "Dr. Priya Mehta", role: "faculty", startDate: "2026-03-02", endDate: "2026-03-02", reason: "Personal Work", status: "pending" },
    { id: "l3", applicant: "Sneha Iyer", role: "student", startDate: "2026-03-05", endDate: "2026-03-07", reason: "Family Function", status: "rejected" },
];

export const DEMO_FEES = {
    totalTuition: 150000,
    paid: 75000,
    pending: 75000,
    dueDate: "2026-04-15",
    transactions: [
        { id: "txn_001", date: "2025-08-10", amount: 75000, method: "Bank Transfer", status: "success", semester: "3rd Semester" },
        { id: "txn_002", date: "2026-01-05", amount: 75000, method: "Credit Card", status: "success", semester: "4th Semester" }
    ]
};
