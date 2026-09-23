import React from "react";

export default function ComplianceOverview({
  complianceData,
  onNavigate,
}) {
  if (!complianceData) return null;

  const { documents, vehicles, drivers } = complianceData;

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Regulatory Compliance Overview</h3>
          <p className="dsh-card-subtitle">
            Document audit state across vehicles and assigned personnel.
          </p>
        </div>
        <button
          type="button"
          className="dsh-card-action"
          onClick={() => onNavigate && onNavigate("compliance")}
        >
          Compliance Central &rarr;
        </button>
      </div>

      {/* Document Health Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "10px 8px",
            borderRadius: "6px",
            border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ fontSize: "10px", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>
            Valid
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#15803d", marginTop: "2px" }}>
            {documents.valid}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fffbeb",
            padding: "10px 8px",
            borderRadius: "6px",
            border: "1px solid #fde68a",
          }}
        >
          <div style={{ fontSize: "10px", color: "#92400e", fontWeight: 700, textTransform: "uppercase" }}>
            Expiring Soon
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#b45309", marginTop: "2px" }}>
            {documents.expiringSoon}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "10px 8px",
            borderRadius: "6px",
            border: "1px solid #fecaca",
          }}
        >
          <div style={{ fontSize: "10px", color: "#991b1b", fontWeight: 700, textTransform: "uppercase" }}>
            Expired
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#b91c1c", marginTop: "2px" }}>
            {documents.expired}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "10px 8px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "10px", color: "#4b5563", fontWeight: 700, textTransform: "uppercase" }}>
            Missing
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#374151", marginTop: "2px" }}>
            {documents.missing}
          </div>
        </div>
      </div>

      {/* Asset Level Progress Meters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
        {/* Vehicles Meter */}
        <div className="dsh-meter-item">
          <div className="dsh-meter-header">
            <span style={{ fontWeight: 600 }}>Commercial Cab Compliance</span>
            <span style={{ fontWeight: 700, color: vehicles.rate >= 80 ? "#15803d" : "#b91c1c" }}>
              {vehicles.compliant} / {vehicles.total} Compliant ({vehicles.rate}%)
            </span>
          </div>
          <div className="dsh-meter-track">
            <div
              className="dsh-meter-fill"
              style={{
                width: `${vehicles.rate}%`,
                backgroundColor: vehicles.rate >= 80 ? "#10b981" : "#ef4444",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "#6b7280" }}>
            <span>Compliant: {vehicles.compliant}</span>
            <span>Expiring: {vehicles.expiring}</span>
            <span style={{ color: vehicles.nonCompliant > 0 ? "#ef4444" : "#6b7280" }}>
              Non-Compliant: {vehicles.nonCompliant}
            </span>
          </div>
        </div>

        {/* Drivers Meter */}
        <div className="dsh-meter-item">
          <div className="dsh-meter-header">
            <span style={{ fontWeight: 600 }}>Driver License (DL) Compliance</span>
            <span style={{ fontWeight: 700, color: drivers.rate >= 80 ? "#15803d" : "#b91c1c" }}>
              {drivers.compliant} / {drivers.total} Compliant ({drivers.rate}%)
            </span>
          </div>
          <div className="dsh-meter-track">
            <div
              className="dsh-meter-fill"
              style={{
                width: `${drivers.rate}%`,
                backgroundColor: drivers.rate >= 80 ? "#10b981" : "#ef4444",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "#6b7280" }}>
            <span>Compliant: {drivers.compliant}</span>
            <span>Expiring: {drivers.expiring}</span>
            <span style={{ color: drivers.nonCompliant > 0 ? "#ef4444" : "#6b7280" }}>
              Non-Compliant: {drivers.nonCompliant}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
