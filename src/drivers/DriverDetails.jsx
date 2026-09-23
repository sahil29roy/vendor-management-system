import React, { useState } from "react";
import DriverStatusBadge from "./DriverStatusBadge";
import DriverVerificationBadge from "./DriverVerificationBadge";
import {
  getVendorById,
  getVehicleById,
  getDriverDocuments,
  getLicenseStatus,
  formatDLDate,
} from "../utils/driverUtils";
import { getDriverComplianceStatus } from "../utils/complianceUtils";
import DocumentStatusBadge from "../compliance/DocumentStatusBadge";

export default function DriverDetails({
  isOpen,
  driver,
  vendors = [],
  vehicles = [],
  documents = [],
  admin,
  onClose,
  onEdit,
  onAssignVehicle,
  onNavigateToCompliance,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !driver) return null;

  const vendor = getVendorById(vendors, driver.vendorId, admin);
  const vehicle = getVehicleById(vehicles, driver.vehicleId);
  const driverDocs = getDriverDocuments(documents, driver.id);
  const dlStatus = getLicenseStatus(driver.licenseExpiry);
  const compliance = getDriverComplianceStatus(documents, driver.id);

  return (
    <div className="vm-modal-backdrop" onClick={onClose}>
      <div
        className="vm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="vm-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="vm-modal-title">{driver.name}</span>
            <DriverVerificationBadge verification={driver.verification} />
            <DriverStatusBadge status={driver.status} />
          </div>
          <button
            type="button"
            className="vm-alert-dismiss"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="vm-tabs-bar">
          <button
            type="button"
            className={`vm-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`vm-tab-btn ${activeTab === "vehicle" ? "active" : ""}`}
            onClick={() => setActiveTab("vehicle")}
          >
            Assigned Vehicle
          </button>
          <button
            type="button"
            className={`vm-tab-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Documents ({driverDocs.length})
          </button>
          <button
            type="button"
            className={`vm-tab-btn ${activeTab === "compliance" ? "active" : ""}`}
            onClick={() => setActiveTab("compliance")}
          >
            Compliance
          </button>
        </div>

        {/* Body */}
        <div className="vm-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="vh-details-grid">
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Availability</span>
                  <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                    {driver.availability || "Available"}
                  </span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Verification</span>
                  <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                    {driver.verification || "Verified"}
                  </span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">DL Expiry</span>
                  <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                    {formatDLDate(driver.licenseExpiry)}
                  </span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">DL Status</span>
                  <span
                    className="vh-stat-val"
                    style={{
                      fontSize: "14px",
                      color:
                        dlStatus === "Expired"
                          ? "#dc2626"
                          : dlStatus === "Expiring Soon"
                          ? "#d97706"
                          : "#047857",
                    }}
                  >
                    {dlStatus}
                  </span>
                </div>
              </div>

              {/* Contact Box */}
              <div>
                <span className="vh-details-group-title">Contact Information</span>
                <div className="vh-parent-box" style={{ marginTop: "4px" }}>
                  <div>
                    <div>
                      <strong>Phone:</strong> {driver.phone}
                    </div>
                    {driver.email && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        <strong>Email:</strong> {driver.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor Box */}
              <div>
                <span className="vh-details-group-title">Contracted Vendor</span>
                <div className="vh-parent-box" style={{ marginTop: "4px" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{vendor ? vendor.name : driver.vendorId}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      {vendor?.level || "Vendor"} &bull; {vendor?.location || "India"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Licence Box */}
              <div>
                <span className="vh-details-group-title">Commercial Driving Licence</span>
                <div className="vh-parent-box" style={{ marginTop: "4px" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px" }}>
                      {driver.licenseNumber}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      Valid through: {formatDLDate(driver.licenseExpiry)} ({dlStatus})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEHICLE */}
          {activeTab === "vehicle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {vehicle ? (
                <>
                  <div className="vh-details-grid">
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Registration</span>
                      <span className="vm-reg-plate" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                        {vehicle.registrationNumber}
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Model</span>
                      <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                        {vehicle.model}
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Seating Capacity</span>
                      <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                        {vehicle.seatingCapacity} Seater
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Fuel Type</span>
                      <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                        {vehicle.fuelType}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="vh-btn vh-btn-secondary"
                      onClick={() => onAssignVehicle(driver)}
                    >
                      Reassign Vehicle &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <div className="vm-empty-state">
                  <div className="vm-empty-title">No Vehicle Assigned</div>
                  <p style={{ fontSize: "13px", marginBottom: "16px" }}>
                    This driver is currently unassigned to any cab in the vendor fleet.
                  </p>
                  <button
                    type="button"
                    className="vh-btn vh-btn-primary"
                    onClick={() => onAssignVehicle(driver)}
                  >
                    Assign Vehicle Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "documents" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span className="vh-details-group-title">
                Driver Compliance &amp; Verification Documents
              </span>

              {driverDocs.length === 0 ? (
                <div className="vm-empty-state">
                  <div className="vm-empty-title">No Uploaded Documents Found</div>
                  <p style={{ fontSize: "13px" }}>
                    Physical licence copies, badges, and verification certificates will be registered in the Compliance module.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {driverDocs.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px" }}>
                          {doc.type} &bull; {doc.documentNumber}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          Issued: {doc.issueDate} &bull; Expires: {doc.expiryDate}
                        </div>
                      </div>

                      <span
                        className="vm-badge-status"
                        style={{
                          backgroundColor: doc.status === "valid" ? "#dcfce7" : "#fef3c7",
                          color: doc.status === "valid" ? "#166534" : "#92400e",
                        }}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLIANCE */}
          {activeTab === "compliance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: compliance.status === "non_compliant" ? "#fef2f2" : "#f0fdf4",
                  border: `1px solid ${compliance.status === "non_compliant" ? "#fecaca" : "#bbf7d0"}`,
                  padding: "14px 16px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: compliance.status === "non_compliant" ? "#991b1b" : "#166534" }}>
                    {compliance.status === "non_compliant" ? "Driver is Non-Compliant" : "Driver is Fully Compliant"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "2px" }}>
                    Licence Expiry: <strong>{driver.licenseExpiry ? formatDLDate(driver.licenseExpiry) : "No Date"}</strong>
                  </div>
                </div>

                <DocumentStatusBadge status={compliance.status} />
              </div>

              <div>
                <span className="vh-details-group-title">Mandatory Licencing Audit</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>Commercial Driving Licence</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>
                        Number: <code>{driver.licenseNumber || "\u2014"}</code> &bull; Expires: {driver.licenseExpiry ? formatDLDate(driver.licenseExpiry) : "\u2014"}
                      </div>
                    </div>
                    <DocumentStatusBadge status={compliance.dlStatus} />
                  </div>
                </div>
              </div>

              {onNavigateToCompliance && (
                <div style={{ textAlign: "center", paddingTop: "8px" }}>
                  <button
                    type="button"
                    className="vh-btn vh-btn-secondary"
                    style={{ width: "100%" }}
                    onClick={() => {
                      onClose();
                      onNavigateToCompliance(driver.id);
                    }}
                  >
                    View Driver Records in Compliance Module &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="vm-modal-footer">
          <button
            type="button"
            className="vh-btn vh-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="vh-btn vh-btn-primary"
            onClick={() => {
              onClose();
              onEdit(driver);
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
