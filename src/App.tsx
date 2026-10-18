import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

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
  { id: "Staff", label: "CICT Staff", short: "CICT Staff" },
  { id: "Director", label: "Management Viewer (Director)", short: "Director" },
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

type IconName =
  | "grid" | "spark" | "clock" | "chart" | "users" | "shield" | "search"
  | "bell" | "volume" | "chevron" | "router" | "switch" | "wifi" | "server"
  | "check" | "warning" | "down" | "eye" | "download" | "calendar" | "filter"
  | "terminal" | "refresh" | "close" | "arrow" | "menu" | "sun" | "moon"
  | "lock" | "pin" | "activity" | "plus" | "edit" | "info" | "logout";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Partial<Record<IconName, ReactNode>> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    spark: <><path d="M4 4v16h16M8 15l4-5 4 2 4-7"/><path d="M16 5h4v4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chart: <><path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5M16 4.5a3 3 0 0 1 0 5.8M17 15c2.5.3 4 1.9 4 4"/></>,
    shield: <><path d="M12 3 4.5 6v5.2c0 4.6 3.2 8 7.5 9.8 4.3-1.8 7.5-5.2 7.5-9.8V6L12 3Z"/><path d="m9 12 2 2 4-4"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    volume: <><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    router: <><rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 12h.01M11 12h.01M17 14h.01M5 4l3 4m11-4-3 4"/></>,
    switch: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h2m2 0h2m2 0h2M7 14h2m2 0h6"/></>,
    wifi: <><path d="M4 9a12 12 0 0 1 16 0M7 12.5a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r=".5" fill="currentColor"/></>,
    server: <><rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M8 7h.01M8 17h.01M12 7h5M12 17h5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    warning: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
    down: <><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M4 20h16"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/></>,
    filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>,
    terminal: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 8a7 7 0 0 1 11.5-1L20 12M4 12l2.5 5A7 7 0 0 0 18 16"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    activity: <path d="M3 12h4l2-7 4 14 2-7h6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    edit: <><path d="m14 5 5 5L9 20H4v-5L14 5Z"/><path d="m12 7 5 5"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
    logout: <><path d="M10 4H5v16h5m4-4 4-4-4-4m4 4H9"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Status({ type, children }: { type: "up" | "degraded" | "down" | "ai" | "neutral"; children: ReactNode }) {
  const icon = type === "up" ? "check" : type === "down" ? "down" : type === "degraded" ? "warning" : type === "ai" ? "spark" : "info";
  return <span className={`status status-${type}`}><Icon name={icon} size={13}/>{children}</span>;
}

function Avatar({ name }: { name: string }) {
  return <span className="avatar">{name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>;
}

function LogoImage({ decorative = false }: { decorative?: boolean }) {
  return <img src={`${import.meta.env.BASE_URL}netknowing-n-logo.svg`} alt={decorative ? "" : "Netknowing logo"} />;
}

function Button({ children, variant = "primary", icon, onClick, disabled, visuallyDisabled, type = "button" }: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "purple";
  icon?: IconName; onClick?: () => void; disabled?: boolean; visuallyDisabled?: boolean; type?: "button" | "submit";
}) {
  return <button className={`btn btn-${variant} ${visuallyDisabled ? "btn-disabled" : ""}`} onClick={onClick} disabled={disabled} aria-disabled={visuallyDisabled} type={type}>{icon && <Icon name={icon} size={16}/>} {children}</button>;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

const incidents = [
  { name: "CICT-LAB2-SW-01", location: "Laboratory 2 · 2F", time: "08:42 AM", status: "Acknowledged", kind: "down" as const, detail: "Device unreachable" },
  { name: "CICT-FAC-AP-03", location: "Faculty Room · 3F", time: "08:16 AM", status: "Unacknowledged", kind: "down" as const, detail: "No response for 8 minutes" },
  { name: "CICT-LAB3-AP-06", location: "Laboratory 3 · 2F", time: "07:58 AM", status: "Acknowledged", kind: "degraded" as const, detail: "Packet loss above 8%" },
  { name: "CICT-LAB3-SW-02", location: "Laboratory 3 · 2F", time: "07:30 AM", status: "Early warning", kind: "ai" as const, detail: "Latency drifting above baseline" },
];

function Login({ role, setRole, onLogin }: { role: Role; setRole: (r: Role) => void; onLogin: () => void }) {
  const [forgot, setForgot] = useState(false);
  const privileged = role === "Admin" || role === "Auditor";
  const submit = (e: FormEvent) => { e.preventDefault(); onLogin(); };
  return <main className="login-page">
    <section className="login-brand">
      <div className="login-masthead"><div className="brand-mark large brand-mark-image"><LogoImage /></div><div><strong>Netknowing</strong><span>CICT NETWORK OPERATIONS</span></div><span className="campus-edition">MAIN CAMPUS</span></div>
      <div className="login-brand-copy">
        <span className="overline">Bulacan State University</span>
        <h1>CICT Network<br/>Operations</h1>
        <p>College of Information and Communications Technology<br/>Main Campus / Malolos, Bulacan</p>
        <div className="access-guidance"><Icon name="shield" size={20}/><div><strong>Restricted personnel access</strong><p>Device controls are reserved for the network administrator. Every role sees only the sections assigned to it.</p></div></div>
      </div>
      <div className="login-brand-bottom"><span className="login-campus">College of Information and<br/>Communications Technology</span><p className="secure-note"><Icon name="shield" size={16}/> Authorized personnel only · Sessions logged</p></div>
    </section>
    <section className="login-panel">
      <form className="login-form" onSubmit={submit}>
        <div className="mobile-brand"><div className="brand-mark brand-mark-image"><LogoImage /></div><strong>Netknowing</strong></div>
        <span className="overline blue">Personnel access</span>
        <h2>Sign in to Netknowing</h2>
        <p>Use your assigned CICT account to enter the console.</p>
        <label>View demo as<select value={role} onChange={(e) => setRole(e.target.value as Role)}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <label>Username<input required defaultValue={role === "Admin" ? "admin.cict" : role.toLowerCase()} placeholder="Enter your username"/></label>
        <label>Password<div className="input-icon"><input required type="password" defaultValue="netknowing"/><Icon name="eye" size={17}/></div></label>
        {privileged && <label>Two-factor authentication code<input required inputMode="numeric" pattern="[0-9 ]{6,7}" maxLength={7} defaultValue="482 901" placeholder="6-digit code"/><small><Icon name="lock" size={12}/> Required for privileged accounts</small></label>}
        <div className="login-options"><button type="button" className="link-btn" onClick={() => setForgot(true)}>Forgot password? Contact the network administrator</button></div>
        {forgot && <div className="inline-note"><Icon name="info" size={16}/><span>Ask the network administrator to reset your password. Self-service reset is not available.</span></div>}
        <Button type="submit">Enter operations console <Icon name="arrow" size={16}/></Button>
        <div className="demo-hint"><Icon name="info" size={14}/><span>Interactive prototype · Sample data only<br/>Demo credentials are prefilled. No live devices are connected.</span></div>
      </form>
    </section>
  </main>;
}

function AppShell({ role, setRole, screen, setScreen, dark, setDark, aiOn, children, onLogout }: {
  role: Role; setRole: (r: Role) => void; screen: Screen; setScreen: (s: Screen) => void;
  dark: boolean; setDark: (v: boolean) => void; aiOn: boolean; children: ReactNode; onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [audible, setAudible] = useState(true);
  const [search, setSearch] = useState("");
  const available = navItems.filter((n) => permissions[role].includes(n.screen));
  const changeRole = (newRole: Role) => {
    setRole(newRole); setRoleOpen(false);
    if (!permissions[newRole].includes(screen)) setScreen(newRole === "Auditor" ? "audit" : "dashboard");
  };
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark brand-mark-image"><LogoImage /></div><div><strong>Netknowing</strong><small>CICT Network Operations</small></div></div>
      <div className="campus-context"><Icon name="pin" size={15}/><div><strong>CICT Main Campus</strong><small>Bulacan State University</small></div></div>
      <nav>
        <span className="nav-label">Workspace</span>
        {available.map((item) => <button key={item.screen} className={screen === item.screen ? "nav-active" : ""} onClick={() => { setScreen(item.screen); setMobileOpen(false); }}><Icon name={item.icon}/><span>{item.label}</span>{item.screen === "dashboard" && <b className="nav-count">4</b>}{item.screen === "insights" && aiOn && <b className="nav-count purple">1</b>}</button>)}
      </nav>
      <div className="sidebar-foot">
        <div className="system-health"><span className="pulse"/><div><strong>Sample monitoring view</strong><small>No live polling configured</small></div></div>
        <button onClick={onLogout}><Icon name="logout"/><span>Sign out</span></button>
      </div>
    </aside>
    {mobileOpen && <div className="backdrop" onClick={() => setMobileOpen(false)}/>}
    <div className="main-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Icon name="menu"/></button>
      <div className="mobile-topbar-brand" aria-label="Netknowing">
        <div className="brand-mark brand-mark-image"><LogoImage decorative /></div>
        <strong>Netknowing</strong>
      </div>
      <div className="global-search"><Icon name="search"/><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && search.trim()) { const target: Screen = /CICT-|10\.20\./i.test(search) ? "device" : "history"; setScreen(permissions[role].includes(target) ? target : "history"); setSearch(""); } }} placeholder="Search devices, incidents, locations…"/><kbd>Enter</kbd></div>
        <div className="top-actions">
          <button className={`icon-btn ${audible ? "audible" : ""}`} aria-label={`Audible alerts ${audible ? "on" : "off"}`} aria-pressed={audible} onClick={() => setAudible(!audible)}><Icon name="volume" size={17}/>{audible && <span/>}</button>
          <button className="icon-btn" aria-label="Open active incident" onClick={() => permissions[role].includes("incident") && setScreen("incident")}><Icon name="bell"/><b>3</b></button>
          <div className="role-picker">
            <button className="profile-button" onClick={() => setRoleOpen(!roleOpen)}><Avatar name={roles.find((r) => r.id === role)!.label}/><span><small>View as</small><strong>{roles.find((r) => r.id === role)!.short}</strong></span><Icon name="chevron" size={15}/></button>
            {roleOpen && <div className="role-menu"><span>Switch demo role</span>{roles.map((r) => <button key={r.id} onClick={() => changeRole(r.id)} className={r.id === role ? "selected" : ""}><Avatar name={r.label}/><span><strong>{r.label}</strong><small>{r.id === role ? "Currently viewing" : "Switch permissions"}</small></span>{r.id === role && <Icon name="check" size={16}/>}</button>)}</div>}
          </div>
        </div>
      </header>
      <main className="content">{children}</main>
      <footer>Netknowing · CICT Main Campus <span>Prototype · Sample data only · No live device actions</span></footer>
    </div>
  </div>;
}

