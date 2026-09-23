import React, { useState, useEffect } from "react";
import {
  isLicenseUnique,
  isVehicleAvailableForDriver,
  getAvailableVehiclesForVendor,
} from "../utils/driverUtils";

const INITIAL_DRIVER_STATE = {
  name: "",
  phone: "",
  email: "",
  licenseNumber: "",
  licenseExpiry: "",
  vendorId: "",
  vehicleId: "",
  availability: "Available",
  verification: "Verified",
  status: "active",
};

export default function DriverForm({
  isOpen,
  initialDriver = null,
  allDrivers = [],
  vendors = [],
  vehicles = [],
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(INITIAL_DRIVER_STATE);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialDriver && initialDriver.id);

  // Preload data if editing
  useEffect(() => {
    if (initialDriver) {
      setFormData({
        name: initialDriver.name || "",
        phone: initialDriver.phone || "",
        email: initialDriver.email || "",
        licenseNumber: initialDriver.licenseNumber || "",
        licenseExpiry: initialDriver.licenseExpiry || "",
        vendorId: initialDriver.vendorId || "",
        vehicleId: initialDriver.vehicleId || "",
        availability: initialDriver.availability || "Available",
        verification: initialDriver.verification || "Verified",
        status: initialDriver.status || "active",
      });
      setErrors({});
    } else {
      setFormData(INITIAL_DRIVER_STATE);
      setErrors({});
    }
  }, [initialDriver, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If vendor changes, reset vehicle selection because cross-vendor assignment is strictly prohibited!
      if (name === "vendorId" && value !== prev.vendorId) {
        updated.vehicleId = "";
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Full Name
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Driver full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters.";
    }

    // 2. Phone
    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    // 3. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 4. DL Number
    const lic = (formData.licenseNumber || "").trim().toUpperCase();
    if (!lic) {
      newErrors.licenseNumber = "Driving Licence (DL) number is required.";
    } else if (!isLicenseUnique(allDrivers, lic, initialDriver?.id)) {
      newErrors.licenseNumber = "Driver with this licence number already exists.";
    }

    // 5. DL Expiry
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "DL expiry date is required.";
    }

    // 6. Vendor
    if (!formData.vendorId) {
      newErrors.vendorId = "Every driver must belong to an authorized vendor.";
    }

    // 7. Vehicle Assignment Validation
    if (formData.vehicleId) {
      const check = isVehicleAvailableForDriver(
        vehicles,
        allDrivers,
        formData.vehicleId,
        formData.vendorId,
        initialDriver?.id
      );
      if (!check.available) {
        newErrors.vehicleId = check.reason;
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
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      licenseNumber: formData.licenseNumber.trim().toUpperCase(),
      vehicleId: formData.vehicleId || null,
    };

    if (isEditMode) {
      onSubmit({ ...initialDriver, ...payload });
    } else {
      const newDriverId = `driver-${String(allDrivers.length + 1).padStart(3, "0")}`;
      onSubmit({ id: newDriverId, ...payload });
    }

    onClose();
  };

  // Filter vehicles belonging strictly to the selected vendor
  const vendorVehicles = getAvailableVehiclesForVendor(
    vehicles,
    formData.vendorId,
    initialDriver?.id
  );

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
            {isEditMode ? "Edit Driver Profile" : "Onboard Commercial Driver"}
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
              {/* Full Name */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverName">
                  Full Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="driverName"
                  name="name"
                  type="text"
                  className={`vm-form-input ${errors.name ? "has-error" : ""}`}
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="vm-form-error">{errors.name}</span>}
              </div>

              {/* Phone */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverPhone">
                  Phone Number <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="driverPhone"
                  name="phone"
                  type="tel"
                  className={`vm-form-input ${errors.phone ? "has-error" : ""}`}
                  placeholder="e.g. +91 98765 10001"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="vm-form-error">{errors.phone}</span>}
              </div>

              {/* Email */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverEmail">
                  Email Address
                </label>
                <input
                  id="driverEmail"
                  name="email"
                  type="email"
                  className={`vm-form-input ${errors.email ? "has-error" : ""}`}
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="vm-form-error">{errors.email}</span>}
              </div>

              {/* DL Number */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverDL">
                  Driving Licence Number <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="driverDL"
                  name="licenseNumber"
                  type="text"
                  className={`vm-form-input ${errors.licenseNumber ? "has-error" : ""}`}
                  placeholder="e.g. PB1020230012345"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
                {errors.licenseNumber && (
                  <span className="vm-form-error">{errors.licenseNumber}</span>
                )}
              </div>

              {/* DL Expiry Date */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverDLExpiry">
                  DL Expiry Date <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="driverDLExpiry"
                  name="licenseExpiry"
                  type="date"
                  className={`vm-form-input ${errors.licenseExpiry ? "has-error" : ""}`}
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                />
                {errors.licenseExpiry && (
                  <span className="vm-form-error">{errors.licenseExpiry}</span>
                )}
              </div>

              {/* Vendor Assignment */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverVendor">
                  Contracted Vendor <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="driverVendor"
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

              {/* Vehicle Assignment (Vendor-Scoped) */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverVehicle">
                  Assign Vehicle (Optional)
                </label>
                <select
                  id="driverVehicle"
                  name="vehicleId"
                  className={`vm-form-select ${errors.vehicleId ? "has-error" : ""}`}
                  value={formData.vehicleId || ""}
                  onChange={handleChange}
                  disabled={!formData.vendorId}
                >
                  <option value="">
                    {!formData.vendorId
                      ? "-- Select Vendor First --"
                      : "-- No Vehicle (Unassigned) --"}
                  </option>
                  {vendorVehicles.map((v) => (
                    <option
                      key={v.id}
                      value={v.id}
                      disabled={!v.isAvailable && v.id !== initialDriver?.vehicleId}
                    >
                      {v.registrationNumber} — {v.model} ({v.fuelType})
                      {!v.isAvailable && v.id !== initialDriver?.vehicleId
                        ? " [Assigned to another driver]"
                        : ""}
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <span className="vm-form-error">{errors.vehicleId}</span>
                )}
                {!errors.vehicleId && formData.vendorId && (
                  <span className="vm-subtitle" style={{ fontSize: "11px" }}>
                    Only showing vehicles belonging to the selected vendor.
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverAvail">
                  Availability Status
                </label>
                <select
                  id="driverAvail"
                  name="availability"
                  className="vm-form-select"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Available">Available (Ready for Shift)</option>
                  <option value="On Trip">On Trip (Active Commute)</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              {/* Verification */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverVerif">
                  Driver Verification
                </label>
                <select
                  id="driverVerif"
                  name="verification"
                  className="vm-form-select"
                  value={formData.verification}
                  onChange={handleChange}
                >
                  <option value="Verified">Verified (Background &amp; DL Checked)</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Status */}
              <div className="vm-form-group">
                <label className="vm-form-label" htmlFor="driverStatus">
                  Account Status
                </label>
                <select
                  id="driverStatus"
                  name="status"
                  className="vm-form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active (Permitted to Drive)</option>
                  <option value="inactive">Inactive (Suspended / Grounded)</option>
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
              {isEditMode ? "Save Changes" : "Add Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
