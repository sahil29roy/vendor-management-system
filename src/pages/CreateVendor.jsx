import React, { useState } from "react";
import VendorForm from "../components/vendors/VendorForm";

export default function CreateVendor({
  existingVendors,
  admin,
  onVendorCreated,
  onCancel,
}) {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFormSubmit = (newVendor) => {
    if (onVendorCreated) {
      onVendorCreated(newVendor);
    }
    setSuccessMessage(`Vendor "${newVendor.name}" (${newVendor.vendorCode}) created successfully.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateAnother = () => {
    setSuccessMessage(null);
  };

  return (
    <div className="vms-page-container">
      {/* Navigation & Header */}
      <div className="vms-page-header">
        <button
          type="button"
          className="vms-back-action"
          onClick={onCancel}
        >
          &larr; Back to Vendor Directory
        </button>

        <div className="vms-page-title-row">
          <div>
            <h1 className="vms-page-title">Create Vendor</h1>
            <p className="vms-page-subtitle">
              Add a new vendor and assign them to the appropriate management hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="vms-alert-success" role="alert">
          <div>
            <span className="vms-alert-success-title">&#10003; Success: </span>
            {successMessage}
          </div>
          <div className="vms-alert-actions">
            <button
              type="button"
              className="vms-alert-btn"
              onClick={handleCreateAnother}
            >
              Create Another
            </button>
            <button
              type="button"
              className="vms-alert-btn"
              style={{ fontWeight: 600 }}
              onClick={onCancel}
            >
              View in Vendor List &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Form Component */}
      {!successMessage ? (
        <VendorForm
          existingVendors={existingVendors}
          admin={admin}
          onSubmit={handleFormSubmit}
          onCancel={onCancel}
        />
      ) : (
        <div
          className="vms-section"
          style={{ maxWidth: "860px", textAlign: "center", padding: "40px 20px" }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
            Vendor Profile Registered
          </h3>
          <p style={{ color: "#4b5563", fontSize: "13px", marginBottom: "20px" }}>
            The new vendor has been added to the management hierarchy and permissions
            have been assigned.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              className="vms-btn vms-btn-secondary"
              onClick={handleCreateAnother}
            >
              + Create Another Vendor
            </button>
            <button
              type="button"
              className="vms-btn vms-btn-primary"
              onClick={onCancel}
            >
              Return to Vendor Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
