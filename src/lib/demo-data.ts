// ─── DEMO USERS (Login Credentials) ───────────────────────────────────────
// Format: email / password
// Students  : bca1@its.edu.in … bba3@its.edu.in  / student123
// Coordinators: coord.bca1@its.edu.in … coord.bba3@its.edu.in / coord123
// Faculty   : faculty@its.edu.in / faculty123

export const DEMO_USERS = [
  // ── BCA Students ──
  {
    uid:"bca-y1", email:"bca1@its.edu.in", password:"student123", role:"student",
    name:"Aarav Mishra", rollNumber:"250934106101",
    semester:"Ist Year - IInd Semester", branch:"BCA", division:"Section A",
    phone:"+91 9800000101", photo:"", fatherName:"Sh. Ramesh Mishra",
    address:"Mohan Nagar, Ghaziabad, UP 201007", seatType:"Merit", batch:"2025",
  },
  {
    uid:"bca-y2", email:"bca2@its.edu.in", password:"student123", role:"student",
    name:"HARSHIT", rollNumber:"240934106129",
    semester:"IInd Year - IVth Semester", branch:"BCA", division:"Section A",
    phone:"+91 9310830664", photo:"",
    fatherName:"Late Sh. Bansh Bahadur Tiwari",
    address:"A-458 Street No-04 Kabir Nagar Shahdara, Delhi 110094",
    seatType:"Merit", batch:"2024",
  },
  {
    uid:"bca-y3", email:"bca3@its.edu.in", password:"student123", role:"student",
    name:"Rohan Gupta", rollNumber:"230934106101",
    semester:"IIIrd Year - VIth Semester", branch:"BCA", division:"Section A",
    phone:"+91 9765432101", photo:"", fatherName:"Sh. Suresh Gupta",
    address:"Vasundhara, Ghaziabad, UP 201012", seatType:"Merit", batch:"2023",
  },
  // ── BBA Students ──
  {
    uid:"bba-y1", email:"bba1@its.edu.in", password:"student123", role:"student",
    name:"Simran Kaur", rollNumber:"250934200101",
    semester:"Ist Year - IInd Semester", branch:"BBA", division:"Section A",
    phone:"+91 9900000101", photo:"", fatherName:"Sh. Gurpreet Kaur",
    address:"Raj Nagar, Ghaziabad, UP 201001", seatType:"Merit", batch:"2025",
  },
  {
    uid:"bba-y2", email:"bba2@its.edu.in", password:"student123", role:"student",
    name:"RAHUL GUPTA", rollNumber:"240934200101",
    semester:"IInd Year - IVth Semester", branch:"BBA", division:"Section A",
    phone:"+91 9876500001", photo:"", fatherName:"Sh. Rajesh Gupta",
    address:"B-12, Vasundhara, Ghaziabad, UP 201012", seatType:"Merit", batch:"2024",
  },
  {
    uid:"bba-y3", email:"bba3@its.edu.in", password:"student123", role:"student",
    name:"Ankita Rastogi", rollNumber:"230934200101",
    semester:"IIIrd Year - VIth Semester", branch:"BBA", division:"Section A",
    phone:"+91 9876600001", photo:"", fatherName:"Sh. Anil Rastogi",
    address:"Indirapuram, Ghaziabad, UP 201014", seatType:"Merit", batch:"2023",
  },
  // ── Faculty ──
  {
    uid:"faculty-001", email:"faculty@its.edu.in", password:"faculty123", role:"faculty",
    name:"Dr. Priya Mehta", department:"Computer Science",
    subjects:["BCA-402: Operating System","BCA-402: CGMA","BCA-403: Operations Research"],
    classes:["BCA-4A","BCA-4B"], phone:"+91 9112345678", photo:"",
  },
  // ── Coordinators: BCA ──
  {
    uid:"coord-bca1", email:"coord.bca1@its.edu.in", password:"coord123", role:"coordinator",
    name:"Mr. Anil Kapoor (BCA Yr-1)", phone:"+91 9988001001", photo:"",
  },
  {
    uid:"coord-bca2", email:"coord.bca2@its.edu.in", password:"coord123", role:"coordinator",
    name:"Mrs. Sunita Sharma (BCA Yr-2)", phone:"+91 9988001002", photo:"",
  },
  {
    uid:"coord-bca3", email:"coord.bca3@its.edu.in", password:"coord123", role:"coordinator",
    name:"Dr. Rakesh Verma (BCA Yr-3)", phone:"+91 9988001003", photo:"",
  },
  // ── Coordinators: BBA ──
  {
    uid:"coord-bba1", email:"coord.bba1@its.edu.in", password:"coord123", role:"coordinator",
    name:"Ms. Nisha Gupta (BBA Yr-1)", phone:"+91 9988002001", photo:"",
  },
  {
    uid:"coord-bba2", email:"coord.bba2@its.edu.in", password:"coord123", role:"coordinator",
    name:"Prof. Vikas Srivastava (BBA Yr-2)", phone:"+91 9988002002", photo:"",
  },
  {
    uid:"coord-bba3", email:"coord.bba3@its.edu.in", password:"coord123", role:"coordinator",
    name:"Dr. Sunita Agarwal (BBA Yr-3)", phone:"+91 9988002003", photo:"",
  },
];

