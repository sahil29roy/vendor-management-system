import React from "react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import {
  getDocumentStatus,
  formatDocDate,
  formatExpiryDescription,
  getDaysUntilExpiry,
} from "../utils/complianceUtils";

export default function DocumentDetails({
  isOpen,
  document: doc,
  vendors = [],
  vehicles = [],
  drivers = [],
  onClose,
  onPreview,
  onReplace,
}) {
  if (!isOpen || !doc) return null;

  const dynamicStatus = getDocumentStatus(doc.expiryDate);
  const days = getDaysUntilExpiry(doc.expiryDate);

  // Resolve owner and vendor
  let ownerName = "—";
  let vehiclePlate = "—";
  let vendorName = "—";

  if (doc.ownerType === "vehicle") {
    const v = vehicles.find((item) => item.id === doc.ownerId);
    if (v) {
      ownerName = `${v.registrationNumber} (${v.model})`;
      vehiclePlate = v.registrationNumber;
      const vend = vendors.find((item) => item.id === v.vendorId);
      if (vend) vendorName = vend.name;
    }
  } else if (doc.ownerType === "driver") {
    const d = drivers.find((item) => item.id === doc.ownerId);
    if (d) {
      ownerName = `${d.name} (${d.phone})`;
      const vend = vendors.find((item) => item.id === d.vendorId);
      if (vend) vendorName = vend.name;
      const v = vehicles.find((item) => item.id === d.vehicleId);
      if (v) vehiclePlate = v.registrationNumber;
    }
  }

  return (
    <div className="comp-modal-backdrop" onClick={onClose}>
      <div
        className="comp-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="comp-modal-header">
          <div>
            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>
              Document Details
            </span>
            <h3 className="comp-modal-title">{doc.type}</h3>
          </div>
          <button
            type="button"
            className="comp-reset-btn"
            style={{ padding: "4px 8px" }}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="comp-modal-body">
          {/* Status Alert Banner if expired or expiring */}
          {dynamicStatus === "expired" && (
            <div className="comp-alert-banner danger">
              <span>✕</span>
              <div>
                <strong>Document Expired!</strong> This document expired on {formatDocDate(doc.expiryDate)}. Immediate renewal required.
              </div>
            </div>
          )}

          {dynamicStatus === "expiring_soon" && (
            <div className="comp-alert-banner warning">
              <span>⚠️</span>
              <div>
                <strong>Renewal Needed:</strong> Document expires in {days} days ({formatDocDate(doc.expiryDate)}).
              </div>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              backgroundColor: "#f9fafb",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Document Number
              </span>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>
                {doc.documentNumber}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Status
              </span>
              <div>
                <DocumentStatusBadge status={dynamicStatus} />
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Owner Type
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                {doc.ownerType === "vehicle" ? "Commercial Vehicle" : "Active Driver"}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Associated Owner
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                {ownerName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Vendor Organization
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                {vendorName}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Vehicle Registration
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                <code>{vehiclePlate}</code>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Issue Date
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                {formatDocDate(doc.issueDate)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>
                Expiry Date
              </span>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
                {formatDocDate(doc.expiryDate)}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#6b7280" }}>Audit Validity Period:</span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {formatExpiryDescription(doc.expiryDate)}
            </span>
          </div>
        </div>

        <div className="comp-modal-footer">
          <button
            type="button"
            className="comp-btn comp-btn-secondary"
            onClick={() => onPreview && onPreview(doc)}
          >
            View Preview
          </button>
          <button
            type="button"
            className="comp-btn comp-btn-primary"
            onClick={() => {
              onClose();
              if (onReplace) onReplace(doc);
            }}
          >
            Renew / Replace
          </button>
        </div>
      </div>
    </div>
  );
}
