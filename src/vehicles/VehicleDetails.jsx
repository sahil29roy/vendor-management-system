import React, { useState } from "react";
import VehicleStatusBadge from "./VehicleStatusBadge";
import {
  getVendorById,
  getDriverById,
  getVehicleDocuments,
} from "../utils/vehicleUtils";

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
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !vehicle) return null;

  const vendor = getVendorById(vendors, vehicle.vendorId, admin);
  const driver = getDriverById(drivers, vehicle.driverId);
  const vehicleDocs = getVehicleDocuments(documents, vehicle.id);

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
                  <span className="vh-stat-label">Operational Status</span>
                  <div style={{ marginTop: "4px" }}>
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>
                </div>
              </div>

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
            <div className="vm-empty-state">
              <div className="vm-empty-title">Compliance Management</div>
              <p style={{ fontSize: "13px" }}>
                Compliance information, inspection records, and automated audit checks will appear here when the Compliance module is connected.
              </p>
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
