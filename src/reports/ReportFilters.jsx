import React from "react";

export default function ReportFilters({
  filters,
  onFilterChange,
  vendors = [],
  onReset,
}) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const isFiltered =
    filters.vendorId !== "all" ||
    filters.dateRange !== "all" ||
    filters.vehicleStatus !== "all" ||
    filters.complianceStatus !== "all";

  return (
    <div className="rpt-filter-panel">
      {/* Vendor Filter */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>
          Target Vendor Organization
        </label>
        <select
          className="rpt-select-control"
          value={filters.vendorId || "all"}
          onChange={(e) => handleChange("vendorId", e.target.value)}
          aria-label="Filter by Vendor"
        >
          <option value="all">All Vendors (Consolidated)</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range / Horizon */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>
          Reporting Period
        </label>
        <select
          className="rpt-select-control"
          value={filters.dateRange || "all"}
          onChange={(e) => handleChange("dateRange", e.target.value)}
          aria-label="Filter by Period"
        >
          <option value="all">All Time (Full Registry)</option>
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="90_days">Last 90 Days</option>
        </select>
      </div>

      {/* Vehicle Fleet Status */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>
          Fleet Operational State
        </label>
        <select
          className="rpt-select-control"
          value={filters.vehicleStatus || "all"}
          onChange={(e) => handleChange("vehicleStatus", e.target.value)}
          aria-label="Filter by Vehicle Status"
        >
          <option value="all">All Fleet Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="blocked">Blocked Dispatch Only</option>
        </select>
      </div>

      {/* Compliance Status */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>
          Regulatory Compliance State
        </label>
        <select
          className="rpt-select-control"
          value={filters.complianceStatus || "all"}
          onChange={(e) => handleChange("complianceStatus", e.target.value)}
          aria-label="Filter by Compliance Status"
        >
          <option value="all">All Compliance States</option>
          <option value="compliant">Fully Compliant Only</option>
          <option value="expiring_soon">Expiring Soon Only (&le;30d)</option>
          <option value="non_compliant">Non-Compliant Only</option>
        </select>
      </div>

      {/* Reset button */}
      {isFiltered && (
        <div style={{ alignSelf: "flex-end", marginBottom: "2px" }}>
          <button
            type="button"
            className="rpt-btn-reset"
            onClick={onReset}
            title="Reset filters to default"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
