import React from "react";

export default function VehicleActions({
  stats,
}) {
  return (
    <div className="vm-stats-strip">
      <div className="vm-stat-card">
        <span className="vm-stat-label">Total Fleet</span>
        <span className="vm-stat-value">{stats.total}</span>
      </div>

      <div className="vm-stat-card">
        <span className="vm-stat-label">Active Cabs</span>
        <span className="vm-stat-value vm-stat-badge-active">{stats.active}</span>
      </div>

      <div className="vm-stat-card">
        <span className="vm-stat-label">Driver Assigned</span>
        <span className="vm-stat-value" style={{ color: "#7c3aed" }}>
          {stats.assigned}
        </span>
      </div>

      <div className="vm-stat-card">
        <span className="vm-stat-label">Unassigned Cabs</span>
        <span className="vm-stat-value" style={{ color: "#d97706" }}>
          {stats.unassigned}
        </span>
      </div>

      <div className="vm-stat-card">
        <span className="vm-stat-label">Inactive / Grounded</span>
        <span className="vm-stat-value vm-stat-badge-inactive">{stats.inactive}</span>
      </div>

      <div className="vm-stat-card">
        <span className="vm-stat-label">Non-Compliant</span>
        <span className="vm-stat-value vm-stat-badge-noncompliant">
          {stats.nonCompliant}
        </span>
      </div>
    </div>
  );
}