// ─── ATTENDANCE ────────────────────────────────────────────────────────────
export const DEMO_ATTENDANCE = [
  { subject:"BCA-401: Operating System", total:18, present:16, percent:88.89 },
  { subject:"BCA-402: CGMA", total:16, present:15, percent:93.75 },
  { subject:"BCA-403: Operations Research", total:17, present:17, percent:100 },
  { subject:"BCA-404: Computer Architecture", total:14, present:11, percent:78.57 },
  { subject:"BCA-405: Elements of Statistics", total:15, present:12, percent:80.00 },
  { subject:"BCA-406P: CGMA Lab", total:5, present:5, percent:100 },
];

// ─── TIMETABLE ─────────────────────────────────────────────────────────────
export const DEMO_TIMETABLE: Record<string,Array<{time:string;end:string;subject:string;faculty:string;room:string}>> = {
  Monday:[
    {time:"09:15",end:"10:10",subject:"BCA-401: Operating System",faculty:"Mrs. Arpana Jain",room:"101"},
    {time:"10:10",end:"11:05",subject:"BCA-402: CGMA",faculty:"Mr. Alok Kapil",room:"102"},
    {time:"11:15",end:"12:10",subject:"BCA-403: Operations Research",faculty:"Mr. Prashant Tyagi",room:"103"},
    {time:"13:45",end:"14:35",subject:"BCA-404: Computer Architecture",faculty:"Dr. Priya Mehta",room:"104"},
  ],
  Tuesday:[
    {time:"09:15",end:"10:10",subject:"BCA-405: Elements of Statistics",faculty:"Dr. Abhay Pratap Singh",room:"101"},
    {time:"10:10",end:"11:05",subject:"BCA-401: Operating System",faculty:"Mrs. Arpana Jain",room:"102"},
    {time:"11:15",end:"13:05",subject:"BCA-406P: CGMA Lab",faculty:"Mr. Alok Kapil",room:"Lab-1"},
    {time:"13:45",end:"14:35",subject:"BCA-403: Operations Research",faculty:"Mr. Prashant Tyagi",room:"103"},
  ],
  Wednesday:[
    {time:"09:15",end:"10:10",subject:"BCA-402: CGMA",faculty:"Mr. Alok Kapil",room:"102"},
    {time:"10:10",end:"11:05",subject:"BCA-404: Computer Architecture",faculty:"Dr. Priya Mehta",room:"104"},
    {time:"11:15",end:"12:10",subject:"BCA-405: Elements of Statistics",faculty:"Dr. Abhay Pratap Singh",room:"101"},
    {time:"12:10",end:"13:05",subject:"BCA-401: Operating System",faculty:"Mrs. Arpana Jain",room:"101"},
  ],
  Thursday:[
    {time:"09:15",end:"10:10",subject:"BCA-403: Operations Research",faculty:"Mr. Prashant Tyagi",room:"103"},
    {time:"10:10",end:"11:05",subject:"BCA-402: CGMA",faculty:"Mr. Alok Kapil",room:"102"},
    {time:"11:15",end:"12:10",subject:"BCA-404: Computer Architecture",faculty:"Dr. Priya Mehta",room:"104"},
    {time:"12:10",end:"13:05",subject:"BCA-405: Elements of Statistics",faculty:"Dr. Abhay Pratap Singh",room:"101"},
  ],
  Friday:[
    {time:"09:15",end:"11:05",subject:"BCA-406P: CGMA Lab",faculty:"Mr. Alok Kapil",room:"Lab-1"},
    {time:"11:15",end:"12:10",subject:"BCA-401: Operating System",faculty:"Mrs. Arpana Jain",room:"101"},
    {time:"12:10",end:"13:05",subject:"BCA-403: Operations Research",faculty:"Mr. Prashant Tyagi",room:"103"},
  ],
  Saturday:[
    {time:"09:15",end:"10:10",subject:"BCA-402: CGMA",faculty:"Mr. Alok Kapil",room:"102"},
    {time:"10:10",end:"11:05",subject:"BCA-404: Computer Architecture",faculty:"Dr. Priya Mehta",room:"104"},
  ],
};

