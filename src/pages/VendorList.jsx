import React from "react";

export default function VendorList({
  vendors = [],
  admin,
  onCreateVendorClick,
  onViewHierarchyClick,
}) {
  const getParentName = (parentId) => {
    if (parentId === admin.id) {
      return `${admin.name} (Super Vendor)`;
    }
    const parent = vendors.find((v) => v.id === parentId);
    return parent ? `${parent.name} (${parent.level})` : parentId || "None";
  };

  const getLevelBadgeClass = (level) => {
    if (level === "Regional Vendor") return "vms-level-badge vms-level-regional";
    if (level === "City Vendor") return "vms-level-badge vms-level-city";
    if (level === "Local Vendor") return "vms-level-badge vms-level-local";
    return "vms-level-badge";
  };

  return (
    <div className="vms-page-container">
      {/* Page Header */}
      <div className="vms-page-header">
        <div className="vms-page-title-row">
          <div>
            <h1 className="vms-page-title">Vendor Directory</h1>
            <p className="vms-page-subtitle">
              Manage operating partners, hierarchical reporting structures, and fleet authorizations.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {onViewHierarchyClick && (
              <button
                type="button"
                className="vms-btn vms-btn-secondary"
                onClick={onViewHierarchyClick}
              >
                View Hierarchy Tree &rarr;
              </button>
            )}
            <button
              type="button"
              className="vms-btn vms-btn-primary"
              onClick={onCreateVendorClick}
            >
              + Create Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="vms-table-container">
        <table className="vms-table">
          <thead>
            <tr>
              <th>Vendor Name & Code</th>
              <th>Hierarchy Level</th>
              <th>Reporting Parent</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Fleet / Drivers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                  No vendors found in directory.
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <strong>{vendor.name}</strong>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      {vendor.vendorCode || vendor.id}
                    </div>
                  </td>
                  <td>
                    <span className={getLevelBadgeClass(vendor.level)}>
                      {vendor.level || "Regional Vendor"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", color: "#374151" }}>
                      {getParentName(vendor.parentId)}
                    </span>
                  </td>
                  <td>{vendor.location || "—"}</td>
                  <td>
                    <div>{vendor.contactPerson || "—"}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      {vendor.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {vendor.vehicleCount ?? 0}
                    </span>{" "}
                    vehicles &bull;{" "}
                    <span style={{ fontWeight: 600 }}>
                      {vendor.driverCount ?? 0}
                    </span>{" "}
                    drivers
                  </td>
                  <td>
                    <span
                      className={`vms-status-badge ${
                        vendor.status === "active"
                          ? "vms-status-active"
                          : "vms-status-inactive"
                      }`}
                    >
                      {vendor.status || "active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