function SummaryCard({ icon, label, value, detail, tone }: { icon: IconName; label: string; value: string; detail: string; tone: string }) {
  return <article className={`summary-card summary-${tone}`}><span className={`summary-icon ${tone}`}><Icon name={icon}/></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>;
}

const nodes = [
  { name: "CICT-CORE-RTR-01", kind: "router" as const, status: "up", x: 50, y: 16, label: "Core Router" },
  { name: "CICT-F1-SW-01", kind: "switch" as const, status: "up", x: 20, y: 46, label: "1F Distribution" },
  { name: "CICT-LAB2-SW-01", kind: "switch" as const, status: "down", x: 49, y: 48, label: "Lab 2 Switch" },
  { name: "CICT-LAB3-SW-02", kind: "switch" as const, status: "degraded", x: 79, y: 46, label: "Lab 3 Switch", ai: true },
  { name: "CICT-SRV-01", kind: "server" as const, status: "up", x: 10, y: 78, label: "App Server" },
  { name: "CICT-FAC-AP-03", kind: "wifi" as const, status: "down", x: 34, y: 79, label: "Faculty AP" },
  { name: "CICT-LAB2-AP-04", kind: "wifi" as const, status: "up", x: 63, y: 79, label: "Lab 2 AP" },
  { name: "CICT-LAB3-AP-06", kind: "wifi" as const, status: "degraded", x: 89, y: 78, label: "Lab 3 AP" },
];

function Dashboard({ role, go, openIncident }: { role: Role; go: (s: Screen) => void; openIncident: (name: string) => void }) {
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");
  const [updated, setUpdated] = useState(false);
  const visibleIncidents = incidents.filter((item) => (role !== "Helpdesk" && role !== "Intern" || item.kind !== "ai") && (filter === "all" || (filter === "critical" ? item.kind === "down" : item.kind !== "down")));
  return <>
    <PageHeader eyebrow="CICT Main Campus / Network operations" title="Network overview" description="Thursday, 22 October 2026 · Sample monitoring snapshot" actions={<>{role === "Admin" && <Button variant="secondary" icon="activity" onClick={() => go("monitoring")}>Monitoring setup</Button>}<Status type="neutral">Sample monitoring</Status><Button variant="secondary" icon="refresh" onClick={() => setUpdated(true)}>Refresh snapshot</Button></>}/>
    {role === "Intern" && <div className="permission-banner"><Icon name="eye"/><span><strong>View-only access.</strong> Actions and sensitive controls are unavailable for the Intern role.</span></div>}
    <section className="summary-grid">
      <SummaryCard icon="router" label="Total devices" value="48" detail="Across 3 network tiers" tone="blue"/>
      <SummaryCard icon="check" label="Up" value="41" detail="85.4% healthy" tone="green"/>
      <SummaryCard icon="warning" label="Degraded" value="5" detail="2 need attention" tone="amber"/>
      <SummaryCard icon="down" label="Down" value="2" detail="Critical intervention" tone="red"/>
    </section>
    <div className="operations-strip"><span><Icon name="activity" size={16}/><strong>Sample poll interval · 60s</strong><span aria-live="polite">{updated ? "Sample snapshot refreshed · No live devices queried" : "Sample data timestamp · 09:18:00 AM"}</span></span><span><Icon name="warning" size={15}/><strong>2 sample outages</strong> require attention</span></div>
    <section className="triage-panel card">
      <div className="card-head"><div><h2>Needs attention <span className="section-count">4</span></h2><p>Investigate outages first. Warnings are advisory and require review.</p></div>{permissions[role].includes("history") && <Button variant="ghost" icon="clock" onClick={() => go("history")}>Incident history</Button>}</div>
      <div className="triage-toolbar"><div className="triage-tabs"><Button variant={filter === "all" ? "primary" : "ghost"} onClick={() => setFilter("all")}>All incidents · 4</Button><Button variant={filter === "critical" ? "primary" : "ghost"} onClick={() => setFilter("critical")}>Outages · 2</Button><Button variant={filter === "warning" ? "primary" : "ghost"} onClick={() => setFilter("warning")}>Warnings · 2</Button></div><span>Sorted by severity</span></div>
      <div className="triage-table" role="table" aria-label="Active network incidents">
        <div className="triage-columns" role="row"><span role="columnheader">State</span><span role="columnheader">Device / issue</span><span role="columnheader">Location</span><span role="columnheader">Detected</span><span role="columnheader">Response</span><span role="columnheader">Action</span></div>
        {visibleIncidents.map((item) => <div className={`triage-entry severity-${item.kind}`} role="row" key={item.name}>
          <span role="cell"><Status type={item.kind === "ai" ? "degraded" : item.kind}>{item.kind === "down" ? "Down" : item.kind === "ai" ? <><span>Early warning</span><Status type="ai">AI</Status></> : "Degraded"}</Status></span>
          <span role="cell" className="triage-device"><strong>{item.name}</strong><small>{item.detail}</small></span>
          <span role="cell" className="triage-location">{item.location}</span>
          <span role="cell" className="triage-time">{item.time}</span>
          <span role="cell" className="triage-response">{item.kind === "ai" ? "Administrator review" : item.status}</span>
          <span role="cell"><Button variant="ghost" icon="arrow" onClick={() => openIncident(item.name)}>Details</Button></span>
        </div>)}
      </div>
      <div className="triage-escalation"><Icon name="clock" size={16}/><span><strong>Awaiting acknowledgement:</strong> CICT-FAC-AP-03</span><span>Secondary contact escalation in <strong>04:12</strong></span></div>
    </section>
    <section className="dashboard-grid overview-support">
      <article className="card topology-card">
        <div className="card-head"><div><h2>Campus topology</h2><p>Illustrative sample connectivity · no live device data</p></div><div className="legend"><span><i className="dot up"/>Up</span><span><i className="dot degraded"/>Degraded</span><span><i className="dot down"/>Down</span></div></div>
        <div className="topology">
          <svg className="topology-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 20 20 46M50 20 49 48M50 20 79 46M20 46 10 78M20 46 34 79M49 48 63 79M79 46 89 78"/></svg>
          <span className="zone z1">Core</span><span className="zone z2">Floor distribution</span><span className="zone z3">Endpoints</span>
          {nodes.map((n) => <button key={n.name} className={`topology-node node-${n.status}`} style={{ left: `${n.x}%`, top: `${n.y}%` }} onClick={() => go("device")}><span className="node-icon"><Icon name={n.kind} size={19}/></span><strong>{n.label}</strong><small>{n.name}</small><Status type={n.status as "up" | "down" | "degraded"}>{n.status === "up" ? "Up" : n.status === "down" ? "Down" : "Degraded"}</Status></button>)}
        </div>
        <div className="topology-foot"><span><Icon name="activity" size={15}/> Average campus latency <strong>14 ms</strong></span><button className="link-btn" onClick={() => go("devices")}>View all 48 devices <Icon name="arrow" size={14}/></button></div>
      </article>
      <article className="card handoff-card">
        <div className="card-head"><div><h2>Operations desk</h2><p>Response ownership and monitoring scope</p></div><Icon name="shield" size={18}/></div>
        <div className="desk-contact"><Avatar name="Maria Santos"/><div><strong>Engr. Maria Santos</strong><span>Network Administrator · Primary contact</span></div></div>
        <div className="desk-fact"><span>Secondary contact</span><strong>Paolo Cruz · CICT Staff</strong></div>
        <div className="desk-fact"><span>Alert delivery</span><strong>Email and in-app</strong></div>
        <div className="desk-fact"><span>Monitored checks</span><strong>ICMP / SNMP / TCP</strong></div>
        <div className="desk-note"><Icon name="info" size={17}/><span>Recommendations never run automatically. Reboots and SSH sessions require an administrator.</span></div>
      </article>
    </section>
  </>;
}