// ─── EXAMS ────────────────────────────────────────────────────────────────
export const DEMO_EXAMS = [
  {id:"e1",subject:"BCA-401: Operating System",date:"2026-05-10",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"e2",subject:"BCA-402: CGMA",date:"2026-05-13",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"e3",subject:"BCA-403: Operations Research",date:"2026-05-16",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"e4",subject:"BCA-404: Computer Architecture",date:"2026-05-19",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"e5",subject:"BCA-405: Elements of Statistics",date:"2026-05-22",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"e6",subject:"BCA-406P: CGMA Lab (Practical)",date:"2026-05-24",time:"10:00",duration:"3 hours",type:"Practical"},
];

// ─── SEATING ──────────────────────────────────────────────────────────────
export const DEMO_SEATING = [
  {examId:"e1",subject:"BCA-401: Operating System",date:"2026-05-10",hall:"Hall A",row:"C",seat:"15",rollNumber:"240934106129"},
  {examId:"e2",subject:"BCA-402: CGMA",date:"2026-05-13",hall:"Hall B",row:"A",seat:"08",rollNumber:"240934106129"},
  {examId:"e3",subject:"BCA-403: Operations Research",date:"2026-05-16",hall:"Hall A",row:"D",seat:"22",rollNumber:"240934106129"},
  {examId:"e4",subject:"BCA-404: Computer Architecture",date:"2026-05-19",hall:"Hall C",row:"B",seat:"11",rollNumber:"240934106129"},
  {examId:"e5",subject:"BCA-405: Elements of Statistics",date:"2026-05-22",hall:"Hall B",row:"E",seat:"03",rollNumber:"240934106129"},
  {examId:"e6",subject:"BCA-406P: CGMA Lab",date:"2026-05-24",hall:"Hall A",row:"A",seat:"31",rollNumber:"240934106129"},
];

// ─── RESULTS ─────────────────────────────────────────────────────────────
export const DEMO_RESULTS = [
  {subject:"BCA-401: Operating System",internal:29,external:46,total:75,max:100,grade:"A"},
  {subject:"BCA-402: CGMA",internal:23,external:28,total:51,max:100,grade:"B"},
  {subject:"BCA-403: Operations Research",internal:28,external:22,total:50,max:100,grade:"B"},
  {subject:"BCA-404: Computer Architecture",internal:20,external:0,total:20,max:100,grade:"C"},
  {subject:"BCA-405: Elements of Statistics",internal:17,external:0,total:17,max:50,grade:"B+"},
  {subject:"BCA-406P: CGMA Lab",internal:29,external:0,total:29,max:50,grade:"A+"},
  {subject:"BCA-301: Mathematics - III",internal:24,external:38,total:62,max:100,grade:"B"},
  {subject:"BCA-302: Data Structures",internal:26,external:40,total:66,max:100,grade:"B+"},
  {subject:"BCA-303: DBMS",internal:30,external:0,total:30,max:50,grade:"A"},
];

// ─── NOTICES ─────────────────────────────────────────────────────────────
export const DEMO_NOTICES = [
  {id:"n1",title:"Hackathon (Thinkathon) Postponed to 18th March",body:"Due to CCSU Practical Examinations of BCA II Semester students, the Hackathon originally scheduled for 11th March has been postponed to 18th March 2026.",date:"2026-03-08",author:"Principal Office",type:"event"},
  {id:"n2",title:"End-Semester Examination Schedule — May 2026",body:"The End-Semester examination schedule for IVth Semester BCA & IVth Semester BBA students has been released. Exams commence from 10th May 2026.",date:"2026-04-05",author:"Examination Department",type:"exam"},
  {id:"n3",title:"BCA-406P CGMA Project Submission Deadline Extended",body:"The submission deadline for BCA-406P (CGMA Lab) project has been extended to 20th April 2026.",date:"2026-04-02",author:"Mr. Alok Kapil",type:"assignment"},
  {id:"n4",title:"TechSurge 2026 — Annual Technical Festival",body:"Registration open for TechSurge 2026! Events include Hackathon, Code Sprint, Project Display, Robotics Challenge. Register before 25th April 2026.",date:"2026-03-28",author:"Student Council",type:"event"},
  {id:"n5",title:"Library Clearance Before End-Semester",body:"All students must return borrowed library books before 30th April 2026. Fine: ₹5/day for overdue books.",date:"2026-04-01",author:"Library Department",type:"general"},
];

