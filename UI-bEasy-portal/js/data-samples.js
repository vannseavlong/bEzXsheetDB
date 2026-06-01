/* ============================================================
   bEasy Portal — sample data
   window.DATA  : records for the special flows (order, payout…)
   window.DATASETS : column + row config for generic list pages
   ============================================================ */
(function () {
  "use strict";

  // ---------- shared helpers for cell shapes ----------
  const b = (label, variant) => ({ _t: "badge", label, variant });
  const two = (top, sub) => ({ _t: "two", top, sub });
  const money = (v) => ({ _t: "money", v });
  const tag = (v) => ({ _t: "tag", v });

  // ============================================================
  //  SPECIAL-FLOW DATA
  // ============================================================
  const cleaners = [
    { id: "CL-204", name: "Maria Santos",  zone: "Central · Dubai",   rating: 4.9, jobs: 312, status: "available", load: 2 },
    { id: "CL-118", name: "Aisha Rahman",  zone: "Marina · Dubai",    rating: 4.8, jobs: 287, status: "available", load: 1 },
    { id: "CL-076", name: "Grace Okoro",   zone: "Deira · Dubai",     rating: 4.7, jobs: 198, status: "on-job",    load: 4 },
    { id: "CL-241", name: "Lena Petrova",  zone: "JLT · Dubai",       rating: 4.9, jobs: 156, status: "available", load: 0 },
    { id: "CL-159", name: "Fatima Noor",   zone: "Business Bay",      rating: 4.6, jobs: 142, status: "off",       load: 0 },
    { id: "CL-088", name: "Rosa Delgado",  zone: "Central · Dubai",   rating: 4.8, jobs: 401, status: "on-job",    load: 3 },
  ];

  const orders = [
    { code: "ORD-90412", customer: "Hana Yusuf",   phone: "+971 50 221 9087", service: "Deep clean — 2BR apartment", schedule: "30 May, 14:00", area: "Marina", amount: "AED 320", status: "unassigned", cleaner: null, partner: "SparkleCo", payment: "Paid" },
    { code: "ORD-90411", customer: "Omar Khalid",  phone: "+971 55 880 1123", service: "Sofa & carpet shampoo",       schedule: "30 May, 11:00", area: "JLT",    amount: "AED 180", status: "assigned",   cleaner: "Maria Santos", partner: "SparkleCo", payment: "Paid" },
    { code: "ORD-90410", customer: "Lucy Bennett", phone: "+971 52 339 4410", service: "Standard clean — villa",       schedule: "30 May, 09:00", area: "Deira",  amount: "AED 450", status: "in-progress",cleaner: "Grace Okoro",  partner: "HomeShine", payment: "Paid" },
    { code: "ORD-90408", customer: "Tariq Aziz",   phone: "+971 50 117 6654", service: "Move-out deep clean",          schedule: "29 May, 16:30", area: "Business Bay", amount: "AED 600", status: "completed", cleaner: "Rosa Delgado", partner: "HomeShine", payment: "Paid" },
    { code: "ORD-90405", customer: "Mei Lin",      phone: "+971 56 442 0098", service: "Kitchen deep clean",           schedule: "29 May, 13:00", area: "Central", amount: "AED 240", status: "completed",  cleaner: "Aisha Rahman", partner: "SparkleCo", payment: "Paid" },
    { code: "ORD-90402", customer: "David Park",   phone: "+971 54 209 7781", service: "Window cleaning — 3BR",        schedule: "28 May, 10:00", area: "Marina", amount: "AED 200", status: "cancelled",  cleaner: null, partner: "—", payment: "Refunded" },
  ];

  const onboarding = [
    { id: "PA-3391", company: "BrightNest Services",  contact: "Yusuf Adeyemi", email: "yusuf@brightnest.ae", phone: "+971 50 991 2210", area: "Dubai · Marina",  fleet: 14, docs: "Complete",   submitted: "28 May 2026", status: "pending" },
    { id: "PA-3388", company: "PureHome Cleaning",    contact: "Sara Idris",    email: "sara@purehome.ae",   phone: "+971 55 220 8841", area: "Dubai · Deira",   fleet: 8,  docs: "Complete",   submitted: "27 May 2026", status: "pending" },
    { id: "PA-3385", company: "Crystal Clean LLC",    contact: "Imran Shah",    email: "imran@crystal.ae",   phone: "+971 52 771 0093", area: "Abu Dhabi",       fleet: 22, docs: "Missing trade licence", submitted: "26 May 2026", status: "in-review" },
    { id: "PA-3380", company: "FreshFold Co.",        contact: "Nadia Hassan",  email: "nadia@freshfold.ae", phone: "+971 56 118 4420", area: "Sharjah",         fleet: 5,  docs: "Complete",   submitted: "25 May 2026", status: "pending" },
    { id: "PA-3377", company: "GleamWorks",           contact: "Peter Mwangi",  email: "peter@gleam.ae",     phone: "+971 50 663 9912", area: "Dubai · JLT",     fleet: 11, docs: "Complete",   submitted: "24 May 2026", status: "approved" },
    { id: "PA-3372", company: "TidyTeam Express",     contact: "Lara Voss",     email: "lara@tidyteam.ae",   phone: "+971 54 339 2218", area: "Dubai · Central", fleet: 3,  docs: "Incomplete", submitted: "23 May 2026", status: "rejected" },
  ];

  const payouts = [
    { id: "PO-5521", partner: "SparkleCo",   period: "16–31 May 2026", jobs: 142, gross: "AED 38,400", fee: "AED 5,760", net: "AED 32,640", method: "Bank · ENBD", status: "pending" },
    { id: "PO-5520", partner: "HomeShine",   period: "16–31 May 2026", jobs: 98,  gross: "AED 27,200", fee: "AED 4,080", net: "AED 23,120", method: "Bank · FAB",  status: "pending" },
    { id: "PO-5519", partner: "GleamWorks",  period: "16–31 May 2026", jobs: 61,  gross: "AED 16,950", fee: "AED 2,542", net: "AED 14,408", method: "Wallet",       status: "approved" },
    { id: "PO-5518", partner: "PureHome",    period: "16–31 May 2026", jobs: 44,  gross: "AED 11,200", fee: "AED 1,680", net: "AED 9,520",  method: "Bank · ENBD", status: "approved" },
    { id: "PO-5510", partner: "BrightNest",  period: "1–15 May 2026",  jobs: 120, gross: "AED 33,600", fee: "AED 5,040", net: "AED 28,560", method: "Bank · FAB",  status: "paid" },
    { id: "PO-5509", partner: "TidyTeam",    period: "1–15 May 2026",  jobs: 38,  gross: "AED 9,500",  fee: "AED 1,425", net: "AED 8,075",  method: "Wallet",       status: "paid" },
  ];

  const paylinks = [
    { id: "PL-7741", title: "Premium plan — Q3",   customer: "Hana Yusuf",  amount: "AED 899", created: "30 May 2026", expires: "06 Jun 2026", url: "pay.beasy.ae/l/7741", status: "pending" },
    { id: "PL-7738", title: "Sofa deep-clean addon", customer: "Omar Khalid", amount: "AED 180", created: "29 May 2026", expires: "05 Jun 2026", url: "pay.beasy.ae/l/7738", status: "paid" },
    { id: "PL-7735", title: "Move-out package",     customer: "Tariq Aziz",  amount: "AED 600", created: "28 May 2026", expires: "04 Jun 2026", url: "pay.beasy.ae/l/7735", status: "pending" },
    { id: "PL-7730", title: "Annual subscription",  customer: "Mei Lin",     amount: "AED 2,400", created: "27 May 2026", expires: "03 Jun 2026", url: "pay.beasy.ae/l/7730", status: "expired" },
    { id: "PL-7728", title: "Window service",       customer: "David Park",  amount: "AED 200", created: "26 May 2026", expires: "02 Jun 2026", url: "pay.beasy.ae/l/7728", status: "paid" },
  ];

  window.DATA = { cleaners, orders, onboarding, payouts, paylinks };

  // ============================================================
  //  GENERIC LIST DATASETS  (module id -> {columns, rows, filters})
  //  column: { key, label, type, align? }
  //  type: text | mono | two | badge | money | tag | date | num
  // ============================================================
  const DATASETS = {
    activity: {
      filters: ["All actions", "Order", "Partner", "Finance", "Auth"],
      columns: [
        { key: "time", label: "Timestamp", type: "mono" },
        { key: "actor", label: "Actor", type: "two" },
        { key: "action", label: "Action", type: "text" },
        { key: "target", label: "Target", type: "mono" },
        { key: "type", label: "Type", type: "badge" },
      ],
      rows: [
        { time: "30 May 14:22", actor: two("Aria Soto", "Ops Manager"), action: "Assigned cleaner to order", target: "ORD-90412", type: b("Order", "info") },
        { time: "30 May 13:50", actor: two("Sam Reed", "Finance"), action: "Marked payout as paid", target: "PO-5509", type: b("Finance", "s") },
        { time: "30 May 12:14", actor: two("Aria Soto", "Ops Manager"), action: "Approved partner application", target: "PA-3377", type: b("Partner", "brand") },
        { time: "30 May 11:02", actor: two("System", "Automation"), action: "OTP issued to customer", target: "+971 50 ••• 9087", type: b("Auth", "n") },
        { time: "30 May 09:41", actor: two("Mona Adel", "Marketing"), action: "Created payment link", target: "PL-7741", type: b("Finance", "s") },
        { time: "29 May 17:30", actor: two("Aria Soto", "Ops Manager"), action: "Cancelled order", target: "ORD-90402", type: b("Order", "info") },
      ],
    },
    chat: {
      filters: ["All", "Open", "Resolved"],
      columns: [
        { key: "customer", label: "Customer", type: "two" },
        { key: "last", label: "Last message", type: "text" },
        { key: "channel", label: "Channel", type: "tag" },
        { key: "status", label: "Status", type: "badge" },
        { key: "updated", label: "Updated", type: "date" },
      ],
      rows: [
        { customer: two("Hana Yusuf", "ORD-90412"), last: "Can the cleaner arrive earlier?", channel: tag("WhatsApp"), status: b("Open", "w"), updated: "2 min ago" },
        { customer: two("Omar Khalid", "ORD-90411"), last: "Thanks, all sorted!", channel: tag("In-app"), status: b("Resolved", "s"), updated: "18 min ago" },
        { customer: two("Lucy Bennett", "ORD-90410"), last: "Cleaner is running late", channel: tag("WhatsApp"), status: b("Open", "w"), updated: "40 min ago" },
        { customer: two("David Park", "ORD-90402"), last: "I'd like a refund please", channel: tag("Email"), status: b("Open", "e"), updated: "1 hr ago" },
        { customer: two("Mei Lin", "ORD-90405"), last: "Great service 5 stars", channel: tag("In-app"), status: b("Resolved", "s"), updated: "3 hr ago" },
      ],
    },
    exchange: {
      filters: ["All", "Active"],
      columns: [
        { key: "pair", label: "Currency pair", type: "mono" },
        { key: "name", label: "Name", type: "text" },
        { key: "rate", label: "Rate (to AED)", type: "num" },
        { key: "updated", label: "Updated", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { pair: "USD → AED", name: "US Dollar", rate: "3.6725", updated: "30 May 08:00", status: b("Active", "s") },
        { pair: "EUR → AED", name: "Euro", rate: "3.9810", updated: "30 May 08:00", status: b("Active", "s") },
        { pair: "GBP → AED", name: "British Pound", rate: "4.6620", updated: "30 May 08:00", status: b("Active", "s") },
        { pair: "INR → AED", name: "Indian Rupee", rate: "0.0441", updated: "30 May 08:00", status: b("Active", "s") },
        { pair: "SAR → AED", name: "Saudi Riyal", rate: "0.9790", updated: "29 May 08:00", status: b("Active", "s") },
      ],
    },
    "fin-orders": {
      filters: ["All", "Paid", "Refunded", "This month"],
      columns: [
        { key: "code", label: "Order", type: "mono" },
        { key: "customer", label: "Customer", type: "two" },
        { key: "partner", label: "Partner", type: "text" },
        { key: "gross", label: "Gross", type: "money" },
        { key: "commission", label: "Commission", type: "money" },
        { key: "net", label: "Net", type: "money" },
        { key: "status", label: "Payment", type: "badge" },
      ],
      rows: [
        { code: "ORD-90412", customer: two("Hana Yusuf", "Marina"), partner: "SparkleCo", gross: money("AED 320"), commission: money("AED 48"), net: money("AED 272"), status: b("Paid", "s") },
        { code: "ORD-90411", customer: two("Omar Khalid", "JLT"), partner: "SparkleCo", gross: money("AED 180"), commission: money("AED 27"), net: money("AED 153"), status: b("Paid", "s") },
        { code: "ORD-90410", customer: two("Lucy Bennett", "Deira"), partner: "HomeShine", gross: money("AED 450"), commission: money("AED 68"), net: money("AED 382"), status: b("Paid", "s") },
        { code: "ORD-90408", customer: two("Tariq Aziz", "Business Bay"), partner: "HomeShine", gross: money("AED 600"), commission: money("AED 90"), net: money("AED 510"), status: b("Paid", "s") },
        { code: "ORD-90402", customer: two("David Park", "Marina"), partner: "—", gross: money("AED 200"), commission: money("AED 0"), net: money("AED 0"), status: b("Refunded", "e") },
      ],
    },
    "fin-topup": {
      filters: ["All", "Wallet", "Card"],
      columns: [
        { key: "id", label: "Top-up", type: "mono" },
        { key: "customer", label: "Customer", type: "two" },
        { key: "method", label: "Method", type: "tag" },
        { key: "amount", label: "Amount", type: "money" },
        { key: "date", label: "Date", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { id: "TP-2207", customer: two("Hana Yusuf", "Wallet ••4521"), method: tag("Card"), amount: money("AED 500"), date: "30 May 2026", status: b("Success", "s") },
        { id: "TP-2206", customer: two("Mei Lin", "Wallet ••8830"), method: tag("Apple Pay"), amount: money("AED 1,000"), date: "30 May 2026", status: b("Success", "s") },
        { id: "TP-2205", customer: two("Omar Khalid", "Wallet ••1190"), method: tag("Card"), amount: money("AED 250"), date: "29 May 2026", status: b("Pending", "w") },
        { id: "TP-2203", customer: two("David Park", "Wallet ••7762"), method: tag("Card"), amount: money("AED 200"), date: "29 May 2026", status: b("Failed", "e") },
      ],
    },
    "fin-bcombo": {
      filters: ["All", "Active"],
      columns: [
        { key: "id", label: "Combo", type: "mono" },
        { key: "name", label: "Bundle", type: "two" },
        { key: "sold", label: "Sold", type: "num" },
        { key: "revenue", label: "Revenue", type: "money" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { id: "BC-44", name: two("Home Care Trio", "3 services"), sold: "212", revenue: money("AED 84,800"), status: b("Active", "s") },
        { id: "BC-41", name: two("Move-in Bundle", "Deep + window"), sold: "138", revenue: money("AED 62,100"), status: b("Active", "s") },
        { id: "BC-38", name: two("Office Combo", "5 services"), sold: "74", revenue: money("AED 51,800"), status: b("Paused", "n") },
      ],
    },
    "fin-direct": {
      filters: ["All", "This month"],
      columns: [
        { key: "id", label: "Sale", type: "mono" },
        { key: "agent", label: "Agent", type: "two" },
        { key: "customer", label: "Customer", type: "text" },
        { key: "amount", label: "Amount", type: "money" },
        { key: "date", label: "Date", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { id: "DS-881", agent: two("Mona Adel", "Field sales"), customer: "Crystal Tower FM", amount: money("AED 4,200"), date: "30 May 2026", status: b("Closed", "s") },
        { id: "DS-879", agent: two("Karim Saad", "Field sales"), customer: "Marina Gate HOA", amount: money("AED 7,800"), date: "29 May 2026", status: b("Closed", "s") },
        { id: "DS-877", agent: two("Mona Adel", "Field sales"), customer: "Bay Square Offices", amount: money("AED 2,100"), date: "28 May 2026", status: b("Pending", "w") },
      ],
    },
    partner: {
      filters: ["All", "Active", "Suspended"],
      columns: [
        { key: "company", label: "Partner", type: "two" },
        { key: "area", label: "Service area", type: "text" },
        { key: "fleet", label: "Cleaners", type: "num" },
        { key: "rating", label: "Rating", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { company: two("SparkleCo", "PA-2201"), area: "Dubai · Marina, JLT", fleet: "38", rating: "4.8 ★", status: b("Active", "s") },
        { company: two("HomeShine", "PA-2188"), area: "Dubai · Deira", fleet: "29", rating: "4.7 ★", status: b("Active", "s") },
        { company: two("GleamWorks", "PA-2177"), area: "Dubai · JLT", fleet: "22", rating: "4.9 ★", status: b("Active", "s") },
        { company: two("PureHome", "PA-2160"), area: "Dubai · Deira", fleet: "8", rating: "4.5 ★", status: b("Active", "s") },
        { company: two("TidyTeam", "PA-2140"), area: "Dubai · Central", fleet: "3", rating: "4.1 ★", status: b("Suspended", "e") },
      ],
    },
    "partner-tracking": {
      filters: ["All", "On-job", "Idle"],
      columns: [
        { key: "cleaner", label: "Cleaner", type: "two" },
        { key: "partner", label: "Partner", type: "text" },
        { key: "order", label: "Current order", type: "mono" },
        { key: "location", label: "Location", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { cleaner: two("Grace Okoro", "CL-076"), partner: "HomeShine", order: "ORD-90410", location: "Deira · en route", status: b("On-job", "info") },
        { cleaner: two("Rosa Delgado", "CL-088"), partner: "SparkleCo", order: "ORD-90408", location: "Business Bay", status: b("On-job", "info") },
        { cleaner: two("Maria Santos", "CL-204"), partner: "SparkleCo", order: "—", location: "Marina · idle", status: b("Idle", "n") },
        { cleaner: two("Aisha Rahman", "CL-118"), partner: "SparkleCo", order: "—", location: "Marina · idle", status: b("Idle", "n") },
      ],
    },
    cleaner: {
      filters: ["All", "Available", "On-job", "Off"],
      columns: [
        { key: "name", label: "Cleaner", type: "two" },
        { key: "zone", label: "Zone", type: "text" },
        { key: "rating", label: "Rating", type: "text" },
        { key: "jobs", label: "Jobs", type: "num" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: cleaners.map((c) => ({
        name: two(c.name, c.id),
        zone: c.zone,
        rating: c.rating + " ★",
        jobs: String(c.jobs),
        status: c.status === "available" ? b("Available", "s") : c.status === "on-job" ? b("On-job", "info") : b("Off", "n"),
      })),
    },
    "mkt-customer": {
      filters: ["All", "Active", "Churned"],
      columns: [
        { key: "name", label: "Customer", type: "two" },
        { key: "orders", label: "Orders", type: "num" },
        { key: "ltv", label: "Lifetime value", type: "money" },
        { key: "segment", label: "Segment", type: "tag" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Hana Yusuf", "hana@mail.com"), orders: "24", ltv: money("AED 6,120"), segment: tag("VIP"), status: b("Active", "s") },
        { name: two("Mei Lin", "mei@mail.com"), orders: "18", ltv: money("AED 4,880"), segment: tag("Loyal"), status: b("Active", "s") },
        { name: two("Omar Khalid", "omar@mail.com"), orders: "9", ltv: money("AED 1,640"), segment: tag("Regular"), status: b("Active", "s") },
        { name: two("David Park", "david@mail.com"), orders: "3", ltv: money("AED 520"), segment: tag("New"), status: b("Churned", "n") },
      ],
    },
    "mkt-users": {
      filters: ["All", "Verified", "Unverified"],
      columns: [
        { key: "name", label: "User", type: "two" },
        { key: "phone", label: "Phone", type: "mono" },
        { key: "joined", label: "Joined", type: "date" },
        { key: "platform", label: "Platform", type: "tag" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Hana Yusuf", "ID 88421"), phone: "+971 50 ••• 9087", joined: "12 Jan 2025", platform: tag("iOS"), status: b("Verified", "s") },
        { name: two("Tariq Aziz", "ID 88410"), phone: "+971 50 ••• 6654", joined: "03 Feb 2025", platform: tag("Android"), status: b("Verified", "s") },
        { name: two("Sofia Reyes", "ID 88399"), phone: "+971 56 ••• 1108", joined: "20 Mar 2025", platform: tag("Web"), status: b("Unverified", "w") },
        { name: two("Yara Salim", "ID 88350"), phone: "+971 54 ••• 7745", joined: "28 Apr 2025", platform: tag("iOS"), status: b("Verified", "s") },
      ],
    },
    "mkt-coupon": {
      filters: ["All", "Active", "Expired"],
      columns: [
        { key: "code", label: "Code", type: "mono" },
        { key: "desc", label: "Description", type: "two" },
        { key: "used", label: "Used", type: "num" },
        { key: "discount", label: "Discount", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { code: "CLEAN30", desc: two("30% off first clean", "New customers"), used: "1,204", discount: "30%", status: b("Active", "s") },
        { code: "SUMMER50", desc: two("AED 50 off deep clean", "All customers"), used: "642", discount: "AED 50", status: b("Active", "s") },
        { code: "WELCOME10", desc: two("10% welcome offer", "App signups"), used: "3,890", discount: "10%", status: b("Active", "s") },
        { code: "EID2025", desc: two("Eid promo", "Expired campaign"), used: "2,118", discount: "25%", status: b("Expired", "n") },
      ],
    },
    "mkt-otp": {
      filters: ["All", "Delivered", "Failed"],
      columns: [
        { key: "phone", label: "Phone", type: "mono" },
        { key: "channel", label: "Channel", type: "tag" },
        { key: "purpose", label: "Purpose", type: "text" },
        { key: "time", label: "Sent", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { phone: "+971 50 ••• 9087", channel: tag("SMS"), purpose: "Login", time: "30 May 14:20", status: b("Delivered", "s") },
        { phone: "+971 55 ••• 1123", channel: tag("WhatsApp"), purpose: "Order confirm", time: "30 May 13:55", status: b("Delivered", "s") },
        { phone: "+971 52 ••• 4410", channel: tag("SMS"), purpose: "Login", time: "30 May 13:10", status: b("Failed", "e") },
        { phone: "+971 56 ••• 0098", channel: tag("SMS"), purpose: "Password reset", time: "30 May 12:02", status: b("Delivered", "s") },
      ],
    },
    "mkt-notification": {
      filters: ["All", "Sent", "Scheduled"],
      columns: [
        { key: "title", label: "Campaign", type: "two" },
        { key: "audience", label: "Audience", type: "text" },
        { key: "reach", label: "Reach", type: "num" },
        { key: "sent", label: "Send time", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { title: two("Weekend 20% off", "Push + in-app"), audience: "All active users", reach: "42,100", sent: "31 May 09:00", status: b("Scheduled", "w") },
        { title: two("Rate your cleaner", "Push"), audience: "Completed orders", reach: "1,820", sent: "30 May 18:00", status: b("Sent", "s") },
        { title: two("New: window service", "In-app"), audience: "Marina + JLT", reach: "8,640", sent: "29 May 10:00", status: b("Sent", "s") },
      ],
    },
    "mkt-banner": {
      filters: ["All", "Live", "Draft"],
      columns: [
        { key: "name", label: "Banner", type: "two" },
        { key: "placement", label: "Placement", type: "tag" },
        { key: "clicks", label: "Clicks", type: "num" },
        { key: "window", label: "Active window", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Summer cleaning sale", "1200×400"), placement: tag("App home"), clicks: "12,400", window: "Until 15 Jun", status: b("Live", "s") },
        { name: two("Refer a friend", "1200×400"), placement: tag("App home"), clicks: "8,910", window: "Ongoing", status: b("Live", "s") },
        { name: two("Eid teaser", "1200×400"), placement: tag("Web hero"), clicks: "0", window: "Not started", status: b("Draft", "n") },
      ],
    },
    "cust-overview": {
      filters: ["All", "Active", "Inactive"],
      columns: [
        { key: "name", label: "Customer", type: "two" },
        { key: "type", label: "Type", type: "tag" },
        { key: "orders", label: "Orders", type: "num" },
        { key: "spend", label: "Total spend", type: "money" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Hana Yusuf", "+971 50 ••• 9087"), type: tag("Registered"), orders: "24", spend: money("AED 6,120"), status: b("Active", "s") },
        { name: two("Crystal Tower FM", "B2B"), type: tag("Direct sale"), orders: "61", spend: money("AED 48,300"), status: b("Active", "s") },
        { name: two("Mei Lin", "+971 56 ••• 0098"), type: tag("Registered"), orders: "18", spend: money("AED 4,880"), status: b("Active", "s") },
        { name: two("David Park", "+971 54 ••• 7781"), type: tag("Registered"), orders: "3", spend: money("AED 520"), status: b("Inactive", "n") },
      ],
    },
    "cust-direct": {
      filters: ["All", "B2B", "Closed"],
      columns: [
        { key: "name", label: "Account", type: "two" },
        { key: "contact", label: "Contact", type: "text" },
        { key: "contract", label: "Contract", type: "money" },
        { key: "renewal", label: "Renewal", type: "date" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Crystal Tower FM", "Facilities"), contact: "Imran Shah", contract: money("AED 48,000/yr"), renewal: "12 Dec 2026", status: b("Active", "s") },
        { name: two("Marina Gate HOA", "Residential"), contact: "Lara Voss", contract: money("AED 92,000/yr"), renewal: "01 Sep 2026", status: b("Active", "s") },
        { name: two("Bay Square Offices", "Commercial"), contact: "Karim Saad", contract: money("AED 26,400/yr"), renewal: "20 Jul 2026", status: b("Pending", "w") },
      ],
    },
    "cust-registered": {
      filters: ["All", "Verified", "New"],
      columns: [
        { key: "name", label: "Customer", type: "two" },
        { key: "joined", label: "Joined", type: "date" },
        { key: "orders", label: "Orders", type: "num" },
        { key: "wallet", label: "Wallet", type: "money" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Hana Yusuf", "hana@mail.com"), joined: "12 Jan 2025", orders: "24", wallet: money("AED 220"), status: b("Verified", "s") },
        { name: two("Omar Khalid", "omar@mail.com"), joined: "08 Feb 2025", orders: "9", wallet: money("AED 40"), status: b("Verified", "s") },
        { name: two("Sofia Reyes", "sofia@mail.com"), joined: "20 Mar 2025", orders: "1", wallet: money("AED 0"), status: b("New", "w") },
      ],
    },
    "cust-tickets": {
      filters: ["All", "Open", "Resolved", "Escalated"],
      columns: [
        { key: "id", label: "Ticket", type: "mono" },
        { key: "subject", label: "Subject", type: "two" },
        { key: "priority", label: "Priority", type: "tag" },
        { key: "agent", label: "Agent", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { id: "TK-5521", subject: two("Refund not received", "David Park · ORD-90402"), priority: tag("High"), agent: "Mona Adel", status: b("Escalated", "e") },
        { id: "TK-5519", subject: two("Cleaner arrived late", "Lucy Bennett · ORD-90410"), priority: tag("Medium"), agent: "Sam Reed", status: b("Open", "w") },
        { id: "TK-5515", subject: two("Change schedule", "Hana Yusuf · ORD-90412"), priority: tag("Low"), agent: "Aria Soto", status: b("Resolved", "s") },
        { id: "TK-5510", subject: two("Damaged item claim", "Tariq Aziz · ORD-90408"), priority: tag("High"), agent: "Mona Adel", status: b("Open", "w") },
      ],
    },
    "setup-items": {
      filters: ["All", "Service", "Add-on"],
      columns: [
        { key: "name", label: "Item", type: "two" },
        { key: "category", label: "Category", type: "tag" },
        { key: "duration", label: "Duration", type: "text" },
        { key: "price", label: "Base price", type: "money" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: two("Deep clean — apartment", "SKU CL-DEEP"), category: tag("Service"), duration: "3–4 hrs", price: money("AED 320"), status: b("Active", "s") },
        { name: two("Standard clean — villa", "SKU CL-STD"), category: tag("Service"), duration: "4–5 hrs", price: money("AED 450"), status: b("Active", "s") },
        { name: two("Sofa shampoo", "SKU AD-SOFA"), category: tag("Add-on"), duration: "1 hr", price: money("AED 120"), status: b("Active", "s") },
        { name: two("Window cleaning", "SKU AD-WIN"), category: tag("Add-on"), duration: "1–2 hrs", price: money("AED 200"), status: b("Draft", "n") },
      ],
    },
    "setup-schedule": {
      filters: ["All", "Open", "Full"],
      columns: [
        { key: "slot", label: "Time slot", type: "mono" },
        { key: "zone", label: "Zone", type: "text" },
        { key: "capacity", label: "Capacity", type: "text" },
        { key: "booked", label: "Booked", type: "num" },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { slot: "Mon 09:00–12:00", zone: "Marina", capacity: "12 cleaners", booked: "9", status: b("Open", "s") },
        { slot: "Mon 13:00–16:00", zone: "Marina", capacity: "12 cleaners", booked: "12", status: b("Full", "e") },
        { slot: "Mon 09:00–12:00", zone: "Deira", capacity: "8 cleaners", booked: "5", status: b("Open", "s") },
        { slot: "Tue 09:00–12:00", zone: "JLT", capacity: "10 cleaners", booked: "7", status: b("Open", "s") },
      ],
    },
  };

  window.DATASETS = DATASETS;
})();
