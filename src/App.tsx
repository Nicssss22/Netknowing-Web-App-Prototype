import { useMemo, useState } from "react";

type Role =
  | "Network Administrator"
  | "CICT Staff"
  | "Management Viewer (Dean)"
  | "IT Helpdesk"
  | "Auditor"
  | "Intern";

type Screen = "dashboard" | "devices" | "history" | "reports" | "audit";

const roles: { id: Role; label: string; short: string }[] = [
  { id: "Network Administrator", label: "Network Administrator", short: "Administrator" },
  { id: "CICT Staff", label: "CICT Staff", short: "Tech Support" },
  { id: "Management Viewer (Dean)", label: "Management Viewer (Dean)", short: "Dean" },
  { id: "IT Helpdesk", label: "IT Helpdesk", short: "Helpdesk" },
  { id: "Auditor", label: "Auditor", short: "Auditor" },
  { id: "Intern", label: "Intern", short: "Intern" },
];

const permissions: Record<Role, Screen[]> = {
  "Network Administrator": ["dashboard", "devices", "history", "reports", "audit"],
  "CICT Staff": ["dashboard", "devices", "history", "reports"],
  "Management Viewer (Dean)": ["dashboard", "devices", "history", "reports"],
  "IT Helpdesk": ["dashboard", "devices", "history"],
  Auditor: ["history", "reports", "audit"],
  Intern: ["dashboard", "devices"],
};

const screenLabels: Record<Screen, string> = {
  dashboard: "Network overview",
  devices: "Devices",
  history: "Incident history",
  reports: "Reports & analytics",
  audit: "Audit trail",
};

export default function App() {
  const [role, setRole] = useState<Role>("Network Administrator");
  const [screen, setScreen] = useState<Screen>("dashboard");

  const activeRole = useMemo(
    () => roles.find((item) => item.id === role) ?? roles[0],
    [role],
  );

  const availableScreens = permissions[role];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      color: "#0f172a",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: 20,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: 18,
        border: "1px solid #dfe7f2",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          padding: "18px 24px",
          background: "#0f172a",
          color: "#f8fafc",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7dd3fc" }}>
              Netknowing
            </div>
            <strong style={{ fontSize: 22 }}>CICT Network Operations</strong>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
            <span>View as</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              style={{
                background: "#111827",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "8px 10px",
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
            background: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
            padding: 18,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#64748b", marginBottom: 16 }}>
              Workspace
            </div>
            {availableScreens.map((item) => (
              <button
                key={item}
                onClick={() => setScreen(item)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid transparent",
                  borderRadius: 10,
                  background: screen === item ? "#dbeafe" : "transparent",
                  color: screen === item ? "#0f172a" : "#1e293b",
                  padding: "10px 12px",
                  marginBottom: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {screenLabels[item]}
              </button>
            ))}
          </aside>

          <main style={{ padding: 28 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#2563eb", fontWeight: 700 }}>
                {activeRole.label}
              </div>
              <h1 style={{ margin: "8px 0 10px", fontSize: 36, letterSpacing: "-0.04em" }}>
                {screenLabels[screen]}
              </h1>
              <p style={{ margin: 0, color: "#475569", maxWidth: 700 }}>
                Netknowing prototype is loading correctly. This render confirms the app is mounted without a crash.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {[
                ["Total devices", "48", "Across 3 network tiers"],
                ["Up", "41", "Healthy status"],
                ["Degraded", "5", "Needs review"],
                ["Down", "2", "Critical intervention"],
              ].map(([label, value, detail]) => (
                <div key={label} style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 18,
                }}>
                  <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10 }}>{label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em" }}>{value}</div>
                  <small style={{ color: "#475569" }}>{detail}</small>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 24,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 18,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Status</div>
              <div style={{ color: "#334155" }}>
                Role: <strong>{activeRole.label}</strong><br />
                Screen: <strong>{screenLabels[screen]}</strong><br />
                App status: <strong style={{ color: "#16a34a" }}>Running successfully</strong>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
