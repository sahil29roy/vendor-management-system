import React from "react";

export default function FleetOverview({
  fleetData,
  onNavigate,
}) {
  if (!fleetData || fleetData.total === 0) {
    return (
      <div className="dsh-card">
        <div className="dsh-card-header">
          <h3 className="dsh-card-title">Commercial Fleet Operational Status</h3>
        </div>
        <div className="dsh-empty-state">
          <p className="dsh-empty-desc">No commercial vehicle fleet records available.</p>
        </div>
      </div>
    );
  }

  const {
    total,
    active,
    inactive,
    compliant,
    expiringSoon,
    nonCompliant,
    allowed,
    blocked,
    allowedPct,
    blockedPct,
  } = fleetData;

  // SVG Donut calculation for Operational Status: Allowed vs Blocked
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const allowedStroke = (allowedPct / 100) * circumference;
  const blockedStroke = circumference - allowedStroke;

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Commercial Fleet Overview</h3>
          <p className="dsh-card-subtitle">
            Account status vs regulatory dispatch eligibility ({total} total cabs).
          </p>
        </div>
        <button
          type="button"
          className="dsh-card-action"
          onClick={() => onNavigate && onNavigate("vehicles")}
        >
          View Fleet &rarr;
        </button>
      </div>

      <div className="dsh-fleet-chart-row">
        {/* Native SVG Donut Chart */}
        <div className="dsh-donut-wrap">
          <svg width="110" height="110" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            {/* Allowed portion */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${allowedStroke} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            {/* Blocked portion */}
            {blocked > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${blockedStroke} ${circumference}`}
                strokeDashoffset={`-${allowedStroke}`}
                transform="rotate(-90 50 50)"
              />
            )}
          </svg>
          <div className="dsh-donut-center">
            <span className="dsh-donut-pct">{allowedPct}%</span>
            <span className="dsh-donut-label">Allowed</span>
          </div>
        </div>

        {/* Separated Operational Concepts */}
        <div className="dsh-fleet-stats-list">
          {/* Concept 1: Vehicle Account Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500 }}>
              Account Status:
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <span className="dsh-pill-badge dsh-pill-green" title="Active accounts">
                Active: {active}
              </span>
              <span className="dsh-pill-badge dsh-pill-gray" title="Inactive accounts">
                Inactive: {inactive}
              </span>
            </div>
          </div>

          {/* Concept 2: Regulatory Compliance */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500 }}>
              Compliance Status:
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <span className="dsh-pill-badge dsh-pill-green" title="Fully compliant vehicles">
                Compliant: {compliant}
              </span>
              {expiringSoon > 0 && (
                <span className="dsh-pill-badge dsh-pill-yellow" title="Expiring soon">
                  Expiring: {expiringSoon}
                </span>
              )}
              <span className="dsh-pill-badge dsh-pill-red" title="Non-compliant vehicles">
                Non-Compliant: {nonCompliant}
              </span>
            </div>
          </div>

          {/* Concept 3: Dispatch Eligibility */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500 }}>
              Dispatch Eligibility:
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <span className="dsh-pill-badge dsh-pill-green" title="Legally permitted for trips">
                Allowed: {allowed}
              </span>
              <span className="dsh-pill-badge dsh-pill-red" title="Blocked from trips due to compliance">
                Blocked: {blocked} ({blockedPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