function MonitoringSetup() {
  const [devices, setDevices] = useState([
    ["CICT-CORE-RTR-01", "Router", "10.20.0.1", "Server Room"],
    ["CICT-F1-SW-01", "Switch", "10.20.1.2", "1st Floor"],
    ["CICT-LAB2-SW-01", "Switch", "10.20.2.11", "Laboratory 2"],
    ["CICT-LAB3-SW-02", "Switch", "10.20.3.12", "Laboratory 3"],
    ["CICT-SRV-01", "Server", "10.20.0.20", "Server Room"],
  ]);
  const [pollInterval, setPollInterval] = useState("60");
  const [latencyThreshold, setLatencyThreshold] = useState("60");
  const [packetLossThreshold, setPacketLossThreshold] = useState("6");
  const [escalationMinutes, setEscalationMinutes] = useState("5");
  const [deduplicate, setDeduplicate] = useState(true);
  const [notice, setNotice] = useState("");
  const [deviceForm, setDeviceForm] = useState({ name: "", type: "Router", ip: "", location: "" });
  const [checks, setChecks] = useState({ ICMP: true, SNMP: true, TCP: true });

  const addDevice = (event: FormEvent) => {
    event.preventDefault();
    setDevices((current) => [...current, [deviceForm.name.trim(), deviceForm.type, deviceForm.ip.trim(), deviceForm.location.trim()]]);
    setDeviceForm({ name: "", type: "Router", ip: "", location: "" });
    setNotice("Device added to this prototype's sample inventory.");
  };

  return <>
    <PageHeader eyebrow="Administration" title="Monitoring setup" description="Configure the sample device inventory, checks, alert thresholds and escalation behavior."/>
    <div className="inline-note"><Icon name="info" size={16}/><span>Prototype only: saving these values changes this screen's in-memory sample state. No devices are polled and no alerts are sent.</span></div>
    <section className="card detail-card monitoring-config">
      <div className="card-head"><div><h2>Monitoring policy</h2><p>Sample settings for the campus monitoring workflow</p></div></div>
      <div className="form-grid">
        <label>Polling interval (seconds)<input type="number" min="10" value={pollInterval} onChange={(event) => setPollInterval(event.target.value)}/></label>
        <label>Latency warning threshold (ms)<input type="number" min="1" value={latencyThreshold} onChange={(event) => setLatencyThreshold(event.target.value)}/></label>
        <label>Packet loss threshold (%)<input type="number" min="1" max="100" value={packetLossThreshold} onChange={(event) => setPacketLossThreshold(event.target.value)}/></label>
        <label>Escalate to secondary contact after (minutes)<input type="number" min="1" value={escalationMinutes} onChange={(event) => setEscalationMinutes(event.target.value)}/></label>
        <label className="check-label full"><input type="checkbox" checked={deduplicate} onChange={(event) => setDeduplicate(event.target.checked)}/> Suppress duplicate alerts while an incident is active</label>
        <label>Detection rule<input value="ICMP failed for 2 consecutive polls" readOnly/></label>
      </div>
      <div className="check-row monitoring-checks"><span><Icon name="activity"/><b>Checks to run</b></span>{(["ICMP", "SNMP", "TCP"] as const).map((check) => <label className="check-label" key={check}><input type="checkbox" checked={checks[check]} onChange={(event) => setChecks((current) => ({ ...current, [check]: event.target.checked }))}/>{check}</label>)}</div>
      <div className="schedule-actions"><Button onClick={() => setNotice("Monitoring policy saved in this screen's sample state; it is not persisted beyond the current view.")}>Save monitoring policy</Button></div>
    </section>
    <section className="card table-card monitoring-inventory">
      <div className="card-head"><div><h2>Registered devices</h2><p>{devices.length} sample devices in the inventory</p></div></div>
      <div className="table-scroll"><table><thead><tr><th>Device</th><th>Type</th><th>IP address</th><th>Location</th><th>Checks</th></tr></thead><tbody>{devices.map((device) => <tr key={device[0]}><td><strong>{device[0]}</strong></td><td>{device[1]}</td><td>{device[2]}</td><td>{device[3]}</td><td>{Object.entries(checks).filter(([, enabled]) => enabled).map(([name]) => name).join(", ") || "None selected"}</td></tr>)}</tbody></table></div>
      <form className="add-device-form" onSubmit={addDevice}>
        <div className="card-head"><div><h2>Register a device</h2><p>Add sample inventory details for a router, switch, access point or server.</p></div></div>
        <div className="form-grid">
          <label>Device name<input required value={deviceForm.name} onChange={(event) => setDeviceForm({ ...deviceForm, name: event.target.value })} placeholder="e.g. CICT-LAB1-AP-01"/></label>
          <label>Device type<select value={deviceForm.type} onChange={(event) => setDeviceForm({ ...deviceForm, type: event.target.value })}><option>Router</option><option>Switch</option><option>Access point</option><option>Server</option></select></label>
          <label>IP address<input required type="text" pattern="(?:[0-9]{1,3}\.){3}[0-9]{1,3}" value={deviceForm.ip} onChange={(event) => setDeviceForm({ ...deviceForm, ip: event.target.value })} placeholder="10.20.1.10"/></label>
          <label>Location<input required value={deviceForm.location} onChange={(event) => setDeviceForm({ ...deviceForm, location: event.target.value })} placeholder="Building / room"/></label>
        </div>
        <div className="schedule-actions"><Button type="submit" icon="plus">Add to sample inventory</Button></div>
      </form>
      {notice && <div className="inline-note" role="status"><Icon name="check" size={16}/><span>{notice} Polling {pollInterval}s · latency {latencyThreshold}ms · packet loss {packetLossThreshold}% · escalation {escalationMinutes}m · deduplication {deduplicate ? "on" : "off"}.</span></div>}
    </section>
  </>;
}

type DeviceRecord = { name: string; type: string; location: string; status: "Up" | "Degraded" | "Down"; latency: string; uptime: string; ip: string };

const sampleDevices: DeviceRecord[] = [
  { name: "CICT-CORE-RTR-01", type: "Router", location: "Server Room", status: "Up", latency: "2 ms", uptime: "99.99%", ip: "10.20.0.1" },
  { name: "CICT-F1-SW-01", type: "Switch", location: "1st Floor", status: "Up", latency: "8 ms", uptime: "99.91%", ip: "10.20.1.2" },
  { name: "CICT-LAB2-SW-01", type: "Switch", location: "Laboratory 2 · 2F", status: "Down", latency: "No response", uptime: "99.72%", ip: "10.20.2.11" },
  { name: "CICT-LAB3-SW-02", type: "Switch", location: "Laboratory 3 · 2F", status: "Degraded", latency: "26 ms", uptime: "99.45%", ip: "10.20.3.12" },
  { name: "CICT-FAC-AP-03", type: "Access point", location: "Faculty Room · 3F", status: "Down", latency: "No response", uptime: "98.84%", ip: "10.20.3.31" },
  { name: "CICT-LAB3-AP-06", type: "Access point", location: "Laboratory 3 · 2F", status: "Degraded", latency: "31 ms", uptime: "99.11%", ip: "10.20.3.36" },
  { name: "CICT-F2-SW-02", type: "Switch", location: "2nd Floor", status: "Degraded", latency: "19 ms", uptime: "99.28%", ip: "10.20.2.22" },
  { name: "CICT-SRV-01", type: "Server", location: "Server Room", status: "Up", latency: "4 ms", uptime: "99.98%", ip: "10.20.0.20" },
];