// ─── DEMO STUDENTS (for attendance marking etc.) ─────────────────────────
export const DEMO_STUDENTS = [
  {rollNumber:"240934106129",name:"HARSHIT",status:"present"},
  {rollNumber:"240934106130",name:"Divyanshi Sharma",status:"present"},
  {rollNumber:"240934106131",name:"Arjun Mehta",status:"absent"},
  {rollNumber:"240934106132",name:"Priya Agarwal",status:"present"},
  {rollNumber:"240934106133",name:"Karan Verma",status:"present"},
  {rollNumber:"240934106134",name:"Sneha Singh",status:"absent"},
];

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────
export const DEMO_ASSIGNMENTS = [
  {id:"a1",title:"CGMA: Bresenham Line Drawing Implementation",subject:"BCA-406P: CGMA Lab",dueDate:"2026-04-20",status:"pending",faculty:"Mr. Alok Kapil"},
  {id:"a2",title:"OT: Linear Programming Problem Set",subject:"BCA-403: Operations Research",dueDate:"2026-04-18",status:"submitted",faculty:"Mr. Prashant Tyagi"},
  {id:"a3",title:"OS: Process Scheduling Algorithms",subject:"BCA-401: Operating System",dueDate:"2026-04-15",status:"graded",marks:"9/10",faculty:"Mrs. Arpana Jain"},
  {id:"a4",title:"Architecture: Memory Hierarchy Report",subject:"BCA-404: Computer Architecture",dueDate:"2026-04-25",status:"pending",faculty:"Dr. Priya Mehta"},
];

// ─── FEES ─────────────────────────────────────────────────────────────────
export const DEMO_FEES = {
  totalTuition:150000, paid:75000, pending:75000, dueDate:"2026-04-30",
  transactions:[
    {id:"txn_001",date:"2025-08-10",amount:75000,method:"Bank Transfer",status:"success",semester:"IIIrd Semester"},
    {id:"txn_002",date:"2026-01-05",amount:75000,method:"Credit Card",status:"success",semester:"IVth Semester"},
  ],
};

// ─── LIBRARY ──────────────────────────────────────────────────────────────
export const DEMO_LIBRARY = {
  books:[
    {id:"b1",title:"Computer Graphics: Principles and Practice",author:"Foley, Van Dam",isbn:"978-0-201-84840-3",quantity:5,available:3},
    {id:"b2",title:"Introduction to Algorithms (CLRS)",author:"Cormen, Leiserson",isbn:"978-0-262-03384-8",quantity:8,available:2},
    {id:"b3",title:"Operating System Concepts",author:"Silberschatz",isbn:"978-1-118-06333-0",quantity:6,available:4},
    {id:"b4",title:"Software Engineering (9th Ed.)",author:"Ian Sommerville",isbn:"978-0-13-703515-1",quantity:4,available:1},
    {id:"b5",title:"Operations Research: Theory & Applications",author:"J.K. Sharma",isbn:"978-93-5142-594-9",quantity:7,available:5},
    {id:"b6",title:"C Programming Language (2nd Ed.)",author:"Kernighan & Ritchie",isbn:"978-0-13-110362-7",quantity:10,available:6},
    {id:"b7",title:"Database System Concepts (7th Ed.)",author:"Silberschatz, Korth",isbn:"978-0-07-802215-9",quantity:5,available:3},
    {id:"b8",title:"Principles of Management",author:"Koontz & Weihrich",isbn:"978-0-07-014589-4",quantity:6,available:4},
    {id:"b9",title:"Marketing Management",author:"Philip Kotler",isbn:"978-93-325-4642-6",quantity:8,available:5},
    {id:"b10",title:"Financial Accounting",author:"S.N. Maheshwari",isbn:"978-81-7446-543-1",quantity:7,available:3},
  ],
  transactions:[
    {id:"lt1",book:{title:"Software Engineering (9th Ed.)",author:"Ian Sommerville"},issueDate:"2026-03-15",dueDate:"2026-04-15",status:"Borrowed"},
    {id:"lt2",book:{title:"Introduction to Algorithms (CLRS)",author:"Cormen et al."},issueDate:"2026-02-20",dueDate:"2026-03-20",status:"Overdue"},
  ],
};

