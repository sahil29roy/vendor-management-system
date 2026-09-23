import React, { useState, useEffect } from "react";
import { getDriverById, checkDriverAvailability } from "../utils/vehicleUtils";

export default function AssignDriverModal({
  isOpen,
  vehicle,
  drivers = [],
  allVehicles = [],
  onClose,
  onConfirmAssignment,
}) {
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (vehicle) {
      setSelectedDriverId(vehicle.driverId || "");
      setError("");
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const currentDriver = getDriverById(drivers, vehicle.driverId);

  const handleDriverChange = (e) => {
    const dId = e.target.value;
    setSelectedDriverId(dId);

    if (!dId) {
      setError("");
      return;
    }

    const check = checkDriverAvailability(drivers, allVehicles, dId, vehicle.id);
    if (!check.available) {
      setError(check.reason);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDriverId) {
      const check = checkDriverAvailability(drivers, allVehicles, selectedDriverId, vehicle.id);
      if (!check.available) {
        setError(check.reason);
        return;
      }
    }

    onConfirmAssignment(vehicle.id, selectedDriverId || null);
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
            {vehicle.driverId ? "Reassign Commercial Driver" : "Assign Commercial Driver"}
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
            {/* Vehicle Card */}
            <div>
              <span className="vh-details-group-title">Selected Vehicle</span>
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
                  <span className="vm-reg-plate">{vehicle.registrationNumber}</span>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>
                    {vehicle.model} ({vehicle.year})
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  {vehicle.seatingCapacity} Seater &bull; {vehicle.fuelType}
                </span>
              </div>
            </div>

            {/* Current Driver */}
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
                {currentDriver ? (
                  <div>
                    <strong>{currentDriver.name}</strong> ({currentDriver.phone})
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                    No driver currently assigned (Unassigned)
                  </span>
                )}
              </div>
            </div>

            {/* Driver Dropdown */}
            <div className="vm-form-group">
              <label className="vm-form-label" htmlFor="driverSelect">
                Select Driver to Assign
              </label>
              <select
                id="driverSelect"
                className={`vm-form-select ${error ? "has-error" : ""}`}
                value={selectedDriverId}
                onChange={handleDriverChange}
              >
                <option value="">-- No Driver (Leave Unassigned) --</option>
                {drivers.map((d) => {
                  const isCurrent = vehicle.driverId === d.id;
                  const availability = checkDriverAvailability(
                    drivers,
                    allVehicles,
                    d.id,
                    vehicle.id
                  );

                  return (
                    <option
                      key={d.id}
                      value={d.id}
                      disabled={!availability.available && !isCurrent}
                    >
                      {d.name} ({d.phone})
                      {isCurrent ? " — [Current Driver]" : ""}
                      {!availability.available && !isCurrent
                        ? ` — [Assigned to ${availability.conflictingVehicle?.registrationNumber}]`
                        : ""}
                    </option>
                  );
                })}
              </select>
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
                <strong>Assignment Conflict:</strong> {error}
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
