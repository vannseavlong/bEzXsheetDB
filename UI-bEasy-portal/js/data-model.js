/* ============================================================
   bEasy Portal — RBAC data model
   Plain script. Exposes window.RBAC with the permission engine.
   ============================================================ */
(function () {
  "use strict";

  // ---- Canonical actions ------------------------------------
  // Every gated control in the portal maps to one of these verbs.
  const ACTIONS = {
    view:    { id: "view",    label: "View",        short: "View",  icon: "Eye.svg" },
    add:     { id: "add",     label: "Add",         short: "Add",   icon: "PlusCircle.svg" },
    update:  { id: "update",  label: "Update",      short: "Edit",  icon: "Edit01.svg" },
    delete:  { id: "delete",  label: "Delete",      short: "Delete",icon: "Trash01.svg" },
    export:  { id: "export",  label: "Export",      short: "Export",icon: "Download01.svg" },
    assign:  { id: "assign",  label: "Assign",      short: "Assign",icon: "User01.svg" },
    markPaid:{ id: "markPaid",label: "Mark as paid",short: "Mark paid", icon: "CheckCircle.svg" },
  };
  const ACTION_ORDER = ["view", "add", "update", "delete", "export", "assign", "markPaid"];

  // ---- Roles -------------------------------------------------
  const ROLES = [
    { id: "super",     name: "Super Admin",       blurb: "Full access to every module and setting", color: "var(--suntel-500)",  initials: "SA" },
    { id: "ops",       name: "Ops Manager",       blurb: "Runs daily order & cleaner operations",   color: "var(--info-500)",    initials: "OM" },
    { id: "finance",   name: "Finance",           blurb: "Owns finance, top-ups and payouts",        color: "var(--success-500)", initials: "FN" },
    { id: "marketing", name: "Marketing",         blurb: "Manages campaigns, coupons and customers", color: "var(--bnow-500)",    initials: "MK", darkText: true },
    { id: "partner",   name: "Partner Manager",   blurb: "Onboards and tracks service partners",     color: "#7A5AF8",            initials: "PM" },
    { id: "auditor",   name: "Read-only Auditor", blurb: "Can view and export, nothing else",        color: "var(--gray-500)",    initials: "AU" },
  ];

  // ---- Module catalogue --------------------------------------
  // group = sidebar section. caps = the actions this module supports
  // at all (the module's capability ceiling — RBAC grants are a subset).
  const GROUPS = [
    { id: "core",      label: "Core" },
    { id: "finance",   label: "Finance" },
    { id: "partner",   label: "Partner" },
    { id: "cleaner",   label: "Cleaner" },
    { id: "marketing", label: "Marketing" },
    { id: "customer",  label: "Customer" },
    { id: "setup",     label: "Setup" },
    { id: "system",    label: "Administration" },
  ];

  const MODULES = [
    // CORE
    { id: "dashboard", group: "core", label: "Dashboard",     icon: "Home01.svg",          caps: ["view"], kind: "dashboard" },
    { id: "order",     group: "core", label: "Order",         icon: "ShoppingBag01.svg",   caps: ["view","add","update","delete","assign"], kind: "order", count: 248 },
    { id: "activity",  group: "core", label: "Activity log",  icon: "clock-fast-forward.svg", caps: ["view"], kind: "table" },
    { id: "chat",      group: "core", label: "Chat",          icon: "MessageSquare01.svg", caps: ["view","add","update","delete"], kind: "table", count: 7 },
    { id: "exchange",  group: "core", label: "Exchange rate", icon: "RefreshCcw01.svg",    caps: ["view","add"], kind: "table" },

    // FINANCE
    { id: "fin-orders", group: "finance", label: "Orders",       icon: "ShoppingCart01.svg", caps: ["view","export"], kind: "table", parent: "Finance" },
    { id: "fin-topup",  group: "finance", label: "Top-up",       icon: "currency-dollar.svg",caps: ["view","add","export"], kind: "table", parent: "Finance" },
    { id: "fin-bcombo", group: "finance", label: "BCombo",       icon: "cube-01.svg",        caps: ["view","export"], kind: "table", parent: "Finance" },
    { id: "fin-direct", group: "finance", label: "Direct sales", icon: "CreditCard01.svg",   caps: ["view","export"], kind: "table", parent: "Finance" },

    // PARTNER
    { id: "partner",            group: "partner", label: "Partners",          icon: "Building01.svg",   caps: ["view","add","update","delete"], kind: "table", count: 64 },
    { id: "partner-onboarding", group: "partner", label: "Onboarding",        icon: "file-check-01.svg",caps: ["view","update"], kind: "onboarding", count: 9 },
    { id: "partner-tracking",   group: "partner", label: "Tracking",          icon: "marker-pin-01.svg",caps: ["view","assign"], kind: "table" },
    { id: "partner-payout",     group: "partner", label: "Payout",            icon: "currency-dollar.svg", caps: ["view","update","export","markPaid"], kind: "payout", count: 12 },

    // CLEANER
    { id: "cleaner", group: "cleaner", label: "Cleaners", icon: "User01.svg", caps: ["view","add","update","delete"], kind: "table", count: 132 },

    // MARKETING
    { id: "mkt-overview",     group: "marketing", label: "Overview",     icon: "announcement-01.svg", caps: ["view"], kind: "mkt-overview", parent: "Marketing" },
    { id: "mkt-customer",     group: "marketing", label: "Customer",     icon: "Users01.svg",         caps: ["view","add","update","delete","export"], kind: "table", parent: "Marketing" },
    { id: "mkt-users",        group: "marketing", label: "All users",    icon: "Users01.svg",         caps: ["view","add","update","delete","export"], kind: "table", parent: "Marketing" },
    { id: "mkt-coupon",       group: "marketing", label: "Coupon",       icon: "Tag01.svg",           caps: ["view","add","update","delete"], kind: "table", parent: "Marketing" },
    { id: "mkt-paylink",      group: "marketing", label: "Payment link", icon: "Link01.svg",          caps: ["view","add","export","markPaid"], kind: "paylink", parent: "Marketing", count: 5 },
    { id: "mkt-otp",          group: "marketing", label: "OTP",          icon: "key-01.svg",          caps: ["view"], kind: "table", parent: "Marketing" },
    { id: "mkt-notification", group: "marketing", label: "Notification", icon: "Bell01.svg",          caps: ["view","add"], kind: "table", parent: "Marketing" },
    { id: "mkt-banner",       group: "marketing", label: "Banner",       icon: "Image01.svg",         caps: ["view","add","update","delete"], kind: "table", parent: "Marketing" },

    // CUSTOMER
    { id: "cust-overview",   group: "customer", label: "Overview",     icon: "Users01.svg",  caps: ["view","add","update","delete","export"], kind: "table", parent: "Customer" },
    { id: "cust-direct",     group: "customer", label: "Direct sale",  icon: "ShoppingBag01.svg", caps: ["view","add","update","delete","export"], kind: "table", parent: "Customer" },
    { id: "cust-registered", group: "customer", label: "Registered",   icon: "User01.svg",   caps: ["view","add","update","delete","export"], kind: "table", parent: "Customer" },
    { id: "cust-tickets",    group: "customer", label: "Tickets",      icon: "MessageSquare01.svg", caps: ["view","add","update","delete","export"], kind: "table", parent: "Customer", count: 18 },

    // SETUP
    { id: "setup-items",    group: "setup", label: "Items",    icon: "cube-01.svg",  caps: ["view","add","update","delete"], kind: "table", parent: "Setup" },
    { id: "setup-schedule", group: "setup", label: "Schedule", icon: "Calendar.svg", caps: ["view","add","update","delete"], kind: "table", parent: "Setup" },

    // SYSTEM
    { id: "roles", group: "system", label: "Roles & permissions", icon: "Settings01.svg", caps: ["view","update"], kind: "roles" },
  ];

  const MODULE_BY_ID = {};
  MODULES.forEach((m) => (MODULE_BY_ID[m.id] = m));

  // ---- Default permission grants -----------------------------
  // grants[roleId][moduleId] = [actions]. Subset of module.caps.
  function full(modId) { return MODULE_BY_ID[modId].caps.slice(); }
  function only(modId, acts) {
    const caps = MODULE_BY_ID[modId].caps;
    return acts.filter((a) => caps.includes(a));
  }

  function buildGrants() {
    const g = {};
    ROLES.forEach((r) => (g[r.id] = {}));

    // Super Admin — everything.
    MODULES.forEach((m) => (g.super[m.id] = full(m.id)));

    // Read-only Auditor — view (+ export) on everything except admin.
    MODULES.forEach((m) => {
      if (m.id === "roles") return; // auditor can't see RBAC admin
      g.auditor[m.id] = only(m.id, ["view", "export"]);
    });

    // Ops Manager
    g.ops = {
      dashboard: ["view"],
      order: ["view", "add", "update", "delete", "assign"],
      activity: ["view"],
      chat: ["view", "add", "update", "delete"],
      exchange: ["view"],
      "fin-orders": ["view", "export"],
      partner: ["view"],
      "partner-onboarding": ["view", "update"],
      "partner-tracking": ["view", "assign"],
      "partner-payout": ["view"],
      cleaner: ["view", "add", "update", "delete"],
      "mkt-overview": ["view"],
      "cust-overview": ["view"],
      "cust-tickets": ["view", "add", "update"],
      "setup-items": ["view", "add", "update", "delete"],
      "setup-schedule": ["view", "add", "update", "delete"],
    };

    // Finance
    g.finance = {
      dashboard: ["view"],
      order: ["view"],
      activity: ["view"],
      exchange: ["view", "add"],
      "fin-orders": ["view", "export"],
      "fin-topup": ["view", "add", "export"],
      "fin-bcombo": ["view", "export"],
      "fin-direct": ["view", "export"],
      "partner-payout": ["view", "update", "export", "markPaid"],
      "cust-overview": ["view"],
    };

    // Marketing
    g.marketing = {
      dashboard: ["view"],
      "mkt-overview": ["view"],
      "mkt-customer": ["view", "add", "update", "delete", "export"],
      "mkt-users": ["view", "add", "update", "delete", "export"],
      "mkt-coupon": ["view", "add", "update", "delete"],
      "mkt-paylink": ["view", "add", "export", "markPaid"],
      "mkt-otp": ["view"],
      "mkt-notification": ["view", "add"],
      "mkt-banner": ["view", "add", "update", "delete"],
      "cust-overview": ["view", "add", "update", "delete", "export"],
      "cust-direct": ["view", "add", "update", "delete", "export"],
      "cust-registered": ["view", "add", "update", "delete", "export"],
      "cust-tickets": ["view", "add", "update", "delete", "export"],
    };

    // Partner Manager
    g.partner = {
      dashboard: ["view"],
      order: ["view", "assign"],
      activity: ["view"],
      partner: ["view", "add", "update", "delete"],
      "partner-onboarding": ["view", "update"],
      "partner-tracking": ["view", "assign"],
      "partner-payout": ["view"],
      cleaner: ["view", "add", "update", "delete"],
    };

    return g;
  }

  // ---- Permission engine -------------------------------------
  function can(grants, roleId, moduleId, action) {
    const mod = MODULE_BY_ID[moduleId];
    if (!mod) return false;
    if (!mod.caps.includes(action)) return false;          // module doesn't support it
    const granted = (grants[roleId] && grants[roleId][moduleId]) || [];
    return granted.includes(action);
  }
  function canView(grants, roleId, moduleId) {
    return can(grants, roleId, moduleId, "view");
  }
  // Modules a role can see, grouped for the sidebar.
  function navForRole(grants, roleId) {
    return GROUPS.map((grp) => ({
      ...grp,
      items: MODULES.filter((m) => m.group === grp.id && canView(grants, roleId, m.id)),
    })).filter((grp) => grp.items.length);
  }

  window.RBAC = {
    ACTIONS, ACTION_ORDER, ROLES, GROUPS, MODULES, MODULE_BY_ID,
    buildGrants, can, canView, navForRole,
  };
})();
