import React from "react";

export default function DriverStatusReport({
  statusData,
  availabilityData = [],
  verificationData = [],
}) {
  if (!statusData) return null;

  const availColors = {
    Available: "#10b981",
    "On Trip": "#3b82f6",
    "Off Duty": "#f59e0b",
    Unavailable: "#9ca3af",
  };

  const verifColors = {
    Verified: "#10b981",
    Pending: "#f59e0b",
    Rejected: "#ef4444",
  };

  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Driver Workforce &amp; Availability Operations</h3>
          <p className="rpt-card-subtitle">
            Driver operational accounts, active trip availability, and verification status.
          </p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>
          {statusData.total} Drivers
        </span>
      </div>

      <div className="rpt-grid-3col">
        {/* Account Status */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "8px" }}>
            Operational Account Status
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#166534" }}>Active Drivers</span>
              <span className="rpt-bar-value">{statusData.active} ({statusData.activePct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${statusData.activePct}%`, backgroundColor: "#10b981" }} />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#6b7280" }}>Inactive Drivers</span>
              <span className="rpt-bar-value">{statusData.inactive} ({statusData.inactivePct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${statusData.inactivePct}%`, backgroundColor: "#9ca3af" }} />
            </div>
          </div>
        </div>

        {/* Real-time Shift Availability */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "8px" }}>
            Trip &amp; Shift Availability
          </div>

          {availabilityData.map((item) => (
            <div key={item.availability} className="rpt-bar-item">
              <div className="rpt-bar-header">
                <span className="rpt-bar-label">{item.availability}</span>
                <span className="rpt-bar-value">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="rpt-bar-track">
                <div
                  className="rpt-bar-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: availColors[item.availability] || "#7c3aed",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Identity Verification */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "8px" }}>
            Onboarding Verification
          </div>

          {verificationData.map((item) => (
            <div key={item.verification} className="rpt-bar-item">
              <div className="rpt-bar-header">
                <span className="rpt-bar-label">{item.verification}</span>
                <span className="rpt-bar-value">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="rpt-bar-track">
                <div
                  className="rpt-bar-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: verifColors[item.verification] || "#7c3aed",
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
