import React from "react";

export default function VendorHierarchy({
  formData,
  errors,
  onChange,
  existingVendors = [],
  admin = { id: "admin-001", name: "FleetHub Admin", role: "Super Vendor" },
}) {
  // Determine eligible parent candidates based on selected vendor level:
  // Super Vendor -> Regional Vendor -> City Vendor -> Local Vendor
  const getEligibleParents = () => {
    if (!formData.level) return [];

    if (formData.level === "Regional Vendor") {
      // Regional Vendors report directly to Super Vendor (Admin)
      return [
        {
          id: admin.id,
          name: admin.name,
          level: admin.role,
          location: "Central Headquarters",
        },
      ];
    }

    if (formData.level === "City Vendor") {
      // City Vendors report to active Regional Vendors
      return existingVendors.filter(
        (v) => v.level === "Regional Vendor" && v.status === "active"
      );
    }

    if (formData.level === "Local Vendor") {
      // Local Vendors report to City Vendors (or Regional Vendors)
      const cityVendors = existingVendors.filter(
        (v) => v.level === "City Vendor" && v.status === "active"
      );
      const regionalVendors = existingVendors.filter(
        (v) => v.level === "Regional Vendor" && v.status === "active"
      );
      return [...cityVendors, ...regionalVendors];
    }

    return [];
  };

  const eligibleParents = getEligibleParents();

  return (
    <div className="vms-section">
      <div className="vms-section-header">
        <h2 className="vms-section-title">Section 2 — Vendor Hierarchy</h2>
        <p className="vms-section-desc">
          Position the vendor within the organization's multi-tier operating structure.
        </p>
      </div>

      <div className="vms-grid-2">
        {/* Vendor Level */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="vendorLevel">
            Vendor Level <span className="vms-required">*</span>
          </label>
          <select
            id="vendorLevel"
            name="level"
            className={`vms-select ${errors.level ? "has-error" : ""}`}
            value={formData.level || ""}
            onChange={onChange}
            aria-invalid={errors.level ? "true" : "false"}
          >
            <option value="">-- Select Vendor Level --</option>
            <option value="Regional Vendor">Regional Vendor</option>
            <option value="City Vendor">City Vendor</option>
            <option value="Local Vendor">Local Vendor</option>
          </select>
          {errors.level && <p className="vms-error-text">{errors.level}</p>}
        </div>

        {/* Parent Vendor / Manager */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="parentId">
            Parent Vendor / Manager <span className="vms-required">*</span>
          </label>
          <select
            id="parentId"
            name="parentId"
            className={`vms-select ${errors.parentId ? "has-error" : ""}`}
            value={formData.parentId || ""}
            onChange={onChange}
            disabled={!formData.level}
            aria-invalid={errors.parentId ? "true" : "false"}
          >
            <option value="">
              {!formData.level
                ? "-- Select Vendor Level First --"
                : "-- Select Parent Vendor --"}
            </option>
            {eligibleParents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name} ({parent.level || "Vendor"}
                {parent.location ? ` - ${parent.location}` : ""})
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="vms-error-text">{errors.parentId}</p>
          )}
          {!errors.parentId && formData.level && (
            <p className="vms-helper-text">
              {eligibleParents.length} eligible parent(s) available for{" "}
              {formData.level}.
            </p>
          )}
        </div>

        {/* Hierarchy Context Info Box */}
        <div className="vms-grid-full">
          <div className="vms-hierarchy-hint-box">
            <div className="vms-hierarchy-hint-title">
              Hierarchy Rules & Governance
            </div>
            <p>
              <strong>Order:</strong> Super Vendor &rarr; Regional Vendor &rarr;
              City Vendor &rarr; Local Vendor
            </p>
            <p style={{ marginTop: "4px" }}>
              {formData.level === "Regional Vendor" && (
                <span>
                  Regional Vendors are top-tier operational entities and report
                  directly to <strong>{admin.name} ({admin.role})</strong>.
                </span>
              )}
              {formData.level === "City Vendor" && (
                <span>
                  City Vendors operate within a specific metropolitan market and
                  must be assigned to an active <strong>Regional Vendor</strong>.
                </span>
              )}
              {formData.level === "Local Vendor" && (
                <span>
                  Local Vendors manage zone-specific fleet operations and report
                  to a <strong>City Vendor</strong> or Regional Vendor.
                </span>
              )}
              {!formData.level && (
                <span>
                  Select a vendor level above to see permissible reporting lines
                  and valid parent organizations.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
