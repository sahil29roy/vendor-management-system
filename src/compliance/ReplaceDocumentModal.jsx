import React, { useState, useEffect } from "react";
import { formatDocDate, getDocumentStatus } from "../utils/complianceUtils";

export default function ReplaceDocumentModal({
  isOpen,
  document: doc,
  onClose,
  onReplace,
}) {
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && doc) {
      setDocumentNumber(doc.documentNumber || "");
      // Default issue date to today
      const todayStr = new Date().toISOString().split("T")[0];
      setIssueDate(todayStr);
      setExpiryDate("");
      setFileName("");
      setErrors({});
    }
  }, [isOpen, doc]);

  if (!isOpen || !doc) return null;

  const currentStatus = getDocumentStatus(doc.expiryDate);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const validate = () => {
    const errs = {};
    if (!documentNumber.trim()) {
      errs.documentNumber = "Document number is required.";
    }
    if (!issueDate) {
      errs.issueDate = "Issue date is required.";
    }
    if (!expiryDate) {
      errs.expiryDate = "Expiry date is required.";
    }
    if (issueDate && expiryDate) {
      if (new Date(expiryDate) <= new Date(issueDate)) {
        errs.expiryDate = "Expiry date must be after issue date.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedDoc = {
      ...doc,
      documentNumber: documentNumber.trim(),
      issueDate,
      expiryDate,
      fileName: fileName || `${doc.type.replace(/\s+/g, "_")}_renewed.pdf`,
      replacedAt: new Date().toISOString(),
      previousDocNumber: doc.documentNumber,
      previousExpiryDate: doc.expiryDate,
    };

    onReplace(doc.id, updatedDoc);
    onClose();
  };

  return (
    <div className="comp-modal-backdrop" onClick={onClose}>
      <div
        className="comp-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="comp-modal-header">
          <h3 className="comp-modal-title">Renew / Replace Document</h3>
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

        <form onSubmit={handleSubmit}>
          <div className="comp-modal-body">
            {/* Existing Document Banner */}
            <div
              style={{
                backgroundColor: currentStatus === "expired" ? "#fef2f2" : "#fffbeb",
                border: `1px solid ${currentStatus === "expired" ? "#fecaca" : "#fde68a"}`,
                borderRadius: "6px",
                padding: "12px 14px",
                fontSize: "12px",
              }}
            >
              <div style={{ fontWeight: 600, color: currentStatus === "expired" ? "#991b1b" : "#92400e" }}>
                Replacing {doc.type} (#{doc.documentNumber})
              </div>
              <div style={{ color: "#4b5563", marginTop: "2px" }}>
                Previous Issue: {formatDocDate(doc.issueDate)} &bull; Previous Expiry: {formatDocDate(doc.expiryDate)}
              </div>
            </div>

            {/* New Document Number */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                New Certificate / Document Number *
              </label>
              <input
                type="text"
                className="comp-search-input"
                placeholder="Enter updated certificate or licence number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              {errors.documentNumber && (
                <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.documentNumber}
                </div>
              )}
            </div>

            {/* Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  New Issue Date *
                </label>
                <input
                  type="date"
                  className="comp-search-input"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
                {errors.issueDate && (
                  <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                    {errors.issueDate}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  New Expiry Date *
                </label>
                <input
                  type="date"
                  className="comp-search-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                {errors.expiryDate && (
                  <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                    {errors.expiryDate}
                  </div>
                )}
              </div>
            </div>

            {/* File simulation */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                New Digital Copy (Simulated Upload)
              </label>
              <input
                type="file"
                className="comp-search-input"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                {fileName ? `File: ${fileName}` : "Optional renewed document attachment."}
              </div>
            </div>
          </div>

          <div className="comp-modal-footer">
            <button
              type="button"
              className="comp-btn comp-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="comp-btn comp-btn-primary">
              Confirm Renewal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
