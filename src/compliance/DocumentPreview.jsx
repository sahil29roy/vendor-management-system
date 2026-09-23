import React from "react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { getDocumentStatus, formatDocDate, formatExpiryDescription } from "../utils/complianceUtils";

export default function DocumentPreview({ isOpen, document: doc, onClose }) {
  if (!isOpen || !doc) return null;

  const dynamicStatus = getDocumentStatus(doc.expiryDate);

  return (
    <div className="comp-modal-backdrop" onClick={onClose}>
      <div
        className="comp-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="comp-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 className="comp-modal-title">Document Preview: {doc.type}</h3>
            <DocumentStatusBadge status={dynamicStatus} />
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4b5563" }}>
            <div>
              <strong>Doc Number:</strong> {doc.documentNumber}
            </div>
            <div>
              <strong>Issued:</strong> {formatDocDate(doc.issueDate)}
            </div>
            <div>
              <strong>Expires:</strong> {formatDocDate(doc.expiryDate)}
            </div>
          </div>

          {/* Simulated Document Preview Area */}
          <div className="comp-preview-box">
            <div style={{ fontSize: "36px" }}>📄</div>
            <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>
              {doc.type} — {doc.documentNumber}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Digital certificate metadata verified.
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                backgroundColor: "#f1f5f9",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#475569",
              }}
            >
              Notice: Document preview unavailable for mock records.
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              padding: "10px 14px",
              borderRadius: "6px",
              backgroundColor: dynamicStatus === "expired" ? "#fef2f2" : "#f8fafc",
              border: `1px solid ${dynamicStatus === "expired" ? "#fecaca" : "#e2e8f0"}`,
              color: dynamicStatus === "expired" ? "#991b1b" : "#475569",
            }}
          >
            <strong>Validity Status:</strong> {formatExpiryDescription(doc.expiryDate)}
          </div>
        </div>

        <div className="comp-modal-footer">
          <button
            type="button"
            className="comp-btn comp-btn-secondary"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
