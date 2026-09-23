import React from "react";
import DriverRow from "./DriverRow";

export default function DriverTable({
  drivers = [],
  vendors = [],
  vehicles = [],
  admin,
  sortKey,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onAssignVehicle,
  onUnassignVehicle,
  onToggleStatus,
}) {
  const renderSortIndicator = (key) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="dm-table-card">
      <div className="dm-table-header">
        <span className="dm-table-count">
          Showing {drivers.length} commercial driver{drivers.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="dm-table-responsive">
        <table className="dm-table">
          <thead>
            <tr>
              <th
                className="sortable"
                onClick={() => onSort("name")}
                title="Sort by Driver Name"
              >
                Driver {renderSortIndicator("name")}
              </th>
              <th>Phone</th>
              <th
                className="sortable"
                onClick={() => onSort("vendor")}
                title="Sort by Vendor"
              >
                Vendor {renderSortIndicator("vendor")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("vehicle")}
                title="Sort by Assigned Vehicle"
              >
                Vehicle {renderSortIndicator("vehicle")}
              </th>
              <th>DL Number</th>
              <th
                className="sortable"
                onClick={() => onSort("licenseExpiry")}
                title="Sort by DL Expiry"
              >
                DL Expiry {renderSortIndicator("licenseExpiry")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("availability")}
                title="Sort by Availability"
              >
                Availability {renderSortIndicator("availability")}
              </th>
              <th>Verification</th>
              <th
                className="sortable"
                onClick={() => onSort("status")}
                title="Sort by Status"
              >
                Status {renderSortIndicator("status")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="dm-empty-state">
                    <div className="dm-empty-title">No drivers found</div>
                    <p style={{ fontSize: "13px" }}>
                      Try changing your search keywords or resetting filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <DriverRow
                  key={driver.id}
                  driver={driver}
                  vendors={vendors}
                  vehicles={vehicles}
                  admin={admin}
                  onView={onView}
                  onEdit={onEdit}
                  onAssignVehicle={onAssignVehicle}
                  onUnassignVehicle={onUnassignVehicle}
                  onToggleStatus={onToggleStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
