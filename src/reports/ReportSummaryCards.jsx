import React from "react";

export default function ReportSummaryCards({ summary, onCardClick }) {
  if (!summary) return null;

  const cards = [
    {
      key: "vendors",
      label: "Total Vendors",
      value: summary.totalVendors,
      className: "",
      drillView: "vendors",
    },
    {
      key: "vehicles",
      label: "Total Fleet",
      value: summary.totalVehicles,
      className: "",
      drillView: "vehicles",
    },
    {
      key: "activeVehicles",
      label: "Active Cabs",
      value: summary.activeVehicles,
      className: "valid",
      drillView: "vehicles",
    },
    {
      key: "totalDrivers",
      label: "Total Drivers",
      value: summary.totalDrivers,
      className: "",
      drillView: "drivers",
    },
    {
      key: "activeDrivers",
      label: "Active Drivers",
      value: summary.activeDrivers,
      className: "valid",
      drillView: "drivers",
    },
    {
      key: "nonCompliant",
      label: "Non-Compliant Cabs",
      value: summary.nonCompliantVehicles,
      className: summary.nonCompliantVehicles > 0 ? "danger" : "valid",
      drillView: "compliance",
    },
    {
      key: "blocked",
      label: "Blocked Dispatch",
      value: summary.blockedVehicles,
      className: summary.blockedVehicles > 0 ? "blocked" : "valid",
      drillView: "compliance",
    },
    {
      key: "expiringDocs",
      label: "Expiring Docs (\u226430d)",
      value: summary.expiringDocs,
      className: summary.expiringDocs > 0 ? "warning" : "",
      drillView: "compliance",
    },
    {
      key: "expiredDocs",
      label: "Expired Docs",
      value: summary.expiredDocs,
      className: summary.expiredDocs > 0 ? "danger" : "valid",
      drillView: "compliance",
    },
  ];

  return (
    <div className="rpt-stats-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rpt-stat-card ${card.className}`}
          style={{ cursor: onCardClick ? "pointer" : "default" }}
          onClick={() => onCardClick && onCardClick(card)}
          title={onCardClick ? `Click to inspect in ${card.drillView}` : undefined}
        >
          <span className="rpt-stat-label">{card.label}</span>
          <span className="rpt-stat-value">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
