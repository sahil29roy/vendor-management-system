import React, { useState } from "react";
import { vendors as initialVendors, admin } from "./data/vendors";
import { vehicles as initialVehicles } from "./data/vehicles";
import { drivers as initialDrivers } from "./data/drivers";
import { documents } from "./data/documents";
import CreateVendor from "./pages/CreateVendor";
import VendorList from "./pages/VendorList";
import VendorHierarchy from "./pages/VendorHierarchy";
import VehicleList from "./pages/VehicleList";
import "./styles/vendor-management.css";

export default function App() {
  const [vendorsList, setVendorsList] = useState(initialVendors);
  const [vehiclesList, setVehiclesList] = useState(initialVehicles);
  const [driversList, setDriversList] = useState(initialDrivers);
  const [currentView, setCurrentView] = useState("vehicles"); // Default to vehicles view per user request
  const [selectedVendorFilterForVehicles, setSelectedVendorFilterForVehicles] = useState(null);

  const handleVendorCreated = (newVendor) => {
    setVendorsList((prev) => [newVendor, ...prev]);
  };

  const handleNavigateToVehiclesForVendor = (vendorId) => {
    setSelectedVendorFilterForVehicles(vendorId);
    setCurrentView("vehicles");
  };

  return (
    <div className="vms-app-container">
      {/* Enterprise Header */}
      <header className="vms-header">
        <div className="vms-header-left">
          <span className="vms-brand-title">MoveInSync &bull; Fleet & Vendor Management</span>
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
                  Fleet Operations
                </div>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className="vms-nav-button"
                  style={{ opacity: 0.8 }}
                  onClick={() => {
                    setSelectedVendorFilterForVehicles(null);
                    setCurrentView("vehicles");
                  }}
                >
                  <span>Active Drivers</span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    {driversList.length}
                  </span>
                </button>
              </li>

              <li className="vms-nav-item">
                <button
                  type="button"
                  className="vms-nav-button"
                  style={{ opacity: 0.8 }}
                  onClick={() => setCurrentView("vendors")}
                >
                  <span>Compliance Docs</span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    {documents.length}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Dynamic Content View */}
        <main className="vms-main-content">
          {currentView === "vehicles" && (
            <VehicleList
              vehicles={vehiclesList}
              vendors={vendorsList}
              drivers={driversList}
              documents={documents}
              admin={admin}
              onUpdateVehicles={setVehiclesList}
              onUpdateDrivers={setDriversList}
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
              admin={admin}
              onCreateVendorClick={() => setCurrentView("create-vendor")}
              onViewHierarchyClick={() => setCurrentView("hierarchy")}
              onViewVehiclesForVendor={handleNavigateToVehiclesForVendor}
            />
          )}
        </main>
      </div>
    </div>
  );
}
