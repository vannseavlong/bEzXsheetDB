export const mockDashboardStats = {
  totalOrders: {
    value: 248,
    change: +12.5,
    label: "Total Orders",
    period: "vs last month",
  },
  totalRevenue: {
    value: 8420.50,
    change: +8.3,
    label: "Total Revenue",
    period: "vs last month",
  },
  activeCleaners: {
    value: 8,
    change: +1,
    label: "Active Cleaners",
    period: "vs last month",
  },
  newCustomers: {
    value: 34,
    change: +18.2,
    label: "New Customers",
    period: "vs last month",
  },
  pendingOrders: {
    value: 12,
    change: -5,
    label: "Pending Orders",
    period: "vs yesterday",
  },
  completedToday: {
    value: 9,
    change: +3,
    label: "Completed Today",
    period: "vs yesterday",
  },
  averageRating: {
    value: 4.6,
    change: +0.1,
    label: "Avg Service Rating",
    period: "vs last month",
  },
  openTickets: {
    value: 3,
    change: -2,
    label: "Open Tickets",
    period: "vs yesterday",
  },
};

// 30 days of user growth data
export const mockUserGrowth = [
  { date: "2026-05-03", count: 210 },
  { date: "2026-05-04", count: 213 },
  { date: "2026-05-05", count: 216 },
  { date: "2026-05-06", count: 219 },
  { date: "2026-05-07", count: 222 },
  { date: "2026-05-08", count: 224 },
  { date: "2026-05-09", count: 228 },
  { date: "2026-05-10", count: 231 },
  { date: "2026-05-11", count: 235 },
  { date: "2026-05-12", count: 237 },
  { date: "2026-05-13", count: 240 },
  { date: "2026-05-14", count: 244 },
  { date: "2026-05-15", count: 248 },
  { date: "2026-05-16", count: 252 },
  { date: "2026-05-17", count: 255 },
  { date: "2026-05-18", count: 258 },
  { date: "2026-05-19", count: 261 },
  { date: "2026-05-20", count: 265 },
  { date: "2026-05-21", count: 269 },
  { date: "2026-05-22", count: 273 },
  { date: "2026-05-23", count: 276 },
  { date: "2026-05-24", count: 280 },
  { date: "2026-05-25", count: 284 },
  { date: "2026-05-26", count: 288 },
  { date: "2026-05-27", count: 291 },
  { date: "2026-05-28", count: 295 },
  { date: "2026-05-29", count: 299 },
  { date: "2026-05-30", count: 303 },
  { date: "2026-05-31", count: 307 },
  { date: "2026-06-01", count: 312 },
];

// Revenue by month (last 6 months)
export const mockRevenueByMonth = [
  { month: "Jan 2026", revenue: 5200.0, orders: 148 },
  { month: "Feb 2026", revenue: 6100.0, orders: 172 },
  { month: "Mar 2026", revenue: 5800.0, orders: 160 },
  { month: "Apr 2026", revenue: 7200.0, orders: 198 },
  { month: "May 2026", revenue: 7770.0, orders: 220 },
  { month: "Jun 2026", revenue: 8420.5, orders: 248 },
];

// Order status distribution
export const mockOrderStatusData = [
  { name: "Completed", value: 185, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#3b82f6" },
  { name: "Pending", value: 20, color: "#f59e0b" },
  { name: "Cancelled", value: 15, color: "#ef4444" },
];

// Service category distribution
export const mockServiceCategoryData = [
  { name: "Home Cleaning", value: 120, color: "#6366f1" },
  { name: "Deep Cleaning", value: 55, color: "#0ea5e9" },
  { name: "Laundry", value: 38, color: "#8b5cf6" },
  { name: "Office Cleaning", value: 22, color: "#ec4899" },
  { name: "Post-Construction", value: 13, color: "#f97316" },
];

export const mockUpcomingOrders = [
  {
    id: "ORD-2026-001",
    customerName: "Sopheap Meas",
    serviceType: "Standard Cleaning",
    scheduleDate: "2026-06-05T08:00:00Z",
    address: "St. 271, BKK1, Phnom Penh",
    status: "PENDING",
    assignedCleaner: null,
  },
  {
    id: "ORD-2026-002",
    customerName: "Dara Chhun",
    serviceType: "Deep Clean Package",
    scheduleDate: "2026-06-06T10:00:00Z",
    address: "Russian Blvd, Sen Sok, Phnom Penh",
    status: "ACCEPTED",
    assignedCleaner: "Phearom Keo",
  },
  {
    id: "ORD-2026-006",
    customerName: "Piseth Lim",
    serviceType: "Post-Con Deep Clean",
    scheduleDate: "2026-06-10T07:00:00Z",
    address: "Diamond Island, Phnom Penh",
    status: "PENDING",
    assignedCleaner: null,
  },
  {
    id: "ORD-2026-007",
    customerName: "Kosal Nhem",
    serviceType: "Premium Cleaning",
    scheduleDate: "2026-06-09T09:00:00Z",
    address: "Boeung Keng Kang 3, Phnom Penh",
    status: "ACCEPTED",
    assignedCleaner: "Sothea Khim",
  },
  {
    id: "ORD-2026-008",
    customerName: "Bopha Chea",
    serviceType: "Dry Cleaning",
    scheduleDate: "2026-06-11T10:00:00Z",
    address: "Olympia Mall Area, Phnom Penh",
    status: "PENDING",
    assignedCleaner: null,
  },
];
