import { useMemo, useState } from "react";

type Role = "Admin" | "Staff" | "Director" | "Helpdesk" | "Auditor" | "Intern";
type Screen = "login" | "dashboard" | "devices" | "history" | "reports" | "audit";

const roles: { id: Role; label: string; short: string }[] = [
  { id: "Admin", label: "Network Administrator", short: "Administrator" },
  { id: "Staff", label: "CICT Staff", short: "Tech Support" },
  { id: "Director", label: "Management Viewer (Dean)", short: "Dean" },
  { id: "Helpdesk", label: "IT Helpdesk", short: "Helpdesk" },
  { id: "Auditor", label: "Auditor", short: "Auditor" },
  { id: "Intern", label: "Intern", short: "Intern" },
];

const permissions: Record<Role, Screen[]> = {
  Admin: ["dashboard", "devices", "history", "reports", "audit"],
  Staff: ["dashboard", "devices", "history", "reports"],
  Director: ["dashboard", "devices", "history", "reports"],
  Helpdesk: ["dashboard", "devices", "history"],
  Auditor: ["history", "reports", "audit"],
  Intern: ["dashboard", "devices"],
};

const screens: Record<Screen, string> = {
  login: "Sign in",
  dashboard: "Network overview",
  devices: "Devices",
  history: "Incident history",
  reports: "Reports & analytics",
  audit: "Audit trail",
};

export default function App() {
  const [role, setRole] = useState<Role>("Admin");
  const [screen, setScreen] = useState<Screen>("dashboard");

  const activeRole = useMemo(
    () => roles.find((item) => item.id === role) ?? roles[0],
    [role],
  );

  const availableScreens = permissions[role];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0b1020 100%)",
      color: "#e2e8f0",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 1100,
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: 20,
        boxShadow: "0 30px 80px rgba(15, 23, 42, 0.55)",
        overflow: "hidden",
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
          background: "rgba(15, 23, 42, 0.94)",
        }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#7dd3fc" }}>
              Netknowing
            </div>
            <strong style={{ fontSize: 22 }}>CICT Network Operations</strong>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1" }}>
            <span>View as</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              style={{
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              {roles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 620 }}>
          <aside style={{
            background: "rgba(15, 23, 42, 0.7)",
            borderRight: "1px solid rgba(148, 163, 184, 0.18)",
            padding: 18,
          }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#94a3b8", marginBottom: 18 }}>
              Workspace
            </div>
            {availableScreens.map((item) => (
              <button
                key={item}
                onClick={() => setScreen(item)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: screen === item ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  border: screen === item ? "1px solid rgba(96, 165, 250, 0.4)" : "1px solid transparent",
                  color: screen === item ? "#f8fafc" : "#cbd5e1",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 8,
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                {screens[item]}
              </button>
            ))}
          </aside>

          <main style={{ padding: 28 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#7dd3fc" }}>
                {activeRole.label}
              </div>
              <h1 style={{ margin: "6px 0 10px", fontSize: 36 }}>{screens[screen]}</h1>
              <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 700 }}>
                Sample campus monitoring dashboard. This build is restored and rendering successfully.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {[
                ["Total devices", "48", "Across 3 network tiers"],
                ["Up", "41", "Healthy status"],
                ["Degraded", "5", "Requires review"],
                ["Down", "2", "Critical intervention"],
              ].map(([label, value, detail]) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: 16,
                    padding: 18,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
                  <small style={{ color: "#cbd5e1" }}>{detail}</small>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 22,
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 16,
              padding: 20,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Status</div>
              <p style={{ margin: 0, color: "#cbd5e1" }}>
                Role: <strong>{activeRole.label}</strong><br />
                Screen: <strong>{screens[screen]}</strong><br />
                App status: <strong style={{ color: "#86efac" }}>Running successfully</strong>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
