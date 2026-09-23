import React from "react";

export default function ComplianceFilters({
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
    Boolean(filters.searchQuery) ||
    filters.ownerType !== "all" ||
    filters.documentType !== "all" ||
    filters.vendorId !== "all" ||
    filters.status !== "all" ||
    filters.expiryRange !== "all";

  return (
    <div className="comp-filter-panel">
      <div className="comp-filter-row">
        {/* Search Input */}
        <div className="comp-search-box">
          <input
            type="text"
            className="comp-search-input"
            placeholder="Search by doc number, driver, vehicle plate, vendor..."
            value={filters.searchQuery || ""}
            onChange={(e) => handleChange("searchQuery", e.target.value)}
          />
        </div>

        {/* Owner Type */}
        <select
          className="comp-select-control"
          value={filters.ownerType || "all"}
          onChange={(e) => handleChange("ownerType", e.target.value)}
          aria-label="Filter by Owner Type"
        >
          <option value="all">All Owners</option>
          <option value="vehicle">Commercial Vehicles</option>
          <option value="driver">Active Drivers</option>
        </select>

        {/* Document Type */}
        <select
          className="comp-select-control"
          value={filters.documentType || "all"}
          onChange={(e) => handleChange("documentType", e.target.value)}
          aria-label="Filter by Document Type"
        >
          <option value="all">All Doc Types</option>
          <option value="Driving License">Driving Licence (DL)</option>
          <option value="RC">Registration Cert (RC)</option>
          <option value="Permit">Commercial Permit</option>
          <option value="Pollution Certificate">Pollution (PUC)</option>
        </select>

        {/* Vendor */}
        <select
          className="comp-select-control"
          value={filters.vendorId || "all"}
          onChange={(e) => handleChange("vendorId", e.target.value)}
          aria-label="Filter by Vendor"
        >
          <option value="all">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="comp-select-control"
          value={filters.status || "all"}
          onChange={(e) => handleChange("status", e.target.value)}
          aria-label="Filter by Document Status"
        >
          <option value="all">All Statuses</option>
          <option value="valid">Valid</option>
          <option value="expiring_soon">Expiring Soon (&le;30d)</option>
          <option value="expired">Expired</option>
        </select>

        {/* Expiry Range */}
        <select
          className="comp-select-control"
          value={filters.expiryRange || "all"}
          onChange={(e) => handleChange("expiryRange", e.target.value)}
          aria-label="Filter by Expiry Window"
        >
          <option value="all">All Expiries</option>
          <option value="expired">Already Expired</option>
          <option value="7_days">Expiring within 7 Days</option>
          <option value="30_days">Expiring within 30 Days</option>
          <option value="more_than_30">More than 30 Days</option>
        </select>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            className="comp-reset-btn"
            onClick={onReset}
            title="Reset all filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
