import React, { useState, useEffect } from "react";
import { normalizeDocType } from "../utils/complianceUtils";

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
  vehicles = [],
  drivers = [],
  existingDocuments = [],
  initialOwnerType = "vehicle",
  initialOwnerId = "",
}) {
  const [ownerType, setOwnerType] = useState(initialOwnerType);
  const [ownerId, setOwnerId] = useState(initialOwnerId);
  const [type, setType] = useState(initialOwnerType === "vehicle" ? "RC" : "Driving License");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setOwnerType(initialOwnerType);
      setOwnerId(initialOwnerId);
      setType(initialOwnerType === "vehicle" ? "RC" : "Driving License");
      setDocumentNumber("");
      setIssueDate("");
      setExpiryDate("");
      setSelectedFileName("");
      setErrors({});
    }
  }, [isOpen, initialOwnerType, initialOwnerId]);

  if (!isOpen) return null;

  const handleOwnerTypeChange = (newType) => {
    setOwnerType(newType);
    setOwnerId("");
    setType(newType === "vehicle" ? "RC" : "Driving License");
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const validate = () => {
    const errs = {};

    if (!ownerId) {
      errs.ownerId = "Please select an owner (vehicle or driver).";
    }

    if (!type) {
      errs.type = "Please select document type.";
    }

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

    // Duplicate check: Check if an active document of this normalized type already exists for this owner
    if (ownerId && type) {
      const normType = normalizeDocType(type);
      const duplicate = existingDocuments.find(
        (d) =>
          d.ownerId === ownerId &&
          normalizeDocType(d.type) === normType &&
          d.status !== "archived"
      );

      if (duplicate) {
        errs.type = `This ${ownerType} already has a registered ${type} (#${duplicate.documentNumber}). Please use "Renew / Replace" on that document instead.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let vehicleId = null;
    if (ownerType === "vehicle") {
      vehicleId = ownerId;
    } else {
      const d = drivers.find((item) => item.id === ownerId);
      if (d) vehicleId = d.vehicleId;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      ownerType,
      ownerId,
      vehicleId: vehicleId || undefined,
      type,
      documentNumber: documentNumber.trim(),
      issueDate,
      expiryDate,
      fileName: selectedFileName || `${type.replace(/\s+/g, "_")}_doc.pdf`,
      uploadedAt: new Date().toISOString(),
    };

    onUpload(newDoc);
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
          <h3 className="comp-modal-title">+ Register / Upload Document</h3>
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
            {/* Owner Type */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Target Owner Type *
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className={`comp-btn ${ownerType === "vehicle" ? "comp-btn-primary" : "comp-btn-secondary"}`}
                  style={{ flex: 1 }}
                  onClick={() => handleOwnerTypeChange("vehicle")}
                >
                  Commercial Vehicle
                </button>
                <button
                  type="button"
                  className={`comp-btn ${ownerType === "driver" ? "comp-btn-primary" : "comp-btn-secondary"}`}
                  style={{ flex: 1 }}
                  onClick={() => handleOwnerTypeChange("driver")}
                >
                  Active Driver
                </button>
              </div>
            </div>

            {/* Owner Selector */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Select {ownerType === "vehicle" ? "Vehicle" : "Driver"} *
              </label>
              <select
                className="comp-search-input"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="">-- Choose {ownerType === "vehicle" ? "Vehicle" : "Driver"} --</option>
                {ownerType === "vehicle"
                  ? vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} — {v.model}
                      </option>
                    ))
                  : drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone})
                      </option>
                    ))}
              </select>
              {errors.ownerId && (
                <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.ownerId}
                </div>
              )}
            </div>

            {/* Document Type */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Document Category *
              </label>
              <select
                className="comp-search-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {ownerType === "vehicle" ? (
                  <>
                    <option value="RC">RC (Registration Certificate)</option>
                    <option value="Permit">Commercial Permit</option>
                    <option value="Pollution Certificate">Pollution Certificate (PUC)</option>
                  </>
                ) : (
                  <option value="Driving License">Driving Licence (DL)</option>
                )}
              </select>
              {errors.type && (
                <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.type}
                </div>
              )}
            </div>

            {/* Document Number */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Document Number / Identifier *
              </label>
              <input
                type="text"
                className="comp-search-input"
                placeholder="e.g. PERMIT-PB10-092 or PB1020230012345"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              {errors.documentNumber && (
                <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.documentNumber}
                </div>
              )}
            </div>

            {/* Issue Date & Expiry Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Issue Date *
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
                  Expiry Date *
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

            {/* File Selection Simulation */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Upload Certificate / Copy (Browser Simulated)
              </label>
              <input
                type="file"
                className="comp-search-input"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                {selectedFileName
                  ? `Selected: ${selectedFileName}`
                  : "Supports PDF, JPG, PNG. Document will be registered in local state."}
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
              Register Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
