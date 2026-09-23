import React, { useState, useEffect } from "react";
import {
  getVendorById,
  getVehicleById,
  isVehicleAvailableForDriver,
  getAvailableVehiclesForVendor,
} from "../utils/driverUtils";

export default function AssignVehicleModal({
  isOpen,
  driver,
  vendors = [],
  vehicles = [],
  allDrivers = [],
  admin,
  onClose,
  onConfirmAssignment,
}) {
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (driver) {
      setSelectedVehicleId(driver.vehicleId || "");
      setError("");
    }
  }, [driver, isOpen]);

  if (!isOpen || !driver) return null;

  const vendor = getVendorById(vendors, driver.vendorId, admin);
  const currentVehicle = getVehicleById(vehicles, driver.vehicleId);
  const vendorVehicles = getAvailableVehiclesForVendor(
    vehicles,
    driver.vendorId,
    driver.id
  );

  const handleVehicleChange = (e) => {
    const vId = e.target.value;
    setSelectedVehicleId(vId);

    if (!vId) {
      setError("");
      return;
    }

    const check = isVehicleAvailableForDriver(
      vehicles,
      allDrivers,
      vId,
      driver.vendorId,
      driver.id
    );

    if (!check.available) {
      setError(check.reason);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedVehicleId) {
      const check = isVehicleAvailableForDriver(
        vehicles,
        allDrivers,
        selectedVehicleId,
        driver.vendorId,
        driver.id
      );
      if (!check.available) {
        setError(check.reason);
        return;
      }
    }

    onConfirmAssignment(driver.id, selectedVehicleId || null);
    onClose();
  };

  return (
    <div className="vm-modal-backdrop" onClick={onClose}>
      <div
        className="vm-modal-card"
        style={{ maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="vm-modal-header">
          <h3 className="vm-modal-title">
            {driver.vehicleId ? "Reassign Commercial Vehicle" : "Assign Commercial Vehicle"}
          </h3>
          <button
            type="button"
            className="vm-alert-dismiss"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vm-modal-body">
            {/* Driver Card */}
            <div>
              <span className="vh-details-group-title">Driver Profile</span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  backgroundColor: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  borderRadius: "6px",
                  marginTop: "4px",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                    {driver.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {driver.phone} &bull; {vendor ? vendor.name : driver.vendorId}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600 }}>
                  DL: {driver.licenseNumber}
                </span>
              </div>
            </div>

            {/* Current Vehicle */}
            <div>
              <span className="vh-details-group-title">Current Assignment</span>
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "13px",
                  marginTop: "4px",
                  color: "#374151",
                }}
              >
                {currentVehicle ? (
                  <div>
                    <span className="vm-reg-plate">{currentVehicle.registrationNumber}</span>{" "}
                    <strong>{currentVehicle.model}</strong> ({currentVehicle.fuelType})
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                    No vehicle assigned (Unassigned)
                  </span>
                )}
              </div>
            </div>

            {/* Select Vehicle Dropdown (Vendor-Scoped) */}
            <div className="vm-form-group">
              <label className="vm-form-label" htmlFor="vehicleAssignSelect">
                Select Vehicle ({vendor?.name || "Vendor Fleet"})
              </label>
              <select
                id="vehicleAssignSelect"
                className={`vm-form-select ${error ? "has-error" : ""}`}
                value={selectedVehicleId}
                onChange={handleVehicleChange}
              >
                <option value="">-- No Vehicle (Leave Unassigned) --</option>
                {vendorVehicles.map((v) => {
                  const isCurrent = driver.vehicleId === v.id;
                  return (
                    <option
                      key={v.id}
                      value={v.id}
                      disabled={!v.isAvailable && !isCurrent}
                    >
                      {v.registrationNumber} — {v.model} ({v.seatingCapacity} Seats, {v.fuelType})
                      {isCurrent ? " — [Current Vehicle]" : ""}
                      {!v.isAvailable && !isCurrent ? " — [Assigned to another driver]" : ""}
                    </option>
                  );
                })}
              </select>
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                Strict rule: Drivers can only be assigned to vehicles owned by their contracted vendor.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fee2e2",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                <strong>Conflict:</strong> {error}
              </div>
            )}
          </div>

          <div className="vm-modal-footer">
            <button
              type="button"
              className="vh-btn vh-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="vh-btn vh-btn-primary"
              disabled={!!error}
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
