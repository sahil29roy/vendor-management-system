import React, { useState } from "react";
import VendorBasicInfo from "./VendorBasicInfo";
import VendorHierarchy from "./VendorHierarchy";
import VendorPermissions from "./VendorPermissions";
import VendorAddress from "./VendorAddress";

const INITIAL_FORM_STATE = {
  name: "",
  vendorCode: "",
  contactPerson: "",
  email: "",
  phone: "",
  company: "",
  level: "",
  parentId: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  status: "active",
};

const DEFAULT_PERMISSIONS = [
  "Fleet Management",
  "Driver Management",
  "Vehicle Management",
];

export default function VendorForm({
  existingVendors = [],
  admin = { id: "admin-001", name: "FleetHub Admin", role: "Super Vendor" },
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [delegatedAccess, setDelegatedAccess] = useState(false);
  const [delegatedPermissions, setDelegatedPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-set parent if user selects Regional Vendor (always reports to Super Vendor)
      if (name === "level") {
        if (value === "Regional Vendor") {
          updated.parentId = admin.id;
        } else {
          updated.parentId = "";
        }
      }
      return updated;
    });

    // Clear error for this field on input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Standard permissions toggle
  const handlePermissionToggle = (permId) => {
    setPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((item) => item !== permId)
        : [...prev, permId]
    );
  };

  // Delegated permissions toggle
  const handleDelegatedPermissionToggle = (permId) => {
    setDelegatedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((item) => item !== permId)
        : [...prev, permId]
    );
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Vendor Name
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Vendor name is required.";
    }

    // 2. Vendor Code
    const trimmedCode = (formData.vendorCode || "").trim().toUpperCase();
    if (!trimmedCode) {
      newErrors.vendorCode = "Vendor code is required.";
    } else {
      const isDuplicate = existingVendors.some(
        (v) =>
          (v.id && v.id.toUpperCase() === trimmedCode) ||
          (v.vendorCode && v.vendorCode.toUpperCase() === trimmedCode)
      );
      if (isDuplicate) {
        newErrors.vendorCode = "Vendor code must be unique. This code is already in use.";
      }
    }

    // 3. Contact Person
    if (!formData.contactPerson || !formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required.";
    }

    // 4. Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 5. Phone Number
    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    // 6. Vendor Level
    if (!formData.level) {
      newErrors.level = "Please select a vendor level.";
    }

    // 7. Parent Vendor
    if (!formData.parentId) {
      newErrors.parentId = "Please select a parent vendor.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      // Find the first error element to scroll into view
      const firstErrorField = document.querySelector(".has-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return;
    }

    // Generate practical vendor object
    const vendorId =
      formData.vendorCode.trim().toLowerCase().startsWith("vendor-")
        ? formData.vendorCode.trim().toLowerCase()
        : `vendor-00${existingVendors.length + 1}`;

    const newVendor = {
      id: vendorId,
      vendorCode: formData.vendorCode.trim().toUpperCase(),
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim() || formData.name.trim(),
      parentId: formData.parentId,
      level: formData.level,
      location:
        formData.city && formData.state
          ? `${formData.city.trim()}, ${formData.state.trim()}`
          : formData.city || formData.address || "India",
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim() || "India",
      status: formData.status,
      vehicleCount: 0,
      driverCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      permissions: permissions,
      delegatedAccess: delegatedAccess,
      delegatedPermissions: delegatedAccess ? delegatedPermissions : [],
    };

    if (onSubmit) {
      onSubmit(newVendor);
    }
  };

  return (
    <form className="vms-form-wrapper" onSubmit={handleSubmit} noValidate>
      {/* SECTION 1: Basic Information */}
      <VendorBasicInfo
        formData={formData}
        errors={errors}
        onChange={handleInputChange}
      />

      {/* SECTION 2: Vendor Hierarchy */}
      <VendorHierarchy
        formData={formData}
        errors={errors}
        onChange={handleInputChange}
        existingVendors={existingVendors}
        admin={admin}
      />

      {/* SECTION 3: Access and Permissions */}
      <VendorPermissions
        selectedPermissions={permissions}
        delegatedAccess={delegatedAccess}
        delegatedPermissions={delegatedPermissions}
        onPermissionToggle={handlePermissionToggle}
        onDelegatedAccessToggle={setDelegatedAccess}
        onDelegatedPermissionToggle={handleDelegatedPermissionToggle}
      />

      {/* SECTION 4: Contact / Address */}
      <VendorAddress formData={formData} onChange={handleInputChange} />

      {/* SECTION 5: Status */}
      <div className="vms-section">
        <div className="vms-section-header">
          <h2 className="vms-section-title">Section 5 — Account Status</h2>
          <p className="vms-section-desc">
            Define whether this vendor is authorized to operate upon account creation.
          </p>
        </div>

        <div className="vms-radio-group">
          <label className="vms-radio-label">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === "active"}
              onChange={handleInputChange}
            />
            <span>
              <strong>Active</strong> (Vendor account is enabled and immediately
              eligible for fleet and booking dispatch)
            </span>
          </label>

          <label className="vms-radio-label">
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={formData.status === "inactive"}
              onChange={handleInputChange}
            />
            <span>
              <strong>Inactive</strong> (Hold operations; vendor cannot accept
              commute bookings or assign trips)
            </span>
          </label>
        </div>
      </div>

      {/* SECTION 6: Form Actions */}
      <div className="vms-form-actions">
        <button
          type="button"
          className="vms-btn vms-btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="vms-btn vms-btn-primary">
          Create Vendor
        </button>
      </div>
    </form>
  );
}