function Devices({ role, go }: { role: Role; go: (s: Screen) => void }) {
  const [rows, setRows] = useState(sampleDevices);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Switch", ip: "", location: "", polling: "60", primary: "Maria Santos", secondary: "Paolo Cruz", checks: { ICMP: true, SNMP: true, TCP: true } });
  const visible = rows.filter((row) => `${row.name} ${row.type} ${row.location}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || row.status === status));
  const save = (event: FormEvent) => {
    event.preventDefault();
    setRows((current) => [...current, { name: form.name, type: form.type, ip: form.ip, location: form.location, status: "Up", latency: "14 ms", uptime: "100.00%" }]);
    setAdding(false);
    setForm({ name: "", type: "Switch", ip: "", location: "", polling: "60", primary: "Maria Santos", secondary: "Paolo Cruz", checks: { ICMP: true, SNMP: true, TCP: true } });
  };
  return <>
    <PageHeader eyebrow="Inventory" title="Devices" description="Search the sample campus inventory and inspect device health." actions={role === "Admin" ? <Button icon="plus" onClick={() => setAdding(true)}>Add device</Button> : undefined}/>
    <div className="filter-bar"><div className="search-field"><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search devices, types or locations"/></div><label><Icon name="filter"/><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Up</option><option>Degraded</option><option>Down</option></select></label></div>
    <article className="card table-card"><div className="table-meta"><span><strong>{visible.length} devices</strong> shown</span><small>Sample inventory · 48 total devices</small></div><div className="table-scroll"><table><thead><tr><th>Device</th><th>Type</th><th>Location</th><th>Status</th><th>Latency</th><th>30-day uptime</th><th/></tr></thead><tbody>{visible.map((row) => <tr key={row.name} onClick={() => go("device")}><td><strong>{row.name}</strong><small>{row.ip}</small></td><td>{row.type}</td><td>{row.location}</td><td><Status type={row.status === "Up" ? "up" : row.status === "Down" ? "down" : "degraded"}>{row.status}</Status></td><td>{row.latency}</td><td>{row.uptime}</td><td><Icon name="arrow"/></td></tr>)}</tbody></table></div></article>
    {adding && <div className="modal-layer"><form className="modal-card user-modal" onSubmit={save}><button type="button" className="modal-close" onClick={() => setAdding(false)}><Icon name="close"/></button><span className="overline blue">Inventory · sample data only</span><h2>Add device</h2><p>Add a monitored device to this prototype's in-memory sample inventory.</p><div className="form-grid"><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></label><label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Router</option><option>Switch</option><option>Access point</option><option>Server</option></select></label><label>IP address<input required value={form.ip} onChange={(event) => setForm({ ...form, ip: event.target.value })}/></label><label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}/></label><label>Polling interval (seconds)<input type="number" min="10" value={form.polling} onChange={(event) => setForm({ ...form, polling: event.target.value })}/></label><label>Primary contact<input value={form.primary} onChange={(event) => setForm({ ...form, primary: event.target.value })}/></label><label>Secondary contact<input value={form.secondary} onChange={(event) => setForm({ ...form, secondary: event.target.value })}/></label></div><div className="check-row monitoring-checks"><b>Checks</b>{(["ICMP", "SNMP", "TCP"] as const).map((check) => <label className="check-label" key={check}><input type="checkbox" checked={form.checks[check]} onChange={(event) => setForm({ ...form, checks: { ...form.checks, [check]: event.target.checked } })}/>{check}</label>)}</div><div className="modal-actions"><Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Save device</Button></div></form></div>}
  </>;
}

function MiniChart({ type = "latency" }: { type?: "latency" | "loss" }) {
  return <div className="chart-wrap">
    <div className="chart-y"><span>{type === "latency" ? "80 ms" : "12%"}</span><span>{type === "latency" ? "40 ms" : "6%"}</span><span>0</span></div>
    <svg viewBox="0 0 600 170" preserveAspectRatio="none" className="line-chart">
      <defs><linearGradient id={`area-${type}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={type === "latency" ? "var(--blue)" : "var(--amber)"} stopOpacity=".2"/><stop offset="100%" stopColor={type === "latency" ? "var(--blue)" : "var(--amber)"} stopOpacity="0"/></linearGradient></defs>
      <path className="gridline" d="M0 20h600M0 80h600M0 140h600"/>
      <path className="threshold" d={type === "latency" ? "M0 64h600" : "M0 72h600"}/>
      <path className="area" fill={`url(#area-${type})`} d={type === "latency" ? "M0 135 C50 130 70 120 105 126 S150 112 190 120 S240 106 275 115 S320 90 355 105 S400 70 435 82 S470 55 505 70 S550 40 600 48 V170H0Z" : "M0 145 C60 142 90 150 130 140 S190 145 225 137 S275 143 310 128 S360 138 400 122 S445 130 475 105 S520 120 550 88 S580 104 600 92 V170H0Z"}/>
      <path className={type === "latency" ? "data-line blue-line" : "data-line amber-line"} d={type === "latency" ? "M0 135 C50 130 70 120 105 126 S150 112 190 120 S240 106 275 115 S320 90 355 105 S400 70 435 82 S470 55 505 70 S550 40 600 48" : "M0 145 C60 142 90 150 130 140 S190 145 225 137 S275 143 310 128 S360 138 400 122 S445 130 475 105 S520 120 550 88 S580 104 600 92"}/>
    </svg>
    <div className="chart-x"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
    <span className="threshold-label">Alert threshold</span>
  </div>;
}

function DeviceDetail({ role, go, openReboot, onDenied }: { role: Role; go: (s: Screen) => void; openReboot: () => void; onDenied: () => void }) {
  const [range, setRange] = useState("24 hours");
  const [latency, setLatency] = useState("60");
  const [loss, setLoss] = useState("6");
  const [notice, setNotice] = useState("");
  const admin = role === "Admin";
  const intern = role === "Intern";
  return <>
    <button className="back-link" onClick={() => go("devices")}>← Devices</button>
    <PageHeader eyebrow="Devices / Device details" title="CICT-LAB2-SW-01" description="Cisco Catalyst 2960-X · Access switch" actions={<>{(admin || intern) && <Button variant="secondary" icon="terminal" visuallyDisabled={intern} onClick={() => intern ? (setNotice("Not allowed for your role. This attempt was logged."), onDenied()) : go("ssh")}>Open SSH</Button>}{(admin || intern) && <Button variant="danger" icon="refresh" visuallyDisabled={intern} onClick={() => intern ? (setNotice("Not allowed for your role. This attempt was logged."), onDenied()) : openReboot()}>Reboot</Button>}</>}/>
    {notice && <div className="permission-banner"><Icon name="lock"/><span>{notice}</span></div>}
    <div className="device-status-strip"><Status type="down">Down</Status><span>Last response <strong>36 minutes ago</strong></span><span>Incident <button className="link-btn" onClick={() => go("incident")}>INC-2026-0418</button></span>{role !== "Admin" && <span className="view-only-note"><Icon name="lock" size={14}/> Read-only view</span>}</div>
    <section className="device-layout">
      <div className="device-main">
        <article className="card detail-card"><div className="card-head"><div><h2>Device information</h2><p>Inventory and monitoring configuration</p></div>{admin && <Button variant="ghost" icon="edit" onClick={() => go("monitoring")}>Edit</Button>}</div>
          <dl className="info-grid"><div><dt>Device type</dt><dd><Icon name="switch"/> Managed switch</dd></div><div><dt>IP address</dt><dd>10.20.2.11</dd></div><div><dt>Location</dt><dd>Laboratory 2 · 2nd Floor</dd></div><div><dt>Model</dt><dd>Cisco Catalyst 2960-X</dd></div><div><dt>Polling interval</dt><dd>60 seconds</dd></div><div><dt>Checks</dt><dd>ICMP · SNMP · TCP/22</dd></div><div><dt>Uptime (30 days)</dt><dd>99.72%</dd></div><div><dt>Primary contact</dt><dd>Engr. Maria Santos</dd></div><div><dt>Connected devices</dt><dd>CICT-LAB2-AP-04 · 25 clients</dd></div></dl>
        </article>
        <article className="card chart-card"><div className="card-head"><div><h2>Latency · {range}</h2><p>ICMP response time · alert threshold {latency} ms</p></div><strong className="metric">54 <small>ms avg</small></strong></div><MiniChart/><div className="chart-legend"><span><i className="line blue"/>Latency</span><span><i className="line dashed"/>{latency} ms threshold</span></div></article>
        <article className="card chart-card"><div className="card-head"><div><h2>Packet loss · {range}</h2><p>Percentage of packets lost · alert threshold {loss}%</p></div><strong className="metric amber-text">8.4 <small>% avg</small></strong></div><MiniChart type="loss"/><div className="chart-legend"><span><i className="line amber"/>Packet loss</span><span><i className="line dashed"/>{loss}% threshold</span></div></article>
        <article className="card detail-card"><div className="card-head"><div><h2>Threshold settings</h2><p>Changes apply to sample monitoring only.</p></div></div><div className="form-grid threshold-form"><label>Latency threshold (ms)<input type="number" value={latency} disabled={!admin} onChange={(event) => setLatency(event.target.value)}/></label><label>Packet loss threshold (%)<input type="number" value={loss} disabled={!admin} onChange={(event) => setLoss(event.target.value)}/></label>{admin && <div className="schedule-actions"><Button onClick={() => setNotice("Threshold settings saved in sample state.")}>Save thresholds</Button></div>}</div></article>
      </div>
      <aside className="device-aside">
        <article className="card detail-card"><div className="card-head"><div><h2>Availability</h2><p>Sample uptime and availability</p></div></div><div className="range-tabs">{["24 hours", "7 days", "30 days"].map((item) => <Button key={item} variant={range === item ? "primary" : "ghost"} onClick={() => setRange(item)}>{item}</Button>)}</div><div className="availability-stat"><strong>{range === "24 hours" ? "0.0%" : range === "7 days" ? "98.8%" : "99.72%"}</strong><span>availability</span></div></article>
        <article className="card checks-card"><div className="card-head"><div><h2>Health checks</h2><p>Current polling results</p></div></div>{[["ICMP", "No response", "down"],["SNMP", "Timeout", "down"],["TCP · Port 22", "Unreachable", "down"]].map((c) => <div className="check-row" key={c[0]}><span><Icon name="activity"/><b>{c[0]}</b></span><Status type={c[2] as "down"}>{c[1]}</Status></div>)}</article>
        <article className="card contacts-card"><div className="card-head"><div><h2>Escalation contacts</h2></div></div><div><Avatar name="Maria Santos"/><span><strong>Engr. Maria Santos</strong><small>Network Administrator · Primary</small><a href="mailto:msantos@bulsu.edu.ph">msantos@bulsu.edu.ph</a></span></div><div><Avatar name="Paolo Cruz"/><span><strong>Paolo Cruz</strong><small>CICT Staff · Secondary</small><a href="mailto:pcruz@bulsu.edu.ph">pcruz@bulsu.edu.ph</a></span></div></article>
      </aside>
    </section>
  </>;
}

function RebootModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [phase, setPhase] = useState<"confirm" | "rebooting" | "checking" | "result">("confirm");
  const confirm = () => {
    onConfirm(reason.trim());
    setPhase("rebooting");
    window.setTimeout(() => setPhase("checking"), 900);
    window.setTimeout(() => setPhase("result"), 1800);
  };
  return <div className="modal-layer"><div className="modal-card">
    {phase === "confirm" ? <><div className="modal-icon danger"><Icon name="refresh" size={24}/></div><button className="modal-close" onClick={onClose}><Icon name="close"/></button><span className="overline red">Remote remediation · simulation</span><h2>Reboot CICT-LAB2-SW-01?</h2><p>A live reboot will interrupt network service for CICT-LAB2-AP-04 and about 25 clients in Laboratory 2.</p>
      <div className="impact-box"><strong><Icon name="warning"/> Service interruption</strong><p>CICT-LAB2-AP-04 and about 25 clients in Laboratory 2</p></div>
      <label>Reason for reboot <span>Required</span><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe why this action is necessary…"/></label>
      <div className="modal-actions"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" icon="refresh" disabled={!reason.trim()} onClick={confirm}>Confirm</Button></div></> : phase === "rebooting" ? <><div className="modal-icon danger"><Icon name="refresh" size={24}/></div><h2>Rebooting…</h2><p>CICT-LAB2-SW-01 is restarting in this sample workflow.</p></> : phase === "checking" ? <><div className="modal-icon"><Icon name="activity" size={24}/></div><h2>Running health check…</h2><p>Checking ICMP, SNMP, and TCP/22 responses.</p></> : <><div className="modal-icon danger"><Icon name="down" size={27}/></div><span className="overline red">Simulated post-reboot health check</span><h2>Still unreachable</h2><p>Health check 09:06: no response. The device remains Down.</p><div className="modal-actions"><Button onClick={onClose}>Return to device</Button></div></>}
  </div></div>;
}

function SSH({ go, onStart, onEnd }: { go: (s: Screen) => void; onStart: () => void; onEnd: () => void }) {
  useEffect(() => { onStart(); }, []);
  return <>
    <button className="back-link" onClick={() => go("device")}>← CICT-LAB2-SW-01</button>
    <PageHeader eyebrow="Remote session" title="Browser SSH terminal" description="Secure diagnostic access to CICT-LAB2-SW-01." actions={<Button variant="danger" icon="close" onClick={() => { onEnd(); go("device"); }}>End session</Button>}/>
    <div className="terminal-shell"><div className="terminal-bar"><span className="terminal-dots"><i/><i/><i/></span><strong>admin@CICT-LAB2-SW-01</strong><span><Icon name="clock" size={15}/> Idle timeout 09:42</span></div><div className="recording-banner"><span/><strong>Sample SSH session · no live connection</strong><small>Commands and output are illustrative only</small></div><pre>{`Connected to 10.20.2.11
Cisco IOS Software, C2960X Software (C2960X-UNIVERSALK9-M)

CICT-LAB2-SW-01# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed
Gi1/0/1   UPLINK-CORE        connected    trunk      a-full  a-1000
Gi1/0/2   LAB2-AP-04         connected    220        a-full  a-1000
Gi1/0/3   LAB2-PC-01         connected    221        a-full  a-100
Gi1/0/4   LAB2-PC-02         notconnect   221        auto    auto

CICT-LAB2-SW-01# show processes cpu sorted | include five
CPU utilization for five seconds: 18%/4%; one minute: 16%; five minutes: 14%

CICT-LAB2-SW-01# ping 10.20.0.1 repeat 5
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms

CICT-LAB2-SW-01# `}<span className="cursor">█</span></pre></div>
    <div className="terminal-note"><Icon name="info"/><span>Session is recorded and closes after 10 minutes idle</span></div>
  </>;
}

const historyRows = [
  ["INC-2026-0419", "CICT-LAB3-SW-02", "Laboratory 3", "Latency drifting above baseline", "Early warning", "Oct 22, 07:30", "—", "—"],
  ["INC-2026-0418", "CICT-LAB2-SW-01", "Laboratory 2", "Device unreachable", "Active", "Oct 22, 08:42", "Oct 22, 08:49", "—"],
  ["INC-2026-0417", "CICT-FAC-AP-03", "Faculty Room", "No response", "Active", "Oct 22, 08:16", "—", "—"],
  ["INC-2026-0416", "CICT-LAB3-AP-06", "Laboratory 3", "High packet loss", "Monitoring", "Oct 22, 07:58", "Oct 22, 08:01", "—"],
  ["INC-2026-0415", "CICT-CORE-RTR-01", "Server Room", "CPU threshold", "Resolved", "Oct 21, 16:12", "Oct 21, 16:14", "Oct 21, 16:38"],
  ["INC-2026-0414", "CICT-SRV-01", "Server Room", "TCP check failed", "Resolved", "Oct 21, 11:03", "Oct 21, 11:18", "Oct 21, 11:31"],
  ["INC-2026-0413", "CICT-F2-SW-02", "2nd Floor", "SNMP timeout", "Resolved", "Oct 20, 14:25", "Oct 20, 14:29", "Oct 20, 14:44"],
];

function History({ go, openIncident }: { go: (s: Screen) => void; openIncident: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [period, setPeriod] = useState("Last 30 days");
  const visibleRows = historyRows.filter((row) => {
    const matchesQuery = row.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All statuses" || row[4] === status;
    return matchesQuery && matchesStatus;
  });
  return <>
    <PageHeader eyebrow="Operations" title="Incident history" description="Search and review response timelines across the campus network." actions={<Button variant="secondary" icon="download" onClick={() => downloadCsv("netknowing-incidents.csv", [["Incident", "Device", "Location", "Issue", "Status", "Detected", "Acknowledged", "Resolved"], ...visibleRows])}>Export CSV</Button>}/>
    <div className="filter-bar"><div className="search-field"><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search device, location or keyword"/></div><label><Icon name="filter"/><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Early warning</option><option>Monitoring</option><option>Resolved</option></select></label><label><Icon name="calendar"/><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select></label><Button variant="ghost" onClick={() => { setQuery(""); setStatus("All statuses"); setPeriod("Last 30 days"); }}>Clear filters</Button></div>
    <article className="card table-card"><div className="table-meta"><span><strong>{visibleRows.length} incidents</strong> found · {period}</span><small>Showing {visibleRows.length ? 1 : 0}–{visibleRows.length} of {visibleRows.length}</small></div><div className="table-scroll"><table><thead><tr><th>Incident</th><th>Device / location</th><th>Issue</th><th>Status</th><th>Detected</th><th>Acknowledged</th><th>Resolved</th><th/></tr></thead><tbody>{visibleRows.map((r) => <tr key={r[0]} onClick={() => openIncident(r[1])}><td><strong className="blue-text">{r[0]}</strong>{r[4] === "Early warning" && <small className="ai-text">AI</small>}</td><td><strong>{r[1]}</strong><small>{r[2]}</small></td><td>{r[3]}</td><td><Status type={r[4] === "Resolved" ? "up" : r[4] === "Active" ? "down" : r[4] === "Early warning" ? "ai" : "degraded"}>{r[4]}</Status></td><td>{r[5]}</td><td>{r[6]}</td><td>{r[7]}</td><td><Icon name="arrow"/></td></tr>)}</tbody></table>{visibleRows.length === 0 && <p className="empty-message">No incidents match these filters.</p>}</div></article>
  </>;
}

function Reports() {
  const [period, setPeriod] = useState("30");
  const [notice, setNotice] = useState("");
  const devices = [["CICT-FAC-AP-03", 12, 88],["CICT-LAB2-SW-01", 9, 68],["CICT-LAB3-AP-06", 7, 53],["CICT-F2-SW-02", 5, 38],["CICT-SRV-01", 3, 23]];
  const rangeLabel = period === "7" ? "Last 7 days" : period === "90" ? "Last 90 days" : "Last 30 days";
  const metrics = period === "7"
    ? [["Availability", "99.67%", "+0.21% vs prior period"], ["Incident count", "28", "-5 from prior period"], ["Mean time to detect", "1m 12s", "Average, 60-second polling"], ["Mean time to resolve", "22m", "3m faster than prior period"]]
    : period === "90"
      ? [["Availability", "99.31%", "+0.12% vs prior period"], ["Incident count", "392", "-31 from prior period"], ["Mean time to detect", "1m 31s", "Average, 60-second polling"], ["Mean time to resolve", "28m", "2m faster than prior period"]]
      : [["Availability", "99.42%", "+0.18% vs prior period"], ["Incident count", "127", "-14 from prior period"], ["Mean time to detect", "1m 24s", "Average, 60-second polling"], ["Mean time to resolve", "26m", "4m faster than last month"]];
  const periodDevices = devices.map(([name, incidents, width]) => {
    const count = period === "7" ? Math.max(1, Math.round(incidents * 0.23)) : period === "90" ? incidents * 3 : incidents;
    return [name, count, width] as [string, number, number];
  });
  return <>
    <PageHeader eyebrow="Performance" title="Reports & analytics" description={`Reliability trends and operational performance · Sep 23 – Oct 22 · ${rangeLabel.toLowerCase()}.`} actions={<><label className="report-period">Reporting period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label><Button icon="download" onClick={() => downloadCsv("netknowing-report.csv", [["Metric", "Value", "Period"], ...metrics.map(([label, value]) => [label, value, rangeLabel]), ...periodDevices.map((device) => [`Incidents: ${device[0]}`, String(device[1]), rangeLabel])])}>Export report</Button></>}/>
    <section className="metric-grid"><SummaryCard icon="check" label={`${period}-day availability`} value={metrics[0][1]} detail={metrics[0][2]} tone="green"/><SummaryCard icon="warning" label="Incident count" value={metrics[1][1]} detail={metrics[1][2]} tone="blue"/><SummaryCard icon="clock" label="Mean time to detect" value={metrics[2][1]} detail={metrics[2][2]} tone="purple"/><SummaryCard icon="refresh" label="Mean time to resolve" value={metrics[3][1]} detail={metrics[3][2]} tone="amber"/></section>
    <section className="reports-grid"><article className="card failure-card"><div className="card-head"><div><h2>Most frequently failing devices</h2><p>Incidents recorded in the selected period</p></div><button className="link-btn" onClick={() => setNotice("Showing the ranked sample devices for " + rangeLabel + ".")}>View details</button></div><div className="bar-list">{periodDevices.map((d, i) => <div className="bar-row" key={d[0]}><span className="rank">{i + 1}</span><div><span><strong>{d[0]}</strong><b>{d[1]} incidents</b></span><i><em style={{ width: `${d[2]}%` }}/></i></div></div>)}</div></article>
    <article className="card schedule-card"><div className="card-head"><div><h2>Scheduled reports</h2><p>Recurring operational summaries</p></div><Button variant="ghost" icon="plus" onClick={() => setNotice("Daily, weekly and monthly schedules are sample entries; scheduling requires a connected backend.")}>Schedule</Button></div>{[["Daily health summary", "Every day · 7:00 AM", "Daily"],["Weekly availability", "Every Monday · 8:00 AM", "Weekly"],["Monthly management report", "1st day · 9:00 AM", "Monthly"]].map((x) => <div className="schedule-row" key={x[0]}><span className="schedule-icon"><Icon name="calendar"/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><Status type="neutral">{x[2]}</Status><button className="icon-btn" title={`Download ${x[0]}`} onClick={() => downloadCsv("netknowing-scheduled-report.csv", [["Report", "Schedule", "Period"], [x[0], x[1], rangeLabel]])}><Icon name="download"/></button></div>)}<div className="schedule-actions"><Button variant="secondary" icon="download" onClick={() => downloadCsv("netknowing-latest-report.csv", [["Report", "Generated for"], ["Latest operational summary", rangeLabel]])}>Download latest</Button><Button icon="chart" onClick={() => { downloadCsv("netknowing-generated-report.csv", [["Report", "Period"], ["Generated operational report", rangeLabel]]); setNotice("Sample report generated and downloaded."); }}>Generate report</Button></div></article></section>
    {notice && <div className="inline-note" role="status"><Icon name="info" size={16}/><span>{notice}</span></div>}
  </>;
}

const users = [
  ["Maria Santos", "Administrator", "Enabled", "Today, 08:11", "Active", "—"],
  ["Paolo Cruz", "CICT Staff", "Enabled", "Today, 07:54", "Active", "—"],
  ["Dr. Elena Reyes", "Director", "Enabled", "Yesterday, 16:20", "Active", "—", "dr.elena.reyes@bulsu.edu.ph"],
  ["Luis Garcia", "IT Helpdesk", "Not enabled", "May 20, 10:14", "Active", "—"],
  ["Ana Mendoza", "Auditor", "Enabled", "May 18, 09:40", "Active", "—"],
  ["Jonas Ramos", "Intern", "Not enabled", "Today, 08:30", "Active", "Dec 18, 2026"],
];

function Users() {
  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);
  const [userRows, setUserRows] = useState(users);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", role: "Staff", status: "Active", expiry: "", twoFactor: false });
  const openAdd = () => {
    setForm({ name: "", email: "", role: "Staff", status: "Active", expiry: "", twoFactor: false });
    setDialog("add");
  };
  const openEdit = (index: number) => {
    const user = userRows[index];
    setSelectedIndex(index);
    setForm({ name: user[0], email: user[6] ?? `${user[0].toLowerCase().replaceAll(" ", ".")}@bulsu.edu.ph`, role: user[1] === "Administrator" ? "Admin" : roles.find((role) => role.label === user[1])?.id ?? "Staff", status: user[4], expiry: "", twoFactor: user[2] === "Enabled" });
    setDialog("edit");
  };
  const saveUser = (event: FormEvent) => {
    event.preventDefault();
    const record = [form.name, roles.find((role) => role.id === form.role)?.label ?? form.role, form.twoFactor ? "Enabled" : "Not enabled", dialog === "edit" ? userRows[selectedIndex][3] : "Just now", form.status, form.expiry || (dialog === "edit" ? userRows[selectedIndex][5] : "—"), form.email];
    setUserRows((current) => dialog === "add" ? [...current, record] : current.map((user, index) => index === selectedIndex ? record : user));
    setDialog(null);
  };
  return <>
    <PageHeader eyebrow="Administration" title="User & role management" description="Manage account access, roles and authentication settings." actions={<Button icon="plus" onClick={openAdd}>Add user</Button>}/>
    <div className="admin-stats"><span><strong>{userRows.filter((user) => user[4] === "Active").length}</strong> Active users</span><span><strong>{userRows.filter((user) => user[2] === "Enabled").length}</strong> 2FA enabled</span><span><strong>{userRows.filter((user) => user[5] !== "—").length}</strong> Expiring accounts</span></div>
    <article className="card table-card"><div className="table-scroll"><table><thead><tr><th>User</th><th>Role</th><th>2FA status</th><th>Last login</th><th>Account status</th><th>Expiry date</th><th/></tr></thead><tbody>{userRows.map((u, index) => <tr key={`${u[0]}-${index}`}><td><div className="user-cell"><Avatar name={u[0]}/><span><strong>{u[0]}</strong><small>{u[6] ?? `${u[0].toLowerCase().replaceAll(" ", ".")}@bulsu.edu.ph`}</small></span></div></td><td>{u[1]}</td><td><Status type={u[2] === "Enabled" ? "up" : "neutral"}>{u[2]}</Status></td><td>{u[3]}</td><td><Status type={u[4] === "Active" ? "up" : "down"}>{u[4]}</Status></td><td>{u[5]}</td><td><button className="icon-btn" aria-label={`Edit ${u[0]}`} onClick={() => openEdit(index)}><Icon name="edit"/></button></td></tr>)}</tbody></table></div></article>
    {dialog && <div className="modal-layer"><form className="modal-card user-modal" onSubmit={saveUser}><button type="button" className="modal-close" onClick={() => setDialog(null)}><Icon name="close"/></button><span className="overline blue">Account access · sample data only</span><h2>{dialog === "add" ? "Add a new user" : "Edit user"}</h2><p>Assign the minimum access required for this user.</p><div className="form-grid"><label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name"/></label><label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@bulsu.edu.ph"/></label><label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label><label>Account status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Active</option><option>Suspended</option></select></label><label className="full">Account expiry <small>Recommended for Intern accounts</small><input type="date" value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })}/></label><label className="check-label full"><input type="checkbox" checked={form.twoFactor} onChange={(event) => setForm({ ...form, twoFactor: event.target.checked })}/> Require two-factor authentication</label></div><div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button type="submit">{dialog === "add" ? "Add user" : "Save changes"}</Button></div></form></div>}
  </>;
}

