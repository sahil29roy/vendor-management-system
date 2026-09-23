import React, { useState, useEffect } from "react";
import {
  isRegistrationUnique,
  checkDriverAvailability,
} from "../utils/vehicleUtils";

const INITIAL_VEHICLE_STATE = {
  registrationNumber: "",
  model: "",
  year: new Date().getFullYear(),
  seatingCapacity: 5,
  fuelType: "Diesel",
  vendorId: "",
  driverId: "",
  status: "active",
};

export default function VehicleForm({
  isOpen,
  initialVehicle = null,
  allVehicles = [],
  vendors = [],
  drivers = [],
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(INITIAL_VEHICLE_STATE);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialVehicle && initialVehicle.id);

  // Load initial vehicle data if editing
  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        registrationNumber: initialVehicle.registrationNumber || "",
        model: initialVehicle.model || "",
        year: initialVehicle.year || new Date().getFullYear(),
        seatingCapacity: initialVehicle.seatingCapacity || 5,
        fuelType: initialVehicle.fuelType || "Diesel",
        vendorId: initialVehicle.vendorId || "",
        driverId: initialVehicle.driverId || "",
        status: initialVehicle.status || "active",
      });
      setErrors({});
    } else {
      setFormData(INITIAL_VEHICLE_STATE);
      setErrors({});
    }
  }, [initialVehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "seatingCapacity"
          ? parseInt(value, 10) || ""
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // 1. Registration Number
    const reg = (formData.registrationNumber || "").trim().toUpperCase();
    if (!reg) {
      newErrors.registrationNumber = "Registration number is required.";
    } else if (reg.length < 5) {
      newErrors.registrationNumber = "Please enter a valid commercial registration plate (e.g. PB10AB1234).";
    } else if (!isRegistrationUnique(allVehicles, reg, initialVehicle?.id)) {
      newErrors.registrationNumber = "Vehicle with this registration number already exists.";
    }

    // 2. Model
    if (!formData.model || !formData.model.trim()) {
      newErrors.model = "Vehicle model name is required.";
    }

    // 3. Year
    const yr = Number(formData.year);
    if (!yr || isNaN(yr)) {
      newErrors.year = "Manufacturing year is required.";
    } else if (yr < 2000) {
      newErrors.year = "Vehicle year cannot be older than 2000 for commercial fleets.";
    } else if (yr > currentYear + 1) {
      newErrors.year = `Manufacturing year cannot exceed ${currentYear + 1}.`;
    }

    // 4. Seating Capacity
    const seats = Number(formData.seatingCapacity);
    if (!seats || isNaN(seats) || seats <= 0) {
      newErrors.seatingCapacity = "Seating capacity must be a positive number.";
    } else if (seats > 50) {
      newErrors.seatingCapacity = "Seating capacity exceeds commercial cab/van limits.";
    }

    // 5. Fuel Type
    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required.";
    }

    // 6. Vendor
    if (!formData.vendorId) {
      newErrors.vendorId = "Every vehicle must belong to an authorized vendor.";
    }

    // 7. Driver (if selected, check availability)
    if (formData.driverId) {
      const driverCheck = checkDriverAvailability(
        drivers,
        allVehicles,
        formData.driverId,
        initialVehicle?.id
      );
      if (!driverCheck.available) {
        newErrors.driverId = driverCheck.reason;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      registrationNumber: formData.registrationNumber.trim().toUpperCase(),
      driverId: formData.driverId || null,
    };

    if (isEditMode) {
      onSubmit({ ...initialVehicle, ...payload });
    } else {
      const newVehicleId = `vehicle-${String(allVehicles.length + 1).padStart(3, "0")}`;
      onSubmit({ id: newVehicleId, ...payload });
    }

    onClose();
  };

  return (
    <div className="vm-modal-backdrop" onClick={onClose}>
      <div
        className="vm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="vm-modal-header">
          <h3 className="vm-modal-title">
            {isEditMode ? "Edit Vehicle Details" : "Add Commercial Vehicle"}
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
            <div className="vm-form-grid-2">
              {/* Registration Number */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleReg">
                  Registration Number <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="vehicleReg"
                  name="registrationNumber"
                  type="text"
                  className={`vm-form-input ${errors.registrationNumber ? "has-error" : ""}`}
                  placeholder="e.g. PB10AB1234"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
                {errors.registrationNumber && (
                  <span className="vm-form-error">{errors.registrationNumber}</span>
                )}
              </div>

              {/* Vehicle Model */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleModel">
                  Vehicle Model <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="vehicleModel"
                  name="model"
                  type="text"
                  className={`vm-form-input ${errors.model ? "has-error" : ""}`}
                  placeholder="e.g. Toyota Innova Crysta"
                  value={formData.model}
                  onChange={handleChange}
                />
                {errors.model && (
                  <span className="vm-form-error">{errors.model}</span>
                )}
              </div>

              {/* Manufacturing Year */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleYear">
                  Manufacturing Year <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="vehicleYear"
                  name="year"
                  type="number"
                  className={`vm-form-input ${errors.year ? "has-error" : ""}`}
                  placeholder="2023"
                  value={formData.year}
                  onChange={handleChange}
                />
                {errors.year && (
                  <span className="vm-form-error">{errors.year}</span>
                )}
              </div>

              {/* Seating Capacity */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleSeats">
                  Seating Capacity <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="vehicleSeats"
                  name="seatingCapacity"
                  type="number"
                  className={`vm-form-input ${errors.seatingCapacity ? "has-error" : ""}`}
                  placeholder="e.g. 7"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                />
                {errors.seatingCapacity && (
                  <span className="vm-form-error">{errors.seatingCapacity}</span>
                )}
              </div>

              {/* Fuel Type */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleFuel">
                  Fuel Type <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="vehicleFuel"
                  name="fuelType"
                  className={`vm-form-select ${errors.fuelType ? "has-error" : ""}`}
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.fuelType && (
                  <span className="vm-form-error">{errors.fuelType}</span>
                )}
              </div>

              {/* Operating Vendor */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleVendor">
                  Operating Vendor <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="vehicleVendor"
                  name="vendorId"
                  className={`vm-form-select ${errors.vendorId ? "has-error" : ""}`}
                  value={formData.vendorId}
                  onChange={handleChange}
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.level || "Vendor"})
                    </option>
                  ))}
                </select>
                {errors.vendorId && (
                  <span className="vm-form-error">{errors.vendorId}</span>
                )}
              </div>

              {/* Assigned Driver (Optional) */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleDriver">
                  Assign Driver (Optional)
                </label>
                <select
                  id="vehicleDriver"
                  name="driverId"
                  className={`vm-form-select ${errors.driverId ? "has-error" : ""}`}
                  value={formData.driverId || ""}
                  onChange={handleChange}
                >
                  <option value="">-- No Driver (Unassigned) --</option>
                  {drivers.map((d) => {
                    const isCurrentVehicleDriver =
                      initialVehicle && initialVehicle.driverId === d.id;
                    const availability = checkDriverAvailability(
                      drivers,
                      allVehicles,
                      d.id,
                      initialVehicle?.id
                    );

                    return (
                      <option
                        key={d.id}
                        value={d.id}
                        disabled={!availability.available && !isCurrentVehicleDriver}
                      >
                        {d.name} ({d.phone})
                        {!availability.available && !isCurrentVehicleDriver
                          ? ` — [Unavailable: ${availability.conflictingVehicle?.registrationNumber}]`
                          : ""}
                      </option>
                    );
                  })}
                </select>
                {errors.driverId && (
                  <span className="vm-form-error">{errors.driverId}</span>
                )}
              </div>

              {/* Status */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="vehicleStatus">
                  Operational Status <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="vehicleStatus"
                  name="status"
                  className="vm-form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active (Eligible for Shifts)</option>
                  <option value="inactive">Inactive (Grounded / Off-duty)</option>
                  <option value="non-compliant">Non-Compliant (Inspection Needed)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="vm-modal-footer">
            <button
              type="button"
              className="vh-btn vh-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="vh-btn vh-btn-primary">
              {isEditMode ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
