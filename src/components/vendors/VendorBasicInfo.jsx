import React from "react";

export default function VendorBasicInfo({ formData, errors, onChange }) {
  return (
    <div className="vms-section">
      <div className="vms-section-header">
        <h2 className="vms-section-title">Section 1 — Basic Information</h2>
        <p className="vms-section-desc">
          General business entity credentials and primary contact details.
        </p>
      </div>

      <div className="vms-grid-2">
        {/* Vendor Name */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="vendorName">
            Vendor Name <span className="vms-required">*</span>
          </label>
          <input
            id="vendorName"
            name="name"
            type="text"
            className={`vms-input ${errors.name ? "has-error" : ""}`}
            placeholder="Enter vendor name"
            value={formData.name || ""}
            onChange={onChange}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && <p className="vms-error-text">{errors.name}</p>}
        </div>

        {/* Vendor Code */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="vendorCode">
            Vendor Code <span className="vms-required">*</span>
          </label>
          <input
            id="vendorCode"
            name="vendorCode"
            type="text"
            className={`vms-input ${errors.vendorCode ? "has-error" : ""}`}
            placeholder="Enter vendor code"
            value={formData.vendorCode || ""}
            onChange={onChange}
            aria-invalid={errors.vendorCode ? "true" : "false"}
          />
          {errors.vendorCode && (
            <p className="vms-error-text">{errors.vendorCode}</p>
          )}
          {!errors.vendorCode && (
            <p className="vms-helper-text">Must be a unique code (e.g. VEN-007).</p>
          )}
        </div>

        {/* Contact Person */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="contactPerson">
            Contact Person <span className="vms-required">*</span>
          </label>
          <input
            id="contactPerson"
            name="contactPerson"
            type="text"
            className={`vms-input ${errors.contactPerson ? "has-error" : ""}`}
            placeholder="Enter contact person name"
            value={formData.contactPerson || ""}
            onChange={onChange}
            aria-invalid={errors.contactPerson ? "true" : "false"}
          />
          {errors.contactPerson && (
            <p className="vms-error-text">{errors.contactPerson}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="email">
            Email Address <span className="vms-required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`vms-input ${errors.email ? "has-error" : ""}`}
            placeholder="Enter email address"
            value={formData.email || ""}
            onChange={onChange}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="vms-error-text">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="phone">
            Phone Number <span className="vms-required">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`vms-input ${errors.phone ? "has-error" : ""}`}
            placeholder="Enter phone number"
            value={formData.phone || ""}
            onChange={onChange}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && <p className="vms-error-text">{errors.phone}</p>}
        </div>

        {/* Company / Organization Name */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="company">
            Company / Organization Name
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="vms-input"
            placeholder="Enter registered organization name"
            value={formData.company || ""}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