// ─── ALL STUDENTS (coordinator view) ─────────────────────────────────────
export const DEMO_ALL_STUDENTS = [
  // BCA Ist Year
  {id:"u1",name:"Aarav Mishra",rollNumber:"250934106101",branch:"BCA",semester:"Ist Year - Ist Semester",email:"bca1@its.edu.in",phone:"+91 9800000101",status:"Active",role:"student"},
  {id:"u2",name:"Ishika Jain",rollNumber:"250934106102",branch:"BCA",semester:"Ist Year - Ist Semester",email:"ishika@its.edu.in",phone:"+91 9800000102",status:"Active",role:"student"},
  {id:"u3",name:"Nikhil Yadav",rollNumber:"250934106103",branch:"BCA",semester:"Ist Year - IInd Semester",email:"nikhil@its.edu.in",phone:"+91 9800000103",status:"Active",role:"student"},
  // BCA IInd Year
  {id:"u4",name:"HARSHIT",rollNumber:"240934106129",branch:"BCA",semester:"IInd Year - IVth Semester",email:"bca2@its.edu.in",phone:"+91 9310830664",status:"Active",role:"student"},
  {id:"u5",name:"Divyanshi Sharma",rollNumber:"240934106130",branch:"BCA",semester:"IInd Year - IVth Semester",email:"divyanshi@its.edu.in",phone:"+91 9811234567",status:"Active",role:"student"},
  {id:"u6",name:"Arjun Mehta",rollNumber:"240934106131",branch:"BCA",semester:"IInd Year - IIIrd Semester",email:"arjun@its.edu.in",phone:"+91 9987654321",status:"Active",role:"student"},
  // BCA IIIrd Year
  {id:"u7",name:"Rohan Gupta",rollNumber:"230934106101",branch:"BCA",semester:"IIIrd Year - VIth Semester",email:"bca3@its.edu.in",phone:"+91 9765432101",status:"Active",role:"student"},
  {id:"u8",name:"Sneha Singh",rollNumber:"230934106102",branch:"BCA",semester:"IIIrd Year - Vth Semester",email:"sneha@its.edu.in",phone:"+91 9654321098",status:"Active",role:"student"},
  // BBA Ist Year
  {id:"b1",name:"Simran Kaur",rollNumber:"250934200101",branch:"BBA",semester:"Ist Year - Ist Semester",email:"bba1@its.edu.in",phone:"+91 9900000101",status:"Active",role:"student"},
  {id:"b2",name:"Mohit Aggarwal",rollNumber:"250934200102",branch:"BBA",semester:"Ist Year - IInd Semester",email:"mohit@its.edu.in",phone:"+91 9900000102",status:"Active",role:"student"},
  {id:"b3",name:"Riya Bajaj",rollNumber:"250934200103",branch:"BBA",semester:"Ist Year - IInd Semester",email:"riya@its.edu.in",phone:"+91 9900000103",status:"Active",role:"student"},
  // BBA IInd Year
  {id:"b4",name:"RAHUL GUPTA",rollNumber:"240934200101",branch:"BBA",semester:"IInd Year - IVth Semester",email:"bba2@its.edu.in",phone:"+91 9876500001",status:"Active",role:"student"},
  {id:"b5",name:"Neha Saxena",rollNumber:"240934200102",branch:"BBA",semester:"IInd Year - IIIrd Semester",email:"neha@its.edu.in",phone:"+91 9876500002",status:"Active",role:"student"},
  // BBA IIIrd Year
  {id:"b6",name:"Ankita Rastogi",rollNumber:"230934200101",branch:"BBA",semester:"IIIrd Year - VIth Semester",email:"bba3@its.edu.in",phone:"+91 9876600001",status:"Active",role:"student"},
  {id:"b7",name:"Deepak Chaudhary",rollNumber:"230934200102",branch:"BBA",semester:"IIIrd Year - Vth Semester",email:"deepak@its.edu.in",phone:"+91 9876600002",status:"Active",role:"student"},
];

// ─── FACULTY USERS ────────────────────────────────────────────────────────
export const DEMO_FACULTY_USERS = [
  {id:"f1",name:"Dr. Priya Mehta",department:"Computer Science",email:"faculty@its.edu.in",phone:"+91 9112345678",status:"Active",role:"faculty",subjects:["BCA-402: CGMA","BCA-404: Computer Architecture"]},
  {id:"f2",name:"Mrs. Arpana Jain",department:"Computer Science",email:"arpana@its.edu.in",phone:"+91 9223456789",status:"Active",role:"faculty",subjects:["BCA-401: Operating System"]},
  {id:"f3",name:"Dr. Abhay Pratap Singh",department:"Mathematics",email:"abhay@its.edu.in",phone:"+91 9334567890",status:"Active",role:"faculty",subjects:["BCA-101: Mathematics - I","BCA-201: Mathematics - II","BCA-301: Mathematics - III"]},
  {id:"f4",name:"Mr. Alok Kapil",department:"Computer Science",email:"alok@its.edu.in",phone:"+91 9556789012",status:"Active",role:"faculty",subjects:["BCA-406P: CGMA Lab","BCA-402: CGMA"]},
  {id:"f5",name:"Mr. Prashant Tyagi",department:"Computer Science",email:"prashant@its.edu.in",phone:"+91 9667890123",status:"Active",role:"faculty",subjects:["BCA-403: Operations Research"]},
  {id:"f6",name:"Dr. Sunita Agarwal",department:"Management",email:"sunita@its.edu.in",phone:"+91 9889012345",status:"Active",role:"faculty",subjects:["BBA-101: Principles of Management","BBA-501: Strategic Management"]},
  {id:"f7",name:"Prof. Vikas Srivastava",department:"Management",email:"vikas@its.edu.in",phone:"+91 9990123456",status:"Active",role:"faculty",subjects:["BBA-202: Marketing Management","BBA-604: DSE-III Brand Management"]},
  {id:"f8",name:"Mrs. Kavita Sharma",department:"Commerce",email:"kavita@its.edu.in",phone:"+91 9901234567",status:"Active",role:"faculty",subjects:["BBA-103: Financial Accounting","BBA-602: Business Taxation"]},
];

