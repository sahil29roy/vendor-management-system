import React, { useState } from "react";
import { vendors as initialVendors, admin } from "./data/vendors";
import { vehicles as initialVehicles } from "./data/vehicles";
import { drivers as initialDrivers } from "./data/drivers";
import { documents as initialDocuments } from "./data/documents";
import CreateVendor from "./pages/CreateVendor";
import VendorList from "./pages/VendorList";
import VendorHierarchy from "./pages/VendorHierarchy";
import VehicleList from "./pages/VehicleList";
import DriverList from "./pages/DriverList";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import "./styles/vendor-management.css";

export default function App() {
  const [vendorsList, setVendorsList] = useState(initialVendors);
  const [vehiclesList, setVehiclesList] = useState(initialVehicles);
  const [driversList, setDriversList] = useState(initialDrivers);
  const [documentsList, setDocumentsList] = useState(initialDocuments);
  const [currentView, setCurrentView] = useState("compliance"); // Default to compliance for verification
  const [selectedVendorFilterForVehicles, setSelectedVendorFilterForVehicles] = useState(null);
  const [selectedVendorFilterForDrivers, setSelectedVendorFilterForDrivers] = useState(null);
  const [selectedVendorFilterForCompliance, setSelectedVendorFilterForCompliance] = useState(null);
  const [selectedVehicleFilterForCompliance, setSelectedVehicleFilterForCompliance] = useState(null);
  const [selectedDriverFilterForCompliance, setSelectedDriverFilterForCompliance] = useState(null);

  const handleVendorCreated = (newVendor) => {
    setVendorsList((prev) => [newVendor, ...prev]);
  };

  const handleNavigateToVehiclesForVendor = (vendorId) => {
    setSelectedVendorFilterForVehicles(vendorId);
    setCurrentView("vehicles");
  };

  const handleNavigateToDriversForVendor = (vendorId) => {
    setSelectedVendorFilterForDrivers(vendorId);
    setCurrentView("drivers");
  };

  const handleNavigateToComplianceForVehicle = (vehicleId) => {
    setSelectedVehicleFilterForCompliance(vehicleId);
    setSelectedDriverFilterForCompliance(null);
    setSelectedVendorFilterForCompliance(null);
    setCurrentView("compliance");
  };

  const handleNavigateToComplianceForDriver = (driverId) => {
    setSelectedDriverFilterForCompliance(driverId);
    setSelectedVehicleFilterForCompliance(null);
    setSelectedVendorFilterForCompliance(null);
    setCurrentView("compliance");
  };

  const handleNavigateToComplianceForVendor = (vendorId) => {
    setSelectedVendorFilterForCompliance(vendorId);
    setSelectedVehicleFilterForCompliance(null);
    setSelectedDriverFilterForCompliance(null);
    setCurrentView("compliance");
  };

  return (
    <div className="vms-app-container">
      {/* Enterprise Header */}
      <header className="vms-header">
        <div className="vms-header-left">
          <span className="vms-brand-title">MoveInSync &bull; Fleet &amp; Driver Management</span>
          <span className="vms-badge-env">Enterprise VMS</span>
        </div>
        <div className="vms-header-right">
          <div className="vms-user-info">
            <span className="vms-user-name">{admin.name}</span>
            <span className="vms-user-role">{admin.role} &bull; Central Operations</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="vms-body">
        {/* Enterprise Sidebar */}
        <aside className="vms-sidebar">
          <nav>
            <ul className="vms-nav-list">
              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "drivers" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedVendorFilterForDrivers(null);
                    setCurrentView("drivers");
                  }}
                >
                  <span>Active Drivers</span>
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: currentView === "drivers" ? "#7c3aed" : "#f3f4f6",
                      color: currentView === "drivers" ? "#ffffff" : "#4b5563",
                      padding: "1px 7px",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {driversList.length}
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "vehicles" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedVendorFilterForVehicles(null);
                    setCurrentView("vehicles");
                  }}
                >
                  <span>Commercial Vehicles</span>
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: currentView === "vehicles" ? "#7c3aed" : "#f3f4f6",
                      color: currentView === "vehicles" ? "#ffffff" : "#4b5563",
                      padding: "1px 7px",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {vehiclesList.length}
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "hierarchy" ? "active" : ""}`}
                  onClick={() => setCurrentView("hierarchy")}
                >
                  <span>Vendor Hierarchy</span>
                  <span
                    style={{
                      fontSize: "10px",
                      backgroundColor: currentView === "hierarchy" ? "#7c3aed" : "#f3f4f6",
                      color: currentView === "hierarchy" ? "#ffffff" : "#4b5563",
                      padding: "1px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    Tree
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "vendors" ? "active" : ""}`}
                  onClick={() => setCurrentView("vendors")}
                >
                  <span>Vendor Directory</span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    {vendorsList.length}
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "create-vendor" ? "active" : ""}`}
                  onClick={() => setCurrentView("create-vendor")}
                >
                  <span>+ Create Vendor</span>
                </button>
              </li>

              <li className="vms-nav-item" style={{ marginTop: "16px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  Fleet Compliance
                </div>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "compliance" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedVendorFilterForCompliance(null);
                    setSelectedVehicleFilterForCompliance(null);
                    setSelectedDriverFilterForCompliance(null);
                    setCurrentView("compliance");
                  }}
                >
                  <span>Compliance Central</span>
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: currentView === "compliance" ? "#7c3aed" : "#f3f4f6",
                      color: currentView === "compliance" ? "#ffffff" : "#4b5563",
                      padding: "1px 7px",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {documentsList.length}
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className={`vms-nav-button ${currentView === "reports" ? "active" : ""}`}
                  onClick={() => setCurrentView("reports")}
                >
                  <span>Reports &amp; Analytics</span>
                  <span
                    style={{
                      fontSize: "10px",
                      backgroundColor: currentView === "reports" ? "#7c3aed" : "#f3f4f6",
                      color: currentView === "reports" ? "#ffffff" : "#4b5563",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    BI
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Dynamic Content View */}
        <main className="vms-main-content">
          {currentView === "reports" && (
            <Reports
              vendors={vendorsList}
              vehicles={vehiclesList}
              drivers={driversList}
              documents={documentsList}
              onNavigateToVendors={() => setCurrentView("vendors")}
              onNavigateToVehicles={handleNavigateToVehiclesForVendor}
              onNavigateToDrivers={handleNavigateToDriversForVendor}
              onNavigateToCompliance={handleNavigateToComplianceForVendor}
            />
          )}

          {currentView === "compliance" && (
            <Compliance
              documents={documentsList}
              vehicles={vehiclesList}
              drivers={driversList}
              vendors={vendorsList}
              onUpdateDocuments={setDocumentsList}
              initialVendorFilter={selectedVendorFilterForCompliance}
              initialVehicleFilter={selectedVehicleFilterForCompliance}
              initialDriverFilter={selectedDriverFilterForCompliance}
              onClearInitialFilters={() => {
                setSelectedVendorFilterForCompliance(null);
                setSelectedVehicleFilterForCompliance(null);
                setSelectedDriverFilterForCompliance(null);
              }}
              onViewVehicleInModule={(v) => {
                setSelectedVendorFilterForVehicles(v.vendorId);
                setCurrentView("vehicles");
              }}
              onViewDriverInModule={(d) => {
                setSelectedVendorFilterForDrivers(d.vendorId);
                setCurrentView("drivers");
              }}
            />
          )}

          {currentView === "drivers" && (
            <DriverList
              drivers={driversList}
              vendors={vendorsList}
              vehicles={vehiclesList}
              documents={documentsList}
              admin={admin}
              onUpdateDrivers={setDriversList}
              onUpdateVehicles={setVehiclesList}
              onUpdateDocuments={setDocumentsList}
              onNavigateToCompliance={handleNavigateToComplianceForDriver}
              initialVendorFilter={selectedVendorFilterForDrivers}
              onClearVendorFilter={() => setSelectedVendorFilterForDrivers(null)}
            />
          )}

          {currentView === "vehicles" && (
            <VehicleList
              vehicles={vehiclesList}
              vendors={vendorsList}
              drivers={driversList}
              documents={documentsList}
              admin={admin}
              onUpdateVehicles={setVehiclesList}
              onUpdateDrivers={setDriversList}
              onUpdateDocuments={setDocumentsList}
              onNavigateToCompliance={handleNavigateToComplianceForVehicle}
              initialVendorFilter={selectedVendorFilterForVehicles}
              onClearVendorFilter={() => setSelectedVendorFilterForVehicles(null)}
            />
          )}

          {currentView === "hierarchy" && (
            <VendorHierarchy
              vendors={vendorsList}
              admin={admin}
              vehicles={vehiclesList}
              drivers={driversList}
              onUpdateVendors={setVendorsList}
              onNavigateDirectory={() => setCurrentView("vendors")}
            />
          )}

          {currentView === "create-vendor" && (
            <CreateVendor
              existingVendors={vendorsList}
              admin={admin}
              onVendorCreated={handleVendorCreated}
              onCancel={() => setCurrentView("vendors")}
            />
          )}

          {currentView === "vendors" && (
            <VendorList
              vendors={vendorsList}
              vehicles={vehiclesList}
              drivers={driversList}
              admin={admin}
              onCreateVendorClick={() => setCurrentView("create-vendor")}
              onViewHierarchyClick={() => setCurrentView("hierarchy")}
              onViewVehiclesForVendor={handleNavigateToVehiclesForVendor}
              onViewDriversForVendor={handleNavigateToDriversForVendor}
              onViewComplianceForVendor={handleNavigateToComplianceForVendor}
            />
          )}
        </main>
      </div>
    </div>
  );
}
