import React from "react";

export default function FleetStatusReport({ fleetData }) {
  if (!fleetData || fleetData.total === 0) {
    return (
      <div className="rpt-card">
        <h3 className="rpt-card-title">Commercial Fleet Operational Status</h3>
        <div style={{ padding: "30px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
          No vehicle fleet records available.
        </div>
      </div>
    );
  }

  const { total, active, inactive, allowed, blocked, activePct, allowedPct, blockedPct } = fleetData;

  // SVG Donut Calculations for Allowed vs Blocked
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const allowedStroke = (allowedPct / 100) * circumference;
  const blockedStroke = circumference - allowedStroke;

  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Commercial Fleet Operational Status</h3>
          <p className="rpt-card-subtitle">
            Fleet account activation vs regulatory dispatch eligibility.
          </p>
        </div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
          {total} Cabs Total
        </span>
      </div>

      <div className="rpt-donut-container">
        {/* Native SVG Donut Chart */}
        <div style={{ position: "relative", width: "110px", height: "110px" }}>
          <svg className="rpt-donut-svg" width="110" height="110" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth="14"
            />
            {/* Allowed portion */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="14"
              strokeDasharray={`${allowedStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Blocked portion */}
            {blocked > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="14"
                strokeDasharray={`${blockedStroke} ${circumference}`}
                strokeDashoffset={`-${allowedStroke}`}
              />
            )}
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
              {allowedPct}%
            </span>
            <span style={{ fontSize: "9px", color: "#6b7280", textTransform: "uppercase" }}>
              Eligible
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="rpt-donut-legend">
          <div className="rpt-legend-item">
            <span className="rpt-legend-dot" style={{ backgroundColor: "#10b981" }} />
            <div>
              <strong>Dispatch Allowed:</strong> {allowed} cabs ({allowedPct}%)
            </div>
          </div>

          <div className="rpt-legend-item">
            <span className="rpt-legend-dot" style={{ backgroundColor: "#ef4444" }} />
            <div>
              <strong>Dispatch Blocked:</strong> {blocked} cabs ({blockedPct}%)
            </div>
          </div>

          <div className="rpt-legend-item" style={{ marginTop: "4px" }}>
            <span className="rpt-legend-dot" style={{ backgroundColor: "#7c3aed" }} />
            <div>
              <strong>Account Active:</strong> {active} cabs ({activePct}%)
            </div>
          </div>

          <div className="rpt-legend-item">
            <span className="rpt-legend-dot" style={{ backgroundColor: "#9ca3af" }} />
            <div>
              <strong>Account Inactive:</strong> {inactive} cabs
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars for Detailed Sub-Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
        <div className="rpt-bar-item">
          <div className="rpt-bar-header">
            <span className="rpt-bar-label">Regulatory Full Compliance</span>
            <span className="rpt-bar-value">{fleetData.compliant} / {total} cabs ({fleetData.compliantPct}%)</span>
          </div>
          <div className="rpt-bar-track">
            <div className="rpt-bar-fill" style={{ width: `${fleetData.compliantPct}%`, backgroundColor: "#10b981" }} />
          </div>
        </div>

        <div className="rpt-bar-item">
          <div className="rpt-bar-header">
            <span className="rpt-bar-label">Non-Compliant (Expired / Missing Docs)</span>
            <span className="rpt-bar-value">{fleetData.nonCompliant} / {total} cabs ({fleetData.nonCompliantPct}%)</span>
          </div>
          <div className="rpt-bar-track">
            <div className="rpt-bar-fill" style={{ width: `${fleetData.nonCompliantPct}%`, backgroundColor: "#ef4444" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
