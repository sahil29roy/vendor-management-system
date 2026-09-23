import React from "react";
import ComplianceRow from "./ComplianceRow";
import {
  getVehicleComplianceStatus,
  getDriverComplianceStatus,
  getExpiringDocuments,
} from "../utils/complianceUtils";

export default function ComplianceTable({
  activeTab = "documents",
  onTabChange,
  documents = [],
  filteredDocuments = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  onViewDoc,
  onReplaceDoc,
  onViewVehicle,
  onViewDriver,
}) {
  // 1. VEHICLE COMPLIANCE DATA PREPARATION
  const vehicleMatrixData = vehicles.map((v) => {
    const compliance = getVehicleComplianceStatus(documents, v.id);
    const vendor = vendors.find((item) => item.id === v.vendorId);
    return { vehicle: v, compliance, vendor };
  });

  // 2. DRIVER COMPLIANCE DATA PREPARATION
  const driverMatrixData = drivers.map((d) => {
    const compliance = getDriverComplianceStatus(documents, d.id);
    const vendor = vendors.find((item) => item.id === d.vendorId);
    const vehicle = vehicles.find((item) => item.id === d.vehicleId);
    return { driver: d, compliance, vendor, vehicle };
  });

  // 3. UPCOMING EXPIRING DOCUMENTS (30 days threshold)
  const expiringAlerts = getExpiringDocuments(documents, 30);

  return (
    <div className="comp-table-card">
      {/* Tab Switcher */}
      <div className="comp-tabs-bar">
        <button
          type="button"
          className={`comp-tab-btn ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => onTabChange("documents")}
        >
          All Documents
          <span className="comp-tab-badge">{filteredDocuments.length}</span>
        </button>

        <button
          type="button"
          className={`comp-tab-btn ${activeTab === "vehicles" ? "active" : ""}`}
          onClick={() => onTabChange("vehicles")}
        >
          Vehicle Compliance Matrix
          <span className="comp-tab-badge">{vehicles.length}</span>
        </button>

        <button
          type="button"
          className={`comp-tab-btn ${activeTab === "drivers" ? "active" : ""}`}
          onClick={() => onTabChange("drivers")}
        >
          Driver Compliance Matrix
          <span className="comp-tab-badge">{drivers.length}</span>
        </button>

        <button
          type="button"
          className={`comp-tab-btn ${activeTab === "reminders" ? "active" : ""}`}
          onClick={() => onTabChange("reminders")}
        >
          Expiry Reminders &amp; Alerts
          <span
            className="comp-tab-badge"
            style={{
              backgroundColor: expiringAlerts.length > 0 ? "#fee2e2" : "#f3f4f6",
              color: expiringAlerts.length > 0 ? "#991b1b" : "#4b5563",
              fontWeight: 700,
            }}
          >
            {expiringAlerts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ALL DOCUMENTS TABLE */}
      {activeTab === "documents" && (
        <div className="comp-table-container">
          {filteredDocuments.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#374151" }}>
                No Documents Found
              </div>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                No document records matched your active search or filter criteria.
              </p>
            </div>
          ) : (
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Document Type &amp; No.</th>
                  <th>Owner Type</th>
                  <th>Owner</th>
                  <th>Vendor</th>
                  <th>Vehicle Plate</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <ComplianceRow
                    key={doc.id}
                    type="document"
                    data={doc}
                    vendors={vendors}
                    vehicles={vehicles}
                    drivers={drivers}
                    onViewDoc={onViewDoc}
                    onReplaceDoc={onReplaceDoc}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: VEHICLE COMPLIANCE MATRIX */}
      {activeTab === "vehicles" && (
        <div className="comp-table-container">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Vehicle &amp; Model</th>
                <th>Vendor</th>
                <th>RC (Registration)</th>
                <th>Permit</th>
                <th>Pollution (PUC)</th>
                <th>Overall Compliance</th>
                <th>Operational Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleMatrixData.map((item) => (
                <ComplianceRow
                  key={item.vehicle.id}
                  type="vehicle_matrix"
                  data={item}
                  vendors={vendors}
                  onViewVehicle={onViewVehicle}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: DRIVER COMPLIANCE MATRIX */}
      {activeTab === "drivers" && (
        <div className="comp-table-container">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Vendor</th>
                <th>Assigned Vehicle</th>
                <th>Driving Licence (DL)</th>
                <th>DL Status</th>
                <th>Overall Compliance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {driverMatrixData.map((item) => (
                <ComplianceRow
                  key={item.driver.id}
                  type="driver_matrix"
                  data={item}
                  vendors={vendors}
                  onViewDriver={onViewDriver}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: EXPIRY REMINDERS & ALERTS */}
      {activeTab === "reminders" && (
        <div className="comp-table-container">
          {expiringAlerts.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#15803d" }}>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                All Clear &bull; No Upcoming Expiries
              </div>
              <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>
                All vehicle and driver documents have valid compliance status beyond 30 days.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ padding: "12px 16px", backgroundColor: "#fffbeb", borderBottom: "1px solid #fef3c7" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#92400e" }}>
                  ⚠️ Automated Renewal Notice: {expiringAlerts.length} document(s) expired or expiring within 30 days.
                </span>
              </div>
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Owner Type</th>
                    <th>Owner</th>
                    <th>Vendor</th>
                    <th>Vehicle Plate</th>
                    <th>Issue Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringAlerts.map((doc) => (
                    <ComplianceRow
                      key={doc.id}
                      type="document"
                      data={doc}
                      vendors={vendors}
                      vehicles={vehicles}
                      drivers={drivers}
                      onViewDoc={onViewDoc}
                      onReplaceDoc={onReplaceDoc}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