type AuditRow = [string, string, string, string, string, string];

const initialAuditRows: AuditRow[] = [
  ["09:04:18", "Maria Santos", "Reboot initiated", "CICT-LAB2-SW-01", "success", "Reason: Device unreachable · Completed. Health check 09:06: no response."],
  ["08:49:07", "Maria Santos", "Incident acknowledged", "INC-2026-0418", "success", "Acknowledged at 08:49"],
  ["08:31:42", "Jonas Ramos · Intern", "Reboot attempt denied", "CICT-LAB2-SW-01", "denied", "Not allowed for your role"],
  ["08:17:04", "Paolo Cruz", "Signed in", "Web console · 10.20.8.44", "success", "Sample session"],
  ["Yesterday, 16:38", "Maria Santos", "SSH session started", "CICT-CORE-RTR-01", "success", "Session recorded"],
  ["Yesterday, 16:52", "Maria Santos", "SSH session ended", "CICT-CORE-RTR-01 · 14m 22s", "success", "Session closed"],
  ["Yesterday, 15:10", "Ana Mendoza", "Audit report exported", "Oct 2026 audit trail", "success", "CSV export"],
  ["Oct 20, 11:04", "Unknown user", "Sign-in attempt denied", "Web console · 103.21.4.18", "denied", "Invalid credentials"],
];

