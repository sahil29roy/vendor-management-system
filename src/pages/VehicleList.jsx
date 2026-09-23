import React, { useState, useMemo, useEffect } from "react";
import VehicleFilters from "../vehicles/VehicleFilters";
import VehicleTable from "../vehicles/VehicleTable";
import VehicleActions from "../vehicles/VehicleActions";
import VehicleForm from "../vehicles/VehicleForm";
import AssignDriverModal from "../vehicles/AssignDriverModal";
import VehicleDetails from "../vehicles/VehicleDetails";
import {
  filterVehicles,
  sortVehicles,
  getVehicleStats,
  getVendorById,
  getDriverById,
} from "../utils/vehicleUtils";
import "../styles/vehicles.css";

export default function VehicleList({
  vehicles = [],
  vendors = [],
  drivers = [],
  documents = [],
  admin,
  onUpdateVehicles,
  onUpdateDrivers,
  initialVendorFilter = null,
  onClearVendorFilter,
  onNavigateToCompliance,
}) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(initialVendorFilter || "all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");

  // Sorting state
  const [sortKey, setSortKey] = useState("registration");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [inspectingVehicle, setInspectingVehicle] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [vehicleToAssign, setVehicleToAssign] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Update vendor filter if initialVendorFilter changes
  useEffect(() => {
    if (initialVendorFilter) {
      setSelectedVendor(initialVendorFilter);
    }
  }, [initialVendorFilter]);

  // Derived stats
  const stats = useMemo(() => getVehicleStats(vehicles), [vehicles]);

  // Filtered & Sorted vehicles
  const processedVehicles = useMemo(() => {
    const filtered = filterVehicles(
      vehicles,
      {
        searchQuery,
        selectedVendor,
        selectedFuelType,
        selectedStatus,
        driverFilter,
      },
      vendors,
      drivers
    );

    return sortVehicles(filtered, sortKey, sortOrder, vendors);
  }, [
    vehicles,
    searchQuery,
    selectedVendor,
    selectedFuelType,
    selectedStatus,
    driverFilter,
    sortKey,
    sortOrder,
    vendors,
    drivers,
  ]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedVendor("all");
    setSelectedFuelType("all");
    setSelectedStatus("all");
    setDriverFilter("all");
    if (onClearVendorFilter) onClearVendorFilter();
  };

  // Action: Open Add Form
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Form
  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  // Action: Open Details
  const handleOpenDetails = (vehicle) => {
    setInspectingVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  // Action: Open Assign Driver Modal
  const handleOpenAssign = (vehicle) => {
    setVehicleToAssign(vehicle);
    setIsAssignModalOpen(true);
  };

  // Action: Save Added/Edited Vehicle
  const handleSaveVehicle = (vehicleData) => {
    const isEdit = Boolean(editingVehicle);
    let updatedVehicles;

    if (isEdit) {
      updatedVehicles = vehicles.map((v) =>
        v.id === vehicleData.id ? { ...v, ...vehicleData } : v
      );
      setNotification(`Vehicle "${vehicleData.registrationNumber}" updated successfully.`);
    } else {
      updatedVehicles = [vehicleData, ...vehicles];
      setNotification(`Vehicle "${vehicleData.registrationNumber}" registered successfully.`);
    }

    // Keep driver vehicleId synchronized
    if (onUpdateDrivers && vehicleData.driverId) {
      onUpdateDrivers((prevDrivers) =>
        prevDrivers.map((d) => {
          if (d.id === vehicleData.driverId) {
            return { ...d, vehicleId: vehicleData.id };
          }
          // If this driver was previously assigned to this vehicle and changed, unassign previous
          if (isEdit && editingVehicle.driverId === d.id && vehicleData.driverId !== d.id) {
            return { ...d, vehicleId: null };
          }
          return d;
        })
      );
    }

    if (onUpdateVehicles) {
      onUpdateVehicles(updatedVehicles);
    }
  };

  // Action: Confirm Driver Assignment
  const handleConfirmAssignment = (vehicleId, driverId) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    const oldDriverId = targetVehicle?.driverId;

    // 1. Update vehicle state
    const updatedVehicles = vehicles.map((v) =>
      v.id === vehicleId ? { ...v, driverId } : v
    );
    if (onUpdateVehicles) onUpdateVehicles(updatedVehicles);

    // 2. Synchronize driver state
    if (onUpdateDrivers) {
      onUpdateDrivers((prevDrivers) =>
        prevDrivers.map((d) => {
          if (driverId && d.id === driverId) {
            return { ...d, vehicleId };
          }
          if (oldDriverId && d.id === oldDriverId && d.id !== driverId) {
            return { ...d, vehicleId: null };
          }
          return d;
        })
      );
    }

    const assignedDriver = getDriverById(drivers, driverId);
    if (assignedDriver) {
      setNotification(`Driver "${assignedDriver.name}" assigned to ${targetVehicle?.registrationNumber}.`);
    } else {
      setNotification(`Driver unassigned from ${targetVehicle?.registrationNumber}.`);
    }
  };

  // Action: Unassign Driver
  const handleUnassignDriver = (vehicle) => {
    const oldDriverId = vehicle.driverId;
    const oldDriver = getDriverById(drivers, oldDriverId);

    // 1. Update vehicle
    const updatedVehicles = vehicles.map((v) =>
      v.id === vehicle.id ? { ...v, driverId: null } : v
    );
    if (onUpdateVehicles) onUpdateVehicles(updatedVehicles);

    // 2. Update driver
    if (onUpdateDrivers && oldDriverId) {
      onUpdateDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d.id === oldDriverId ? { ...d, vehicleId: null } : d))
      );
    }

    setNotification(
      `Driver ${oldDriver ? `"${oldDriver.name}"` : ""} unassigned from ${vehicle.registrationNumber}.`
    );
  };

  // Action: Toggle Vehicle Status (Deactivate / Activate)
  const handleToggleStatus = (vehicle) => {
    const isInactive = vehicle.status === "inactive";
    const nextStatus = isInactive ? "active" : "inactive";

    const updatedVehicles = vehicles.map((v) =>
      v.id === vehicle.id ? { ...v, status: nextStatus } : v
    );
    if (onUpdateVehicles) onUpdateVehicles(updatedVehicles);

    setNotification(
      `Vehicle "${vehicle.registrationNumber}" status changed to ${nextStatus.toUpperCase()}.`
    );
  };

  const selectedVendorObject = getVendorById(vendors, selectedVendor);

  return (
    <div className="vm-page-container">
      {/* Header */}
      <div className="vm-header">
        <div>
          <h1 className="vm-title">Commercial Vehicles</h1>
          <p className="vm-subtitle">
            Manage all commercial fleet cabs and vans across your multi-tier vendor network.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="vh-btn vh-btn-primary"
            onClick={handleOpenAdd}
          >
            + Add Commercial Vehicle
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="vm-alert vm-alert-success" role="status">
          <span>&#10003; {notification}</span>
          <button
            type="button"
            className="vm-alert-dismiss"
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Vendor Filter Notice (if filtered by specific vendor) */}
      {selectedVendor !== "all" && selectedVendorObject && (
        <div className="vm-alert vm-alert-warning">
          <span>
            Filtering fleet for vendor: <strong>{selectedVendorObject.name}</strong>{" "}
            ({selectedVendorObject.level || "Vendor"})
          </span>
          <button
            type="button"
            className="vh-btn vh-btn-secondary"
            style={{ fontSize: "11px", padding: "2px 8px" }}
            onClick={handleResetFilters}
          >
            View All Vendors
          </button>
        </div>
      )}

      {/* Stats KPI Strip */}
      <VehicleActions stats={stats} onOpenAddModal={handleOpenAdd} />

      {/* Filters Bar */}
      <VehicleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedVendor={selectedVendor}
        onVendorChange={setSelectedVendor}
        selectedFuelType={selectedFuelType}
        onFuelChange={setSelectedFuelType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        driverFilter={driverFilter}
        onDriverFilterChange={setDriverFilter}
        vendors={vendors}
        onResetFilters={handleResetFilters}
      />

      {/* Vehicles Table */}
      <VehicleTable
        vehicles={processedVehicles}
        vendors={vendors}
        drivers={drivers}
        admin={admin}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        onView={handleOpenDetails}
        onEdit={handleOpenEdit}
        onAssignDriver={handleOpenAssign}
        onUnassignDriver={handleUnassignDriver}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add / Edit Form Modal */}
      <VehicleForm
        isOpen={isFormOpen}
        initialVehicle={editingVehicle}
        allVehicles={vehicles}
        vendors={vendors}
        drivers={drivers}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveVehicle}
      />

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignModalOpen}
        vehicle={vehicleToAssign}
        drivers={drivers}
        allVehicles={vehicles}
        onClose={() => setIsAssignModalOpen(false)}
        onConfirmAssignment={handleConfirmAssignment}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetails
        isOpen={isDetailsOpen}
        vehicle={inspectingVehicle}
        vendors={vendors}
        drivers={drivers}
        documents={documents}
        admin={admin}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleOpenEdit}
        onAssignDriver={handleOpenAssign}
        onNavigateToCompliance={onNavigateToCompliance}
      />
    </div>
  );
}
