import React from "react";

export default function ComplianceSummary({ stats, onStatClick }) {
  if (!stats) return null;

  const items = [
    {
      key: "total",
      label: "Total Documents",
      value: stats.totalDocuments,
      className: "",
    },
    {
      key: "valid",
      label: "Valid",
      value: stats.valid,
      className: "valid",
      statusFilter: "valid",
    },
    {
      key: "expiring",
      label: "Expiring Soon",
      value: stats.expiringSoon,
      className: "expiring",
      statusFilter: "expiring_soon",
    },
    {
      key: "expired",
      label: "Expired",
      value: stats.expired,
      className: "expired",
      statusFilter: "expired",
    },
    {
      key: "missing",
      label: "Missing Docs",
      value: stats.missing,
      className: "missing",
      statusFilter: "missing",
    },
    {
      key: "non_compliant_vehicles",
      label: "Non-Compliant Cabs",
      value: stats.nonCompliantVehicles,
      className: "expired",
      tab: "vehicles",
    },
    {
      key: "blocked",
      label: "Blocked Fleet",
      value: stats.blockedVehicles,
      className: "blocked",
      tab: "vehicles",
    },
  ];

  return (
    <div className="comp-stats-grid">
      {items.map((item) => (
        <div
          key={item.key}
          className={`comp-stat-card ${item.className}`}
          style={{ cursor: onStatClick ? "pointer" : "default" }}
          onClick={() => onStatClick && onStatClick(item)}
          title={onStatClick ? `Click to filter by ${item.label}` : undefined}
        >
          <span className="comp-stat-label">{item.label}</span>
          <span className="comp-stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