// ─── LEAVES ───────────────────────────────────────────────────────────────
export const DEMO_LEAVES = [
  {id:"L1",userId:"f1",applicant:"Dr. Priya Mehta",role:"faculty",startDate:"2026-04-12",endDate:"2026-04-15",reason:"Attending AI Conference in Bangalore",status:"pending"},
  {id:"L2",userId:"b2",applicant:"Mohit Aggarwal",role:"student",startDate:"2026-04-14",endDate:"2026-04-14",reason:"Medical leave",status:"pending"},
  {id:"L3",userId:"u4",applicant:"HARSHIT",role:"student",startDate:"2026-04-20",endDate:"2026-04-22",reason:"Sister's Wedding",status:"approved"},
];

// ══════════════════════════════════════════════════════════════
// BBA-SPECIFIC DEMO DATA
// ══════════════════════════════════════════════════════════════

export const BBA_ATTENDANCE = [
  { subject:"BBA-401: Entrepreneurship & Startup Ecosystem", total:18, present:17, percent:94.44 },
  { subject:"BBA-402: Operations Management",                total:16, present:14, percent:87.50 },
  { subject:"BBA-403: Taxation (Direct & Indirect Tax)",     total:17, present:13, percent:76.47 },
  { subject:"BBA-404: Banking & Insurance",                  total:15, present:12, percent:80.00 },
  { subject:"BBA-405: E-Commerce & Digital Marketing",       total:14, present:14, percent:100   },
  { subject:"BBA-406: Business Ethics & Corporate Governance",total:16,present:11, percent:68.75 },
];

export const BBA_TIMETABLE: Record<string,Array<{time:string;end:string;subject:string;faculty:string;room:string}>> = {
  Monday:[
    {time:"09:15",end:"10:10",subject:"BBA-401: Entrepreneurship & Startup Ecosystem",faculty:"Dr. Ramesh Pandey",room:"201"},
    {time:"10:10",end:"11:05",subject:"BBA-402: Operations Management",               faculty:"Dr. Sunita Agarwal",room:"202"},
    {time:"11:15",end:"12:10",subject:"BBA-403: Taxation",                             faculty:"Mrs. Kavita Sharma",room:"203"},
    {time:"13:45",end:"14:35",subject:"BBA-404: Banking & Insurance",                  faculty:"Dr. Ramesh Pandey",room:"201"},
  ],
  Tuesday:[
    {time:"09:15",end:"10:10",subject:"BBA-405: E-Commerce & Digital Marketing",       faculty:"Prof. Vikas Srivastava",room:"202"},
    {time:"10:10",end:"11:05",subject:"BBA-406: Business Ethics",                      faculty:"Dr. Sunita Agarwal",room:"203"},
    {time:"11:15",end:"12:10",subject:"BBA-401: Entrepreneurship & Startup Ecosystem", faculty:"Dr. Ramesh Pandey",room:"201"},
    {time:"13:45",end:"14:35",subject:"BBA-402: Operations Management",                faculty:"Dr. Sunita Agarwal",room:"202"},
  ],
  Wednesday:[
    {time:"09:15",end:"10:10",subject:"BBA-403: Taxation",                             faculty:"Mrs. Kavita Sharma",room:"203"},
    {time:"10:10",end:"11:05",subject:"BBA-404: Banking & Insurance",                  faculty:"Dr. Ramesh Pandey",room:"201"},
    {time:"11:15",end:"12:10",subject:"BBA-405: E-Commerce & Digital Marketing",       faculty:"Prof. Vikas Srivastava",room:"202"},
    {time:"12:10",end:"13:05",subject:"BBA-406: Business Ethics",                      faculty:"Dr. Sunita Agarwal",room:"203"},
  ],
  Thursday:[
    {time:"09:15",end:"10:10",subject:"BBA-401: Entrepreneurship & Startup Ecosystem", faculty:"Dr. Ramesh Pandey",room:"201"},
    {time:"10:10",end:"11:05",subject:"BBA-403: Taxation",                             faculty:"Mrs. Kavita Sharma",room:"203"},
    {time:"11:15",end:"12:10",subject:"BBA-402: Operations Management",                faculty:"Dr. Sunita Agarwal",room:"202"},
    {time:"12:10",end:"13:05",subject:"BBA-404: Banking & Insurance",                  faculty:"Dr. Ramesh Pandey",room:"201"},
  ],
  Friday:[
    {time:"09:15",end:"10:10",subject:"BBA-405: E-Commerce & Digital Marketing",       faculty:"Prof. Vikas Srivastava",room:"202"},
    {time:"10:10",end:"11:05",subject:"BBA-401: Entrepreneurship & Startup Ecosystem", faculty:"Dr. Ramesh Pandey",room:"201"},
    {time:"11:15",end:"12:10",subject:"BBA-406: Business Ethics",                      faculty:"Dr. Sunita Agarwal",room:"203"},
  ],
  Saturday:[
    {time:"09:15",end:"10:10",subject:"BBA-402: Operations Management",                faculty:"Dr. Sunita Agarwal",room:"202"},
    {time:"10:10",end:"11:05",subject:"BBA-403: Taxation",                             faculty:"Mrs. Kavita Sharma",room:"203"},
  ],
};