function Audit({ rows }: { rows: AuditRow[] }) {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("All actions");
  const filteredRows = rows.filter((row) => {
    const matchesQuery = row.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesAction = action === "All actions" || (action === "Denied attempts" ? row[4] === "denied" : row[2].includes("Reboot") || row[2].includes("SSH"));
    return matchesQuery && matchesAction;
  });
  return <>
    <PageHeader eyebrow="Governance" title="Audit trail" description="Immutable record of access and administrative actions." actions={<Button variant="secondary" icon="download" onClick={() => downloadCsv("netknowing-audit.csv", [["Time", "User", "Action", "Target", "Result", "Details"], ...filteredRows])}>Export audit log</Button>}/>
    <div className="filter-bar"><div className="search-field"><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search user, action or target"/></div><label><Icon name="filter"/><select value={action} onChange={(event) => setAction(event.target.value)}><option>All actions</option><option>Denied attempts</option><option>Remote actions</option></select></label><label><Icon name="calendar"/><select><option>All sample dates</option><option>Today</option><option>Last 7 days</option></select></label></div>
    <article className="card audit-card"><div className="audit-head"><span>Time</span><span>User</span><span>Action</span><span>Target</span><span>Result</span><span>Details</span></div>{filteredRows.map((r) => <div className={`audit-row ${r[4]}`} key={r.join()}><time>{r[0]}</time><div className="user-cell"><Avatar name={r[1]}/><strong>{r[1]}</strong></div><span><i className={`audit-icon ${r[4]}`}><Icon name={r[4] === "denied" ? "shield" : r[2].includes("SSH") ? "terminal" : r[2].includes("Reboot") ? "refresh" : "check"}/></i>{r[2]}</span><span>{r[3]}</span><Status type={r[4] === "denied" ? "down" : "up"}>{r[4] === "denied" ? "Denied" : "Completed"}</Status><span>{r[5]}</span></div>)}{filteredRows.length === 0 && <p className="empty-message">No audit events match these filters.</p>}</article>
  </>;
}

