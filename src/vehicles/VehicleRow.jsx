import React from "react";
import VehicleStatusBadge from "./VehicleStatusBadge";
import { getVendorById, getDriverById } from "../utils/vehicleUtils";

export default function VehicleRow({
  vehicle,
  vendors = [],
  drivers = [],
  admin,
  onView,
  onEdit,
  onAssignDriver,
  onUnassignDriver,
  onToggleStatus,
}) {
  const vendor = getVendorById(vendors, vehicle.vendorId, admin);
  const driver = getDriverById(drivers, vehicle.driverId);

  const getFuelBadgeClass = (fuel) => {
    const f = (fuel || "").toLowerCase();
    if (f.includes("diesel")) return "vm-fuel-badge vm-fuel-diesel";
    if (f.includes("petrol")) return "vm-fuel-badge vm-fuel-petrol";
    if (f.includes("cng")) return "vm-fuel-badge vm-fuel-cng";
    if (f.includes("electric")) return "vm-fuel-badge vm-fuel-electric";
    return "vm-fuel-badge";
  };

  const isInactive = vehicle.status === "inactive";

  return (
    <tr>
      {/* Registration */}
      <td>
        <span className="vm-reg-plate">{vehicle.registrationNumber}</span>
      </td>

      {/* Vendor */}
      <td>
        <div style={{ fontWeight: 600 }}>{vendor ? vendor.name : vehicle.vendorId}</div>
        {vendor?.location && (
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            {vendor.location}
          </div>
        )}
      </td>

      {/* Model */}
      <td>
        <span style={{ fontWeight: 500 }}>{vehicle.model}</span>
      </td>

      {/* Year */}
      <td>{vehicle.year || "—"}</td>

      {/* Seating */}
      <td>{vehicle.seatingCapacity} Seater</td>

      {/* Fuel Type */}
      <td>
        <span className={getFuelBadgeClass(vehicle.fuelType)}>
          {vehicle.fuelType || "—"}
        </span>
      </td>

      {/* Driver */}
      <td>
        {driver ? (
          <div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{driver.name}</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>{driver.phone}</div>
          </div>
        ) : (
          <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>
            Unassigned
          </span>
        )}
      </td>

      {/* Status */}
      <td>
        <VehicleStatusBadge status={vehicle.status} />
      </td>

      {/* Actions */}
      <td>
        <div className="vm-row-actions">
          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onView(vehicle)}
            title="Inspect vehicle details"
          >
            View
          </button>

          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onEdit(vehicle)}
            title="Edit vehicle information"
          >
            Edit
          </button>

          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onAssignDriver(vehicle)}
            title={vehicle.driverId ? "Reassign driver" : "Assign driver"}
          >
            {vehicle.driverId ? "Reassign" : "Assign"}
          </button>

          {vehicle.driverId && (
            <button
              type="button"
              className="vm-btn-icon"
              style={{ color: "#b45309" }}
              onClick={() => onUnassignDriver(vehicle)}
              title="Remove driver assignment"
            >
              Unassign
            </button>
          )}

          <button
            type="button"
            className={`vm-btn-icon ${isInactive ? "" : "vm-btn-icon-danger"}`}
            onClick={() => onToggleStatus(vehicle)}
            title={isInactive ? "Activate vehicle" : "Deactivate vehicle"}
          >
            {isInactive ? "Activate" : "Deactivate"}
          </button>
        </div>
      </td>
    </tr>
  );
}
