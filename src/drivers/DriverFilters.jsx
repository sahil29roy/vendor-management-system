import React from "react";

export default function DriverFilters({
  searchQuery,
  onSearchChange,
  selectedVendor,
  onVendorChange,
  selectedStatus,
  onStatusChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedVerification,
  onVerificationChange,
  selectedVehicleStatus,
  onVehicleStatusChange,
  selectedDLStatus,
  onDLStatusChange,
  vendors = [],
  onResetFilters,
}) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedVendor !== "all" ||
    selectedStatus !== "all" ||
    selectedAvailability !== "all" ||
    selectedVerification !== "all" ||
    selectedVehicleStatus !== "all" ||
    selectedDLStatus !== "all";

  return (
    <div className="dm-filter-card">
      <div className="dm-filter-row">
        {/* Search */}
        <div className="dm-search-wrapper">
          <span className="dm-search-icon">&#128269;</span>
          <input
            type="text"
            className="dm-search-input"
            placeholder="Search by driver name, phone, DL, vendor, or vehicle..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Vendor */}
        <select
          className="dm-select-filter"
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

        {/* Status */}
        <select
          className="dm-select-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Availability */}
        <select
          className="dm-select-filter"
          value={selectedAvailability}
          onChange={(e) => onAvailabilityChange(e.target.value)}
          aria-label="Filter by Availability"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="on trip">On Trip</option>
          <option value="unavailable">Unavailable</option>
          <option value="off duty">Off Duty</option>
        </select>

        {/* Verification */}
        <select
          className="dm-select-filter"
          value={selectedVerification}
          onChange={(e) => onVerificationChange(e.target.value)}
          aria-label="Filter by Verification"
        >
          <option value="all">All Verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Vehicle Assignment */}
        <select
          className="dm-select-filter"
          value={selectedVehicleStatus}
          onChange={(e) => onVehicleStatusChange(e.target.value)}
          aria-label="Filter by Vehicle Assignment"
        >
          <option value="all">All Vehicle States</option>
          <option value="assigned">Vehicle Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>

        {/* DL Expiry Status */}
        <select
          className="dm-select-filter"
          value={selectedDLStatus}
          onChange={(e) => onDLStatusChange(e.target.value)}
          aria-label="Filter by DL Status"
        >
          <option value="all">All DL Status</option>
          <option value="valid">Valid DL</option>
          <option value="expiring soon">Expiring Soon</option>
          <option value="expired">Expired DL</option>
        </select>

        {/* Reset */}
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
