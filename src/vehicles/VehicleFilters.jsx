import React from "react";

export default function VehicleFilters({
  searchQuery,
  onSearchChange,
  selectedVendor,
  onVendorChange,
  selectedFuelType,
  onFuelChange,
  selectedStatus,
  onStatusChange,
  driverFilter,
  onDriverFilterChange,
  vendors = [],
  onResetFilters,
}) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedVendor !== "all" ||
    selectedFuelType !== "all" ||
    selectedStatus !== "all" ||
    driverFilter !== "all";

  return (
    <div className="vm-filter-card">
      <div className="vm-filter-row">
        {/* Search Input */}
        <div className="vm-search-wrapper">
          <span className="vm-search-icon">&#128269;</span>
          <input
            type="text"
            className="vm-search-input"
            placeholder="Search by reg number, model, vendor, or driver..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Vendor Filter */}
        <select
          className="vm-select-filter"
          value={selectedVendor}
          onChange={(e) => onVendorChange(e.target.value)}
          aria-label="Filter by Vendor"
        >
          <option value="all">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        {/* Fuel Type Filter */}
        <select
          className="vm-select-filter"
          value={selectedFuelType}
          onChange={(e) => onFuelChange(e.target.value)}
          aria-label="Filter by Fuel Type"
        >
          <option value="all">All Fuel Types</option>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
        </select>

        {/* Status Filter */}
        <select
          className="vm-select-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="non-compliant">Non-Compliant</option>
        </select>

        {/* Driver Filter */}
        <select
          className="vm-select-filter"
          value={driverFilter}
          onChange={(e) => onDriverFilterChange(e.target.value)}
          aria-label="Filter by Driver Assignment"
        >
          <option value="all">All Assignments</option>
          <option value="assigned">Driver Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="vm-btn-icon"
            onClick={onResetFilters}
            title="Reset all filters"
            style={{ padding: "8px 12px" }}
          >
            &times; Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