function Insights({ role, aiOn, setAiOn }: { role: Role; aiOn: boolean; setAiOn: (value: boolean) => void }) {
  const [falseAlarm, setFalseAlarm] = useState(false);
  return <>
    <PageHeader eyebrow="Assisted monitoring" title="AI insights" description={`${role === "Staff" || role === "Director" ? "Read-only view · " : ""}Pattern-based early warnings and maintenance prioritization.`} actions={role === "Admin" ? <label className="toggle-wrap"><span>AI features</span><button className={`toggle ${aiOn ? "on" : ""}`} onClick={() => setAiOn(!aiOn)}><i/></button><strong>{aiOn ? "On" : "Off"}</strong></label> : <Status type="ai">AI monitoring on</Status>}/>
    <div className="ai-principle"><Icon name="info"/><span>The ranking guides maintenance planning and does not predict when a device will fail. Nothing on this page acts on a device by itself.</span></div>
    {!aiOn ? <><div className="permission-banner"><Icon name="info"/><span>AI features are off. Monitoring, alerts, and remediation continue as normal.</span></div><article className="card empty-state"><span className="summary-icon purple"><Icon name="spark"/></span><h2>AI features are off</h2><p>Early warnings and risk rankings are paused. Standard network monitoring remains active.</p><Button variant="purple" onClick={() => setAiOn(true)}>Turn AI features on</Button></article></> :
    <section className="insights-grid"><article className="card warning-card"><div className="card-head"><div><h2>Early warnings</h2><p>Signals that may need closer observation</p></div><Status type="ai">1 active</Status></div><div className={`warning-item ${falseAlarm ? "muted" : ""}`}><div className="warning-title"><span className="summary-icon purple"><Icon name="spark"/></span><div><span>{falseAlarm ? "Marked false alarm" : "Latency above learned baseline"}</span><h3>CICT-LAB3-SW-02</h3><p>Latency has gradually increased by 31% over the last 2 hours. Current performance remains below the configured alert threshold.</p></div></div><div className="confidence"><span>Confidence</span><strong>Medium · 68%</strong><i><em/></i></div><div className="warning-details"><span><small>Baseline</small><strong>12–18 ms</strong></span><span><small>Current</small><strong>26 ms</strong></span><span><small>First observed</small><strong>1h 48m ago</strong></span></div><div className="warning-actions"><Button variant="secondary" icon="chart">View supporting chart</Button>{role === "Admin" && <Button variant="ghost" icon={falseAlarm ? "check" : "close"} onClick={() => setFalseAlarm(true)} disabled={falseAlarm}>{falseAlarm ? "Marked false alarm" : "Mark as false alarm"}</Button>}</div></div><div className="ai-explainer"><Icon name="spark"/><span><strong>Why this appeared</strong>Netknowing compares recent performance with this device's own historical behavior. It does not issue device commands.</span></div></article>
    <article className="card risk-card"><div className="card-head"><div><h2>Failure-risk ranking</h2><p>Maintenance planning priority</p></div><button className="link-btn">How this works</button></div>{[["CICT-FAC-AP-03","High","Recurring disconnects · 12 incidents","down",86],["CICT-LAB2-SW-01","High","Packet loss and SNMP timeouts","down",78],["CICT-LAB3-SW-02","Medium","Latency drifting above baseline","degraded",61],["CICT-LAB3-AP-06","Medium","Rising retransmission rate","degraded",54],["CICT-F2-SW-02","Medium","Power-cycle frequency","degraded",48],["CICT-SRV-01","Low","Stable recent performance","up",24]].map((r, i) => <div className="risk-row" key={r[0]}><b>{i + 1}</b><span><strong>{r[0]}</strong><small>{r[2]}</small><i><em className={r[3]} style={{width:`${r[4]}%`}}/></i></span><Status type={r[3] as "up"|"down"|"degraded"}>{r[1]}</Status></div>)}</article></section>}
  </>;
}

