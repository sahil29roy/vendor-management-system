import React, { useState } from "react";
import { canMoveVendor } from "../utils/hierarchyUtils";

export default function MoveVendorModal({
  isOpen,
  vendor,
  allVendors = [],
  admin,
  onClose,
  onConfirmMove,
}) {
  const [selectedParentId, setSelectedParentId] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isOpen || !vendor) return null;

  // Find current parent
  const currentParent =
    admin && (vendor.parentId === admin.id || !vendor.parentId)
      ? { id: admin.id, name: `${admin.name} (Super Vendor)` }
      : allVendors.find((v) => v.id === vendor.parentId) || {
          id: vendor.parentId,
          name: "Unknown / Root",
        };

  // Build eligible candidate list
  // Include Admin as Super Vendor root candidate
  const parentCandidates = [
    {
      id: admin.id,
      name: `${admin.name} (Super Vendor - Central HQ)`,
      level: "Super Vendor",
      status: "active",
    },
    ...allVendors,
  ];

  const handleParentSelect = (e) => {
    const newId = e.target.value;
    setSelectedParentId(newId);

    if (!newId) {
      setValidationError("Please select a target parent organization.");
      return;
    }

    // Run business validation
    const validation = canMoveVendor(allVendors, vendor.id, newId, admin);
    if (!validation.allowed) {
      setValidationError(validation.reason);
    } else {
      setValidationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedParentId) {
      setValidationError("Please select a new parent vendor.");
      return;
    }

    const validation = canMoveVendor(allVendors, vendor.id, selectedParentId, admin);
    if (!validation.allowed) {
      setValidationError(validation.reason);
      return;
    }

    onConfirmMove(vendor.id, selectedParentId);
    onClose();
  };

  return (
    <div className="vh-modal-backdrop" onClick={onClose}>
      <div
        className="vh-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-vendor-modal-title"
      >
        <div className="vh-modal-header">
          <h3 id="move-vendor-modal-title" className="vh-modal-title">
            Move Vendor in Hierarchy
          </h3>
          <button
            type="button"
            className="vh-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vh-modal-body">
            {/* Vendor Being Moved */}
            <div>
              <span className="vh-details-group-title">Vendor to Relocate</span>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginTop: "4px",
                  color: "#111827",
                  padding: "8px 12px",
                  backgroundColor: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  borderRadius: "6px",
                }}
              >
                {vendor.name}{" "}
                <span style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 500 }}>
                  ({vendor.level || "Vendor"})
                </span>
              </div>
            </div>

            {/* Current Parent */}
            <div>
              <span className="vh-details-group-title">Current Reporting Parent</span>
              <div
                style={{
                  fontSize: "13px",
                  marginTop: "4px",
                  color: "#4b5563",
                  padding: "8px 12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              >
                {currentParent.name}
              </div>
            </div>

            {/* New Parent Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                htmlFor="newParentSelect"
                style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}
              >
                Select New Parent Organization <span style={{ color: "#dc2626" }}>*</span>
              </label>

              <select
                id="newParentSelect"
                className="vh-search-input"
                style={{ padding: "8px 10px" }}
                value={selectedParentId}
                onChange={handleParentSelect}
              >
                <option value="">-- Choose target parent vendor --</option>
                {parentCandidates.map((candidate) => {
                  const check = canMoveVendor(allVendors, vendor.id, candidate.id, admin);
                  const isCurrent = vendor.parentId === candidate.id;
                  const isSelf = vendor.id === candidate.id;

                  return (
                    <option
                      key={candidate.id}
                      value={candidate.id}
                      disabled={!check.allowed}
                    >
                      {candidate.name} ({candidate.level || "Vendor"})
                      {isCurrent ? " — [Current Parent]" : ""}
                      {isSelf ? " — [Self: Cannot Move Under Self]" : ""}
                      {!check.allowed && !isCurrent && !isSelf
                        ? ` — [Invalid: ${check.reason}]`
                        : ""}
                    </option>
                  );
                })}
              </select>

              <p style={{ fontSize: "11px", color: "#6b7280" }}>
                Vendors cannot report to themselves or their own downstream child vendors.
              </p>
            </div>

            {/* Validation Error Message */}
            {validationError && (
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
                <strong>Hierarchy Rule Violation:</strong> {validationError}
              </div>
            )}

            {/* Hierarchy Safety Warning */}
            <div className="vh-callout-warning">
              <strong>Notice:</strong> Relocating this vendor will automatically update the
              reporting structure for all of its existing downstream child vendors.
            </div>
          </div>

          <div className="vh-modal-footer">
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
              disabled={!selectedParentId || !!validationError}
            >
              Confirm Relocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
