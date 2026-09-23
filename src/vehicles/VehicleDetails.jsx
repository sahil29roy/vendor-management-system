import React, { useState } from "react";
import VehicleStatusBadge from "./VehicleStatusBadge";
import {
  getVendorById,
  getDriverById,
  getVehicleDocuments,
} from "../utils/vehicleUtils";
import { getVehicleComplianceStatus } from "../utils/complianceUtils";
import DocumentStatusBadge from "../compliance/DocumentStatusBadge";

export default function VehicleDetails({
  isOpen,
  vehicle,
  vendors = [],
  drivers = [],
  documents = [],
  admin,
  onClose,
  onEdit,
  onAssignDriver,
  onNavigateToCompliance,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !vehicle) return null;

  const vendor = getVendorById(vendors, vehicle.vendorId, admin);
  const driver = getDriverById(drivers, vehicle.driverId);
  const vehicleDocs = getVehicleDocuments(documents, vehicle.id);
  const compliance = getVehicleComplianceStatus(documents, vehicle.id);

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
            <span className="vm-reg-plate">{vehicle.registrationNumber}</span>
            <span className="vm-modal-title">{vehicle.model}</span>
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
            className={`vm-tab-btn ${activeTab === "driver" ? "active" : ""}`}
            onClick={() => setActiveTab("driver")}
          >
            Driver
          </button>
          <button
            type="button"
            className={`vm-tab-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Documents ({vehicleDocs.length})
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
                  <span className="vh-stat-label">Model Year</span>
                  <span className="vh-stat-val">{vehicle.year}</span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Seating Capacity</span>
                  <span className="vh-stat-val">{vehicle.seatingCapacity} Seats</span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Fuel Type</span>
                  <span className="vh-stat-val">{vehicle.fuelType}</span>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Account Status</span>
                  <div style={{ marginTop: "4px" }}>
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Document Compliance</span>
                  <div style={{ marginTop: "4px" }}>
                    <DocumentStatusBadge status={compliance.status} />
                  </div>
                </div>
                <div className="vh-stat-item">
                  <span className="vh-stat-label">Fleet Eligibility</span>
                  <div style={{ marginTop: "4px" }}>
                    <DocumentStatusBadge
                      status={compliance.operationalStatus === "blocked" ? "blocked" : "allowed"}
                      label={compliance.operationalStatus === "blocked" ? "Cannot Operate" : "Operational"}
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Warning Banner if blocked */}
              {compliance.operationalStatus === "blocked" && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    color: "#991b1b",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div>
                    <strong>🚫 Non-Compliant &bull; Cannot Operate:</strong>{" "}
                    {compliance.reasons.join(", ")}
                  </div>
                  {onNavigateToCompliance && (
                    <button
                      type="button"
                      className="vh-btn vh-btn-secondary"
                      style={{ fontSize: "11px", padding: "3px 8px", whiteSpace: "nowrap" }}
                      onClick={() => {
                        onClose();
                        onNavigateToCompliance(vehicle.id);
                      }}
                    >
                      View in Compliance
                    </button>
                  )}
                </div>
              )}

              {/* Vendor Box */}
              <div>
                <span className="vh-details-group-title">Operating Vendor</span>
                <div className="vh-parent-box" style={{ marginTop: "4px" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{vendor ? vendor.name : vehicle.vendorId}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      {vendor?.level || "Vendor"} &bull; {vendor?.location || "India"}
                    </div>
                  </div>
                  {vendor?.phone && (
                    <span style={{ fontSize: "12px", color: "#374151" }}>
                      {vendor.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Driver Box */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="vh-details-group-title">Assigned Driver</span>
                  <button
                    type="button"
                    className="vh-btn vh-btn-secondary"
                    style={{ fontSize: "11px", padding: "2px 8px" }}
                    onClick={() => onAssignDriver(vehicle)}
                  >
                    {driver ? "Reassign" : "Assign Driver"}
                  </button>
                </div>
                <div className="vh-parent-box" style={{ marginTop: "4px" }}>
                  {driver ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{driver.name}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>
                        License: {driver.licenseNumber} &bull; Valid until: {driver.licenseExpiry}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontStyle: "italic", color: "#9ca3af" }}>
                      No driver assigned to this vehicle.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVER */}
          {activeTab === "driver" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {driver ? (
                <>
                  <div className="vh-details-grid">
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Driver Name</span>
                      <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                        {driver.name}
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Phone</span>
                      <span className="vh-stat-val" style={{ fontSize: "14px" }}>
                        {driver.phone}
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">Driving License</span>
                      <span className="vh-stat-val" style={{ fontSize: "13px" }}>
                        {driver.licenseNumber}
                      </span>
                    </div>
                    <div className="vh-stat-item">
                      <span className="vh-stat-label">License Expiry</span>
                      <span className="vh-stat-val" style={{ fontSize: "13px" }}>
                        {driver.licenseExpiry}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="vh-btn vh-btn-secondary"
                      onClick={() => onAssignDriver(vehicle)}
                    >
                      Reassign Driver &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <div className="vm-empty-state">
                  <div className="vm-empty-title">No Driver Assigned</div>
                  <p style={{ fontSize: "13px", marginBottom: "16px" }}>
                    This commercial vehicle is currently unassigned and ready for driver allocation.
                  </p>
                  <button
                    type="button"
                    className="vh-btn vh-btn-primary"
                    onClick={() => onAssignDriver(vehicle)}
                  >
                    Assign Driver Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "documents" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span className="vh-details-group-title">
                Mandatory Commercial Vehicle Documents
              </span>

              {vehicleDocs.length === 0 ? (
                <div className="vm-empty-state">
                  <div className="vm-empty-title">No Documents Uploaded</div>
                  <p style={{ fontSize: "13px" }}>
                    RC, Commercial Permit, and Pollution certificates will be registered in the Compliance module.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {vehicleDocs.map((doc) => {
                    const isExp = doc.status === "expired";
                    const isSoon = doc.status === "expiring";

                    return (
                      <div
                        key={doc.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          backgroundColor: isExp ? "#fef2f2" : isSoon ? "#fffbeb" : "#ffffff",
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
                            backgroundColor: isExp ? "#fee2e2" : isSoon ? "#fef3c7" : "#dcfce7",
                            color: isExp ? "#991b1b" : isSoon ? "#92400e" : "#166534",
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                    );
                  })}
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
                    {compliance.status === "non_compliant" ? "Vehicle is Non-Compliant" : "Vehicle is Fully Compliant"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "2px" }}>
                    Operational Status: <strong>{compliance.operationalStatus === "blocked" ? "Blocked (Cannot Operate)" : "Allowed (Active in Fleet)"}</strong>
                  </div>
                </div>

                <DocumentStatusBadge
                  status={compliance.operationalStatus === "blocked" ? "blocked" : "allowed"}
                  label={compliance.operationalStatus === "blocked" ? "Blocked" : "Allowed"}
                />
              </div>

              <div>
                <span className="vh-details-group-title">Mandatory Document Audit</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  {["RC", "Permit", "Pollution Certificate"].map((reqType) => {
                    const detail = compliance.docDetails?.[reqType] || { status: "missing", doc: null };
                    return (
                      <div
                        key={reqType}
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
                          <div style={{ fontWeight: 600, fontSize: "13px" }}>{reqType}</div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>
                            {detail.doc
                              ? `Doc #${detail.doc.documentNumber} \u2022 Expires ${detail.doc.expiryDate}`
                              : "No active certificate on record"}
                          </div>
                        </div>
                        <DocumentStatusBadge status={detail.status} />
                      </div>
                    );
                  })}
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
                      onNavigateToCompliance(vehicle.id);
                    }}
                  >
                    Manage Vehicle Documents in Compliance Module &rarr;
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
              onEdit(vehicle);
            }}
          >
            Edit Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
