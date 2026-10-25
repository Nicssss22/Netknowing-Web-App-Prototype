import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Role = "Admin" | "Staff" | "Director" | "Helpdesk" | "Auditor" | "Intern";
type Screen =
  | "login"
  | "dashboard"
  | "devices"
  | "device"
  | "ssh"
  | "history"
  | "reports"
  | "users"
  | "audit"
  | "insights"
  | "incident"
  | "monitoring";

const roles: { id: Role; label: string; short: string }[] = [
  { id: "Admin", label: "Network Administrator", short: "Administrator" },
  { id: "Staff", label: "CICT Staff", short: "Tech Support" },
  { id: "Director", label: "Management Viewer (Dean)", short: "Dean" },
  { id: "Helpdesk", label: "IT Helpdesk", short: "Helpdesk" },
  { id: "Auditor", label: "Auditor", short: "Auditor" },
  { id: "Intern", label: "Intern", short: "Intern" },
];

const permissions: Record<Role, Screen[]> = {
  Admin: ["dashboard", "devices", "device", "ssh", "history", "reports", "users", "audit", "insights", "incident", "monitoring"],
  Staff: ["dashboard", "devices", "device", "history", "reports", "insights", "incident"],
  Director: ["dashboard", "devices", "device", "history", "reports", "insights", "incident"],
  Helpdesk: ["dashboard", "devices", "device", "history", "incident"],
  Auditor: ["history", "reports", "audit"],
  Intern: ["dashboard", "devices", "device", "incident"],
};

const navItems: { screen: Screen; label: string; icon: IconName }[] = [
  { screen: "dashboard", label: "Network overview", icon: "grid" },
  { screen: "devices", label: "Devices", icon: "router" },
  { screen: "insights", label: "AI insights", icon: "spark" },
  { screen: "history", label: "Incident history", icon: "clock" },
  { screen: "reports", label: "Reports & analytics", icon: "chart" },
  { screen: "users", label: "Users & roles", icon: "users" },
  { screen: "audit", label: "Audit trail", icon: "shield" },
  { screen: "monitoring", label: "Monitoring setup", icon: "activity" },
];

