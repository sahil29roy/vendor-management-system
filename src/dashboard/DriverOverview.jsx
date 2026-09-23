import React from "react";

export default function DriverOverview({
  driverData,
  onNavigate,
}) {
  if (!driverData || driverData.total === 0) {
    return (
      <div className="dsh-card">
        <div className="dsh-card-header">
          <h3 className="dsh-card-title">Driver Workforce Overview</h3>
        </div>
        <div className="dsh-empty-state">
          <p className="dsh-empty-desc">No driver records found in current scope.</p>
        </div>
      </div>
    );
  }

  const { total, active, inactive, availability = [] } = driverData;

  const availColors = {
    Available: "#10b981",
    "On Trip": "#3b82f6",
    "Off Duty": "#f59e0b",
    Unavailable: "#9ca3af",
  };

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Driver Workforce &amp; Availability</h3>
          <p className="dsh-card-subtitle">
            Shift availability and account standing ({total} total personnel).
          </p>
        </div>
        <button
          type="button"
          className="dsh-card-action"
          onClick={() => onNavigate && onNavigate("drivers")}
        >
          Driver Roster &rarr;
        </button>
      </div>

      {/* Account Status vs Shift Availability */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            minWidth: "140px",
            backgroundColor: "#f9fafb",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>
            Account Status
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <span className="dsh-pill-badge dsh-pill-green">Active: {active}</span>
            <span className="dsh-pill-badge dsh-pill-gray">Inactive: {inactive}</span>
          </div>
        </div>
      </div>

      {/* Real-time Shift Availability Breakdown */}
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          Trip &amp; Shift Availability Distribution
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {availability.map((item) => (
            <div key={item.availability} className="dsh-meter-item">
              <div className="dsh-meter-header">
                <span style={{ fontWeight: 500 }}>{item.availability}</span>
                <span style={{ fontWeight: 600 }}>
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="dsh-meter-track">
                <div
                  className="dsh-meter-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: availColors[item.availability] || "#7c3aed",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