export const BBA_EXAMS = [
  {id:"be1",subject:"BBA-401: Entrepreneurship & Startup Ecosystem",date:"2026-05-11",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"be2",subject:"BBA-402: Operations Management",               date:"2026-05-14",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"be3",subject:"BBA-403: Taxation (Direct & Indirect Tax)",    date:"2026-05-17",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"be4",subject:"BBA-404: Banking & Insurance",                 date:"2026-05-20",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"be5",subject:"BBA-405: E-Commerce & Digital Marketing",      date:"2026-05-23",time:"10:00",duration:"3 hours",type:"End-Semester"},
  {id:"be6",subject:"BBA-406: Business Ethics & Corporate Governance",date:"2026-05-26",time:"10:00",duration:"3 hours",type:"End-Semester"},
];

export const BBA_SEATING = [
  {examId:"be1",subject:"BBA-401: Entrepreneurship & Startup Ecosystem",date:"2026-05-11",hall:"Hall B",row:"A",seat:"05",rollNumber:"240934200101"},
  {examId:"be2",subject:"BBA-402: Operations Management",              date:"2026-05-14",hall:"Hall B",row:"B",seat:"12",rollNumber:"240934200101"},
  {examId:"be3",subject:"BBA-403: Taxation",                           date:"2026-05-17",hall:"Hall C",row:"A",seat:"09",rollNumber:"240934200101"},
  {examId:"be4",subject:"BBA-404: Banking & Insurance",                date:"2026-05-20",hall:"Hall B",row:"C",seat:"03",rollNumber:"240934200101"},
  {examId:"be5",subject:"BBA-405: E-Commerce & Digital Marketing",     date:"2026-05-23",hall:"Hall A",row:"D",seat:"18",rollNumber:"240934200101"},
  {examId:"be6",subject:"BBA-406: Business Ethics",                    date:"2026-05-26",hall:"Hall C",row:"B",seat:"07",rollNumber:"240934200101"},
];

export const BBA_RESULTS = [
  {subject:"BBA-401: Entrepreneurship & Startup Ecosystem",internal:27,external:41,total:68,max:100,grade:"B+"},
  {subject:"BBA-402: Operations Management",               internal:24,external:38,total:62,max:100,grade:"B"},
  {subject:"BBA-403: Taxation (Direct & Indirect Tax)",    internal:22,external:35,total:57,max:100,grade:"B"},
  {subject:"BBA-404: Banking & Insurance",                 internal:26,external:0, total:26,max:100,grade:"C"},
  {subject:"BBA-405: E-Commerce & Digital Marketing",      internal:28,external:0, total:28,max:50, grade:"A"},
  {subject:"BBA-406: Business Ethics",                     internal:20,external:0, total:20,max:50, grade:"B+"},
  {subject:"BBA-301: Management Accounting",               internal:25,external:40,total:65,max:100,grade:"B+"},
  {subject:"BBA-302: Legal & Ethical Issues",              internal:23,external:36,total:59,max:100,grade:"B"},
  {subject:"BBA-303: Human Resource Management",           internal:29,external:0, total:29,max:50, grade:"A+"},
];

export const BBA_ASSIGNMENTS = [
  {id:"ba1",title:"Marketing Mix Analysis: Real Brand Case Study",       subject:"BBA-405: E-Commerce & Digital Marketing",dueDate:"2026-04-22",status:"pending",  faculty:"Prof. Vikas Srivastava"},
  {id:"ba2",title:"GST Return Filing Simulation",                        subject:"BBA-403: Taxation",                      dueDate:"2026-04-18",status:"submitted",faculty:"Mrs. Kavita Sharma"},
  {id:"ba3",title:"Business Plan: Startup Pitch Deck",                   subject:"BBA-401: Entrepreneurship",              dueDate:"2026-04-15",status:"graded",   marks:"18/20",faculty:"Dr. Ramesh Pandey"},
  {id:"ba4",title:"Operations Flowchart & Process Mapping",              subject:"BBA-402: Operations Management",         dueDate:"2026-04-28",status:"pending",  faculty:"Dr. Sunita Agarwal"},
];

