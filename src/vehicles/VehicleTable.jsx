import React from "react";
import VehicleRow from "./VehicleRow";

export default function VehicleTable({
  vehicles = [],
  vendors = [],
  drivers = [],
  admin,
  sortKey,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onAssignDriver,
  onUnassignDriver,
  onToggleStatus,
}) {
  const renderSortIndicator = (key) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="vm-table-card">
      <div className="vm-table-header">
        <span className="vm-table-count">
          Showing {vehicles.length} commercial vehicle{vehicles.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="vm-table-responsive">
        <table className="vm-table">
          <thead>
            <tr>
              <th
                className="sortable"
                onClick={() => onSort("registration")}
                title="Sort by Registration"
              >
                Registration {renderSortIndicator("registration")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("vendor")}
                title="Sort by Vendor"
              >
                Vendor {renderSortIndicator("vendor")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("model")}
                title="Sort by Model"
              >
                Model {renderSortIndicator("model")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("year")}
                title="Sort by Year"
              >
                Year {renderSortIndicator("year")}
              </th>
              <th
                className="sortable"
                onClick={() => onSort("seating")}
                title="Sort by Seating"
              >
                Seating {renderSortIndicator("seating")}
              </th>
              <th>Fuel</th>
              <th>Assigned Driver</th>
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
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="vm-empty-state">
                    <div className="vm-empty-title">No vehicles found</div>
                    <p style={{ fontSize: "13px" }}>
                      Try changing your search keywords or resetting filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  vendors={vendors}
                  drivers={drivers}
                  admin={admin}
                  onView={onView}
                  onEdit={onEdit}
                  onAssignDriver={onAssignDriver}
                  onUnassignDriver={onUnassignDriver}
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
