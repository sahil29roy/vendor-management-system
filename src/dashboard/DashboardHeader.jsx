import React from "react";

export default function DashboardHeader({
  vendors = [],
  selectedVendorId = "all",
  onSelectVendor,
}) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dsh-header">
      <div className="dsh-header-title-group">
        <h1 className="dsh-title">Dashboard</h1>
        <p className="dsh-subtitle">
          Overview of your vendor network, fleet, drivers and compliance.
        </p>
      </div>

      <div className="dsh-header-meta">
        {/* Live Date Badge */}
        <div className="dsh-date-badge" title="Live Operating Date">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#7c3aed" }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{currentDate}</span>
        </div>

        {/* Dynamic Vendor Scope Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label
            htmlFor="dsh-vendor-select"
            style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}
          >
            Scope:
          </label>
          <select
            id="dsh-vendor-select"
            className="dsh-filter-select"
            value={selectedVendorId}
            onChange={(e) => onSelectVendor && onSelectVendor(e.target.value)}
          >
            <option value="all">All Vendors (Global Central)</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
