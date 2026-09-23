import React from "react";

export default function DashboardStats({
  stats,
  onNavigate,
}) {
  if (!stats) return null;

  const {
    totalVendors,
    totalVehicles,
    totalDrivers,
    activeVehicles,
    nonCompliantVehicles,
    expiringDocuments,
  } = stats;

  const cards = [
    {
      id: "stat-vendors",
      label: "Total Vendors",
      value: totalVendors,
      subtext: "Super & Regional network",
      target: "vendors",
      colorClass: "dsh-stat-purple",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "stat-vehicles",
      label: "Total Vehicles",
      value: totalVehicles,
      subtext: "Commercial cabs registered",
      target: "vehicles",
      colorClass: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: "stat-drivers",
      label: "Total Drivers",
      value: totalDrivers,
      subtext: "Active & assigned personnel",
      target: "drivers",
      colorClass: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "stat-active-vehicles",
      label: "Active Vehicles",
      value: activeVehicles,
      subtext: "Commercial accounts active",
      target: "vehicles",
      colorClass: "dsh-stat-active",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: "stat-non-compliant",
      label: "Non-Compliant Cabs",
      value: nonCompliantVehicles,
      subtext: nonCompliantVehicles > 0 ? "Dispatch blocked" : "All vehicles compliant",
      target: "compliance",
      colorClass: nonCompliantVehicles > 0 ? "dsh-stat-danger" : "dsh-stat-active",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={nonCompliantVehicles > 0 ? "#ef4444" : "#10b981"}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      id: "stat-expiring-docs",
      label: "Expiring Docs",
      value: expiringDocuments,
      subtext: "Expired or due in 30 days",
      target: "compliance",
      colorClass: expiringDocuments > 0 ? "dsh-stat-warning" : "dsh-stat-active",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={expiringDocuments > 0 ? "#f59e0b" : "#10b981"}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="dsh-stats-grid">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          className={`dsh-stat-card ${card.colorClass}`}
          onClick={() => onNavigate && onNavigate(card.target)}
          title={`Click to view ${card.label} in ${card.target} module`}
        >
          <div className="dsh-stat-header">
            <span className="dsh-stat-label">{card.label}</span>
            {card.icon}
          </div>
          <div className="dsh-stat-value">{card.value}</div>
          <div className="dsh-stat-subtext">
            <span>{card.subtext}</span>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#7c3aed" }}>&rarr;</span>
          </div>
        </button>
      ))}
    </div>
  );
}
