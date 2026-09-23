import React from "react";
import DriverStatusBadge from "./DriverStatusBadge";
import DriverVerificationBadge from "./DriverVerificationBadge";
import {
  getVendorById,
  getVehicleById,
  getLicenseStatus,
  formatDLDate,
} from "../utils/driverUtils";

export default function DriverRow({
  driver,
  vendors = [],
  vehicles = [],
  admin,
  onView,
  onEdit,
  onAssignVehicle,
  onUnassignVehicle,
  onToggleStatus,
}) {
  const vendor = getVendorById(vendors, driver.vendorId, admin);
  const vehicle = getVehicleById(vehicles, driver.vehicleId);
  const dlStatus = getLicenseStatus(driver.licenseExpiry);

  const getDLStatusClass = (status) => {
    if (status === "Expired") return "dm-dl-expired";
    if (status === "Expiring Soon") return "dm-dl-expiring";
    return "dm-dl-valid";
  };

  const getAvailClass = (avail) => {
    const a = (avail || "available").toLowerCase();
    if (a === "on trip") return "dm-badge-pill dm-avail-ontrip";
    if (a === "unavailable") return "dm-badge-pill dm-avail-unavailable";
    if (a === "off duty") return "dm-badge-pill dm-avail-offduty";
    return "dm-badge-pill dm-avail-available";
  };

  const isInactive = driver.status === "inactive";

  return (
    <tr>
      {/* Driver Name & Email */}
      <td>
        <div style={{ fontWeight: 600, color: "#111827" }}>{driver.name}</div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>{driver.email}</div>
      </td>

      {/* Phone */}
      <td>
        <span style={{ fontSize: "13px", color: "#374151" }}>{driver.phone}</span>
      </td>

      {/* Vendor */}
      <td>
        <div style={{ fontWeight: 600 }}>{vendor ? vendor.name : driver.vendorId}</div>
        {vendor?.location && (
          <div style={{ fontSize: "11px", color: "#6b7280" }}>{vendor.location}</div>
        )}
      </td>

      {/* Assigned Vehicle */}
      <td>
        {vehicle ? (
          <div>
            <span className="vm-reg-plate">{vehicle.registrationNumber}</span>
            <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>
              {vehicle.model}
            </div>
          </div>
        ) : (
          <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>
            Unassigned
          </span>
        )}
      </td>

      {/* DL Number */}
      <td>
        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#1f2937" }}>
          {driver.licenseNumber}
        </span>
      </td>

      {/* DL Expiry & Calculated Status */}
      <td>
        <div>{formatDLDate(driver.licenseExpiry)}</div>
        <div className={getDLStatusClass(dlStatus)} style={{ fontSize: "11px" }}>
          &bull; {dlStatus}
        </div>
      </td>

      {/* Availability */}
      <td>
        <span className={getAvailClass(driver.availability)}>
          {driver.availability || "Available"}
        </span>
      </td>

      {/* Verification */}
      <td>
        <DriverVerificationBadge verification={driver.verification} />
      </td>

      {/* Status */}
      <td>
        <DriverStatusBadge status={driver.status} />
      </td>

      {/* Actions */}
      <td>
        <div className="dm-row-actions">
          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onView(driver)}
            title="Inspect driver profile"
          >
            View
          </button>

          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onEdit(driver)}
            title="Edit driver information"
          >
            Edit
          </button>

          <button
            type="button"
            className="vm-btn-icon"
            onClick={() => onAssignVehicle(driver)}
            title={driver.vehicleId ? "Reassign vehicle" : "Assign vehicle"}
          >
            {driver.vehicleId ? "Reassign" : "Assign"}
          </button>

          {driver.vehicleId && (
            <button
              type="button"
              className="vm-btn-icon"
              style={{ color: "#b45309" }}
              onClick={() => onUnassignVehicle(driver)}
              title="Remove vehicle assignment"
            >
              Unassign
            </button>
          )}

          <button
            type="button"
            className={`vm-btn-icon ${isInactive ? "" : "vm-btn-icon-danger"}`}
            onClick={() => onToggleStatus(driver)}
            title={isInactive ? "Activate driver" : "Deactivate driver"}
          >
            {isInactive ? "Activate" : "Deactivate"}
          </button>
        </div>
      </td>
    </tr>
  );
}
