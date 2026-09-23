import React, { useState, useEffect } from "react";

const DEFAULT_OPERATIONAL_PERMISSIONS = [
  { id: "fleet_onboarding", name: "Fleet Onboarding", default: true },
  { id: "driver_onboarding", name: "Driver Onboarding", default: true },
  { id: "driver_verification", name: "Driver Verification", default: true },
  { id: "vehicle_management", name: "Vehicle Management", default: true },
  { id: "document_verification", name: "Document Verification", default: false },
  { id: "operational_tasks", name: "Operational Tasks", default: true },
];

export default function HierarchyDetails({
  selectedVendor,
  parentVendor,
  directChildren = [],
  vehicles = [],
  drivers = [],
  onSelectVendor,
  onOpenMoveModal,
  onEditVendor,
}) {
  // Local state for toggling permissions for the selected vendor
  const [vendorPermissions, setVendorPermissions] = useState({});

  useEffect(() => {
    if (!selectedVendor) return;
    // Initialize or load permissions for selected vendor
    setVendorPermissions((prev) => {
      if (prev[selectedVendor.id]) return prev;
      const initial = {};
      DEFAULT_OPERATIONAL_PERMISSIONS.forEach((p) => {
        initial[p.id] = p.default;
      });
      return { ...prev, [selectedVendor.id]: initial };
    });
  }, [selectedVendor]);

  if (!selectedVendor) {
    return (
      <div className="vh-details-card">
        <div className="vh-empty-state">
          <div className="vh-empty-state-title">No Vendor Selected</div>
          <p style={{ fontSize: "13px" }}>
            Click on any organization in the hierarchy tree to inspect its reporting structure,
            fleet metrics, and delegated permissions.
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = selectedVendor.isAdmin || selectedVendor.id === "admin-001";
  const currentPerms = vendorPermissions[selectedVendor.id] || {};

  const handleTogglePermission = (permId) => {
    setVendorPermissions((prev) => ({
      ...prev,
      [selectedVendor.id]: {
        ...prev[selectedVendor.id],
        [permId]: !prev[selectedVendor.id]?.[permId],
      },
    }));
  };

  // Calculate dynamic vehicle and driver count from mock datasets
  const actualVehicleCount = vehicles.filter(
    (v) => v.vendorId === selectedVendor.id
  ).length || selectedVendor.vehicleCount || 0;

  const actualDriverCount = drivers.filter(
    (d) => d.vendorId === selectedVendor.id
  ).length || selectedVendor.driverCount || 0;

  return (
    <div className="vh-details-card">
      {/* Header */}
      <div className="vh-details-header">
        {isAdmin && (
          <div className="vh-details-super-tag">Super Vendor &bull; Root Authority</div>
        )}
        <h2 className="vh-details-name">{selectedVendor.name}</h2>
        <div className="vh-details-tags">
          <span
            className={`vh-badge-pill ${
              isAdmin
                ? "vh-badge-super"
                : (selectedVendor.level || "").toLowerCase().includes("regional")
                ? "vh-badge-regional"
                : "vh-badge-city"
            }`}
          >
            {selectedVendor.level || selectedVendor.role || "Vendor"}
          </span>
          <span
            className={`vh-badge-pill`}
            style={{
              backgroundColor: selectedVendor.status === "inactive" ? "#f3f4f6" : "#ecfdf5",
              color: selectedVendor.status === "inactive" ? "#4b5563" : "#047857",
              border: selectedVendor.status === "inactive" ? "1px solid #d1d5db" : "1px solid #a7f3d0",
            }}
          >
            {selectedVendor.status === "inactive" ? "Inactive" : "Active"}
          </span>
          {selectedVendor.id && (
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              ID: {selectedVendor.id}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="vh-details-body">
        {/* Operational Metrics Grid */}
        <div className="vh-details-group">
          <span className="vh-details-group-title">Operational Capacity</span>
          <div className="vh-details-grid">
            <div className="vh-stat-item">
              <span className="vh-stat-label">Assigned Vehicles</span>
              <span className="vh-stat-val">{actualVehicleCount}</span>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-label">Assigned Drivers</span>
              <span className="vh-stat-val">{actualDriverCount}</span>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-label">Direct Sub-Vendors</span>
              <span className="vh-stat-val">{directChildren.length}</span>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-label">Location / Base</span>
              <span className="vh-stat-val" style={{ fontSize: "13px" }}>
                {selectedVendor.location || "Central"}
              </span>
            </div>
          </div>
        </div>

        {/* Reporting Parent */}
        <div className="vh-details-group">
          <span className="vh-details-group-title">Reporting Parent / Manager</span>
          <div className="vh-parent-box">
            <div>
              {parentVendor ? (
                <>
                  <div style={{ fontWeight: 600 }}>{parentVendor.name}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    {parentVendor.level || parentVendor.role} &bull; {parentVendor.location || "HQ"}
                  </div>
                </>
              ) : (
                <div style={{ fontStyle: "italic", color: "#6b7280" }}>
                  {isAdmin ? "Top-level Root Entity (No Parent)" : "Unassigned Parent"}
                </div>
              )}
            </div>

            {parentVendor && (
              <button
                type="button"
                className="vh-btn vh-btn-secondary"
                style={{ fontSize: "11px", padding: "3px 8px" }}
                onClick={() => onSelectVendor(parentVendor.id)}
              >
                Inspect Parent &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Direct Children Sub-Vendors */}
        <div className="vh-details-group">
          <span className="vh-details-group-title">
            Direct Sub-Vendors ({directChildren.length})
          </span>
          {directChildren.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic" }}>
              No child vendors reporting directly to this organization.
            </p>
          ) : (
            <ul className="vh-children-list">
              {directChildren.map((child) => (
                <li
                  key={child.id}
                  className="vh-child-item"
                  onClick={() => onSelectVendor(child.id)}
                  title="Click to view child details"
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{child.name}</span>
                    <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "6px" }}>
                      ({child.level || "Sub-Vendor"})
                    </span>
                  </div>
                  <span style={{ color: "#7c3aed", fontWeight: 600 }}>&rarr;</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Delegated Permissions */}
        <div className="vh-details-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="vh-details-group-title">Delegated Permissions</span>
            <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600 }}>
              {isAdmin ? "Full Admin Privileges" : "Operational Delegation"}
            </span>
          </div>

          <div className="vh-permissions-container">
            {DEFAULT_OPERATIONAL_PERMISSIONS.map((perm) => {
              const isChecked = currentPerms[perm.id] ?? perm.default;
              return (
                <div key={perm.id} className="vh-perm-row">
                  <span style={{ color: "#374151" }}>{perm.name}</span>
                  <label className="vh-toggle-switch">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isAdmin}
                      onChange={() => handleTogglePermission(perm.id)}
                    />
                    <span className="vh-slider" />
                  </label>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
            Toggle permissions to delegate operational onboarding and verification privileges.
          </p>
        </div>

        {/* Contact Information */}
        <div className="vh-details-group">
          <span className="vh-details-group-title">Contact & Record Info</span>
          <div style={{ fontSize: "12px", color: "#4b5563", display: "flex", flexDirection: "column", gap: "4px" }}>
            {selectedVendor.email && (
              <div>
                <strong>Email:</strong> {selectedVendor.email}
              </div>
            )}
            {selectedVendor.phone && (
              <div>
                <strong>Phone:</strong> {selectedVendor.phone}
              </div>
            )}
            {selectedVendor.createdAt && (
              <div>
                <strong>Onboarded:</strong> {selectedVendor.createdAt}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="vh-details-actions">
          {!isAdmin && (
            <button
              type="button"
              className="vh-btn vh-btn-primary"
              style={{ flex: 1 }}
              onClick={() => onOpenMoveModal(selectedVendor)}
            >
              Move Vendor in Hierarchy
            </button>
          )}
          {onEditVendor && (
            <button
              type="button"
              className="vh-btn vh-btn-secondary"
              onClick={() => onEditVendor(selectedVendor)}
            >
              View Directory
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