function Incident({ role, incident, aiOn, go }: { role: Role; incident: string; aiOn: boolean; go: (s: Screen) => void }) {
  const [ack, setAck] = useState(false);
  const isFac = incident === "CICT-FAC-AP-03";
  const acknowledged = !isFac || ack;
  const [review, setReview] = useState<"draft"|"editing"|"approved"|"edited"|"rejected">("draft");
  const [draftText, setDraftText] = useState("CICT-LAB2-SW-01 stopped responding to ICMP, SNMP and TCP health checks at 08:42 AM, interrupting connectivity for Laboratory 2.");
  const canAct = role === "Admin";
  return <>
    <button className="back-link">← Active incidents</button>
    <PageHeader eyebrow={isFac ? "INC-2026-0417 · Active incident" : "INC-2026-0418 · Active incident"} title={isFac ? "CICT-FAC-AP-03 unreachable" : "CICT-LAB2-SW-01 unreachable"} description={`${role === "Staff" || role === "Director" ? "Read-only view · " : ""}${isFac ? "Faculty Room · Detected today at 08:16 AM" : "Laboratory 2 · Detected today at 08:42 AM"}`} actions={<><Button variant="secondary" icon="router" onClick={() => go("device")}>Open device</Button>{acknowledged ? <Status type="neutral">Acknowledged by Maria Santos{isFac ? "" : " · 08:49"}</Status> : canAct ? <Button variant="primary" icon="check" onClick={() => setAck(true)}>Acknowledge incident</Button> : <Status type="down">Unacknowledged</Status>}</>}/>
    <section className="incident-page-grid"><div>
      <article className="card incident-detail-card"><div className="card-head"><div><h2>Incident details</h2><p>Current state and impact</p></div><Status type="down">Critical</Status></div><dl className="incident-facts"><div><dt>Started</dt><dd>October 22, 2026 · {isFac ? "08:16" : "08:42"} AM</dd></div><div><dt>Duration</dt><dd>{isFac && !ack ? "04:12" : "36 minutes"}</dd></div><div><dt>Affected services</dt><dd>{isFac ? "Faculty Room network · 18 clients" : "Laboratory 2 network · 25 clients"}</dd></div><div><dt>Triggered checks</dt><dd>ICMP, SNMP, TCP/22</dd></div></dl></article>
      <article className="card timeline-card"><div className="card-head"><div><h2>Response timeline</h2><p>Notification and escalation sequence</p></div></div><div className="timeline"><div className="done"><i><Icon name="down"/></i><span><strong>Incident detected</strong><small>{isFac ? "08:16 AM" : "08:42 AM"} · ICMP failed for 2 consecutive polls</small></span><time>00:00</time></div><div className="done"><i><Icon name="bell"/></i><span><strong>Alert sent by email and in-app</strong><small>Primary contact: Engr. Maria Santos</small></span><time>00:01</time></div><div className={acknowledged ? "done" : "current"}><i><Icon name={acknowledged ? "check" : "clock"}/></i><span><strong>{acknowledged ? "Acknowledged by Maria Santos" : "Awaiting acknowledgement"}</strong><small>{acknowledged ? (isFac ? "08:49 AM · Investigation started" : "08:49 AM · Investigation started") : "Secondary contact escalation in 04:12"}</small></span><time>{acknowledged ? "00:07" : "—"}</time></div><div><i><Icon name="check"/></i><span><strong>Resolved</strong><small>Waiting for device recovery</small></span><time>—</time></div></div></article>
    </div>
    {(aiOn && role !== "Helpdesk" && role !== "Intern") && <article className="card ai-draft-card"><div className="ai-draft-head"><span><Icon name="spark"/>AI-generated draft</span><Status type={review === "rejected" ? "down" : review === "draft" || review === "editing" ? "ai" : "up"}>{review === "draft" || review === "editing" ? "Awaiting review" : review === "rejected" ? "Rejected" : "Approved"}</Status></div><h2>Incident summary</h2><div className="draft-section"><span>What happened</span>{review === "editing" ? <textarea className="draft-editor" value={draftText} onChange={(event) => setDraftText(event.target.value)}/> : <p>{draftText}</p>}</div><div className="draft-section"><span>Likely cause</span><p>Recent packet-loss increases and simultaneous check failures suggest a device power or uplink issue. This is a suggestion, not a confirmed diagnosis.</p></div><div className="draft-section"><span>Suggested checks</span><ul><li>Verify power and UPS status at the 2nd floor cabinet.</li><li>Inspect the uplink to CICT-CORE-RTR-01.</li><li>Review interface errors after connectivity returns.</li></ul></div>
      {review === "draft" && canAct && <div className="draft-actions"><Button variant="purple" icon="check" onClick={() => setReview("approved")}>Approve</Button><Button variant="secondary" icon="edit" onClick={() => setReview("editing")}>Edit</Button><Button variant="ghost" icon="close" onClick={() => setReview("rejected")}>Reject</Button></div>}
      {review === "editing" && canAct && <div className="draft-actions"><Button variant="secondary" onClick={() => { setDraftText("CICT-LAB2-SW-01 stopped responding to ICMP, SNMP and TCP health checks at 08:42 AM, interrupting connectivity for Laboratory 2."); setReview("draft"); }}>Discard edit</Button><Button variant="purple" icon="check" disabled={!draftText.trim()} onClick={() => setReview("edited")}>Save edited summary</Button></div>}
      {["approved", "edited", "rejected"].includes(review) && <div className={`review-result ${review}`}><Icon name={review === "rejected" ? "close" : "check"}/><span><strong>{review === "rejected" ? "Excluded from management reports" : review === "edited" ? "Edited and approved by Maria Santos" : "Approved by Maria Santos"}</strong><small>{review === "rejected" ? "This draft will not appear in generated reports." : "Today at 09:21 AM"}</small></span></div>}
      {!canAct && (review === "draft" || review === "editing") && <div className="review-result"><Icon name="lock"/><span><strong>Administrator review required</strong><small>Your role can view, but cannot approve AI summaries.</small></span></div>}
      <div className="privacy-note"><Icon name="shield"/><span>Credentials and sensitive configuration text were removed before drafting.</span></div></article>}
    </section>
  </>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("Admin");
  const [dark, setDark] = useState(false);
  const [reboot, setReboot] = useState(false);
  const [aiOn, setAiOn] = useState(true);
  const [auditRows, setAuditRows] = useState<AuditRow[]>(initialAuditRows);
  const [incidentTarget, setIncidentTarget] = useState("CICT-LAB2-SW-01");
  const startScreen = useMemo(() => role === "Auditor" ? "audit" : "dashboard", [role]);
  const navigate = (next: Screen) => {
    if (permissions[role].includes(next)) setScreen(next);
  };
  const openIncident = (name: string) => { setIncidentTarget(name); navigate("incident"); };
  const addAudit = (row: AuditRow) => setAuditRows((current) => [row, ...current]);
  const content = screen === "dashboard" ? <Dashboard role={role} go={navigate} openIncident={openIncident}/> :
    screen === "devices" ? <Devices role={role} go={navigate}/> :
    screen === "device" ? <DeviceDetail role={role} go={navigate} openReboot={() => setReboot(true)} onDenied={() => addAudit(["09:18:11", "Jonas Ramos · Intern", "Reboot attempt denied", "CICT-LAB2-SW-01", "denied", "Not allowed for your role"])} /> :
    screen === "ssh" ? <SSH go={navigate} onStart={() => addAudit(["09:17:00", "Maria Santos", "SSH session started", "CICT-LAB2-SW-01", "success", "Session recorded"])} onEnd={() => addAudit(["09:18:00", "Maria Santos", "SSH session ended", "CICT-LAB2-SW-01", "success", "Session closed"])} /> :
    screen === "history" ? <History go={navigate} openIncident={openIncident}/> :
    screen === "reports" ? <Reports/> :
    screen === "users" ? <Users/> :
    screen === "audit" ? <Audit rows={auditRows}/> :
    screen === "insights" ? <Insights role={role} aiOn={aiOn} setAiOn={setAiOn}/> :
    screen === "incident" ? <Incident role={role} incident={incidentTarget} aiOn={aiOn} go={navigate}/> :
    screen === "monitoring" ? <MonitoringSetup/> : null;
  return <div className={dark ? "dark" : ""}>
    {screen === "login" ? <Login role={role} setRole={setRole} onLogin={() => setScreen(startScreen)}/> :
      <AppShell role={role} setRole={setRole} screen={screen} setScreen={setScreen} dark={dark} setDark={setDark} aiOn={aiOn} onLogout={() => setScreen("login")}>{content}</AppShell>}
    {reboot && <RebootModal onClose={() => setReboot(false)} onConfirm={(reason) => addAudit(["09:04:18", "Maria Santos", "Reboot initiated", "CICT-LAB2-SW-01", "success", `Reason: ${reason} · Completed. Health check 09:06: no response.`])}/>} 
  </div>;
}