export const BBA_NOTICES = [
  {id:"bn1",title:"BBA IVth Sem End-Semester Examination Schedule",     body:"End-Semester exams for BBA IVth Semester commence from 11th May 2026. Hall tickets available at the examination office.",date:"2026-04-05",author:"Examination Department",type:"exam"},
  {id:"bn2",title:"Summer Internship Verification — BBA IInd Year",     body:"All BBA 2nd year students must submit their Summer Training Project Report (STPR) by 30th April 2026. Submit to Dr. Sunita Agarwal.",date:"2026-04-02",author:"Dr. Sunita Agarwal",type:"assignment"},
  {id:"bn3",title:"Guest Lecture: Entrepreneurship & Startup Funding",  body:"A guest lecture by Mr. Ankit Sinha (Founder, EduTech Startup) on 25th April 2026 in Seminar Hall. Attendance compulsory for BBA students.",date:"2026-04-10",author:"Management Department",type:"event"},
  {id:"bn4",title:"BizQuiz 2026 — Annual Business Quiz Competition",    body:"Register for BizQuiz 2026! Open to all BBA students. Prize pool ₹25,000. Last date to register: 20th April 2026.",date:"2026-03-28",author:"Student Council",type:"event"},
  {id:"bn5",title:"Library Clearance Before End-Semester",              body:"All students must return borrowed library books before 30th April 2026. Fine: ₹5/day for overdue books.",date:"2026-04-01",author:"Library Department",type:"general"},
];

export const BBA_LIBRARY = {
  books:[
    {id:"lb1",title:"Principles of Management",                    author:"Koontz & Weihrich",         isbn:"978-0-07-014589-4",quantity:6,available:4},
    {id:"lb2",title:"Marketing Management (15th Ed.)",             author:"Philip Kotler",              isbn:"978-93-325-4642-6",quantity:8,available:5},
    {id:"lb3",title:"Financial Accounting",                        author:"S.N. Maheshwari",            isbn:"978-81-7446-543-1",quantity:7,available:3},
    {id:"lb4",title:"Human Resource Management",                   author:"Gary Dessler",               isbn:"978-93-325-1847-8",quantity:5,available:2},
    {id:"lb5",title:"Business Law",                                author:"N.D. Kapoor",                isbn:"978-81-219-0206-4",quantity:6,available:5},
    {id:"lb6",title:"Operations Management",                       author:"Mahadevan",                  isbn:"978-81-317-1508-5",quantity:4,available:3},
    {id:"lb7",title:"Entrepreneurship Development",                author:"S.S. Khanka",                isbn:"978-81-219-2424-0",quantity:5,available:4},
    {id:"lb8",title:"Direct Tax Laws & Practice",                  author:"Vinod K. Singhania",         isbn:"978-93-5107-902-3",quantity:4,available:2},
    {id:"lb9",title:"Banking Theory Law & Practice",               author:"Gordon & Natarajan",         isbn:"978-81-224-2631-5",quantity:6,available:4},
    {id:"lb10",title:"E-Commerce: Business, Technology, Society",  author:"Laudon & Traver",            isbn:"978-93-325-6099-6",quantity:5,available:3},
  ],
  transactions:[
    {id:"blt1",book:{title:"Entrepreneurship Development",author:"S.S. Khanka"},   issueDate:"2026-03-18",dueDate:"2026-04-18",status:"Borrowed"},
    {id:"blt2",book:{title:"Marketing Management",author:"Philip Kotler"},          issueDate:"2026-02-25",dueDate:"2026-03-25",status:"Overdue"},
  ],
};

// ══════════════════════════════════════════════════════════════
// HELPER — returns branch-specific data in one call
// Usage: const d = getDemoData(userProfile?.branch)
// ══════════════════════════════════════════════════════════════
export function getDemoData(branch?: string) {
  const isBBA = branch === "BBA";
  return {
    attendance:  isBBA ? BBA_ATTENDANCE  : DEMO_ATTENDANCE,
    timetable:   isBBA ? BBA_TIMETABLE   : DEMO_TIMETABLE,
    exams:       isBBA ? BBA_EXAMS       : DEMO_EXAMS,
    seating:     isBBA ? BBA_SEATING     : DEMO_SEATING,
    results:     isBBA ? BBA_RESULTS     : DEMO_RESULTS,
    assignments: isBBA ? BBA_ASSIGNMENTS : DEMO_ASSIGNMENTS,
    notices:     isBBA ? BBA_NOTICES     : DEMO_NOTICES,
    library:     isBBA ? BBA_LIBRARY     : DEMO_LIBRARY,
  };
}
