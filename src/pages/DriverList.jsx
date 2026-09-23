import React, { useState, useMemo, useEffect } from "react";
import DriverFilters from "../drivers/DriverFilters";
import DriverTable from "../drivers/DriverTable";
import DriverActions from "../drivers/DriverActions";
import DriverForm from "../drivers/DriverForm";
import AssignVehicleModal from "../drivers/AssignVehicleModal";
import DriverDetails from "../drivers/DriverDetails";
import {
  filterDrivers,
  sortDrivers,
  getDriverStats,
  getVendorById,
  getVehicleById,
} from "../utils/driverUtils";
import "../styles/drivers.css";

export default function DriverList({
  drivers = [],
  vendors = [],
  vehicles = [],
  documents = [],
  admin,
  onUpdateDrivers,
  onUpdateVehicles,
  initialVendorFilter = null,
  onClearVendorFilter,
  onNavigateToCompliance,
}) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(initialVendorFilter || "all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState("all");
  const [selectedVehicleStatus, setSelectedVehicleStatus] = useState("all");
  const [selectedDLStatus, setSelectedDLStatus] = useState("all");

  // Sort states
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [inspectingDriver, setInspectingDriver] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [driverToAssign, setDriverToAssign] = useState(null);

  // Notification toast
  const [notification, setNotification] = useState(null);

  // Update vendor filter if initialVendorFilter changes
  useEffect(() => {
    if (initialVendorFilter) {
      setSelectedVendor(initialVendorFilter);
    }
  }, [initialVendorFilter]);

  // Derived stats
  const stats = useMemo(() => getDriverStats(drivers), [drivers]);

  // Filtered & Sorted drivers
  const processedDrivers = useMemo(() => {
    const filtered = filterDrivers(
      drivers,
      {
        searchQuery,
        selectedVendor,
        selectedStatus,
        selectedAvailability,
        selectedVerification,
        selectedVehicleStatus,
        selectedDLStatus,
      },
      vendors,
      vehicles
    );

    return sortDrivers(filtered, sortKey, sortOrder, vendors, vehicles);
  }, [
    drivers,
    searchQuery,
    selectedVendor,
    selectedStatus,
    selectedAvailability,
    selectedVerification,
    selectedVehicleStatus,
    selectedDLStatus,
    sortKey,
    sortOrder,
    vendors,
    vehicles,
  ]);

  // Handle Sort
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
    setSelectedStatus("all");
    setSelectedAvailability("all");
    setSelectedVerification("all");
    setSelectedVehicleStatus("all");
    setSelectedDLStatus("all");
    if (onClearVendorFilter) onClearVendorFilter();
  };

  // Action: Open Add Driver Form
  const handleOpenAdd = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Driver Form
  const handleOpenEdit = (driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  // Action: Open Details Modal
  const handleOpenDetails = (driver) => {
    setInspectingDriver(driver);
    setIsDetailsOpen(true);
  };

  // Action: Open Assign Vehicle Modal
  const handleOpenAssign = (driver) => {
    setDriverToAssign(driver);
    setIsAssignModalOpen(true);
  };

  // Action: Save Added/Edited Driver
  const handleSaveDriver = (driverData) => {
    const isEdit = Boolean(editingDriver);
    let updatedDrivers;

    if (isEdit) {
      updatedDrivers = drivers.map((d) =>
        d.id === driverData.id ? { ...d, ...driverData } : d
      );
      setNotification(`Driver "${driverData.name}" updated successfully.`);
    } else {
      updatedDrivers = [driverData, ...drivers];
      setNotification(`Driver "${driverData.name}" registered successfully.`);
    }

    // Synchronize vehicle state if vehicle assigned
    if (onUpdateVehicles && driverData.vehicleId) {
      onUpdateVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (v.id === driverData.vehicleId) {
            return { ...v, driverId: driverData.id };
          }
          // If editing and previous vehicle changed, unassign old vehicle
          if (isEdit && editingDriver.vehicleId === v.id && driverData.vehicleId !== v.id) {
            return { ...v, driverId: null };
          }
          return v;
        })
      );
    }

    if (onUpdateDrivers) {
      onUpdateDrivers(updatedDrivers);
    }
  };

  // Action: Confirm Vehicle Assignment
  const handleConfirmAssignment = (driverId, vehicleId) => {
    const targetDriver = drivers.find((d) => d.id === driverId);
    const oldVehicleId = targetDriver?.vehicleId;

    // 1. Update drivers state
    const updatedDrivers = drivers.map((d) =>
      d.id === driverId ? { ...d, vehicleId } : d
    );
    if (onUpdateDrivers) onUpdateDrivers(updatedDrivers);

    // 2. Synchronize vehicles state
    if (onUpdateVehicles) {
      onUpdateVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (vehicleId && v.id === vehicleId) {
            return { ...v, driverId };
          }
          if (oldVehicleId && v.id === oldVehicleId && v.id !== vehicleId) {
            return { ...v, driverId: null };
          }
          return v;
        })
      );
    }

    const assignedVehicle = getVehicleById(vehicles, vehicleId);
    if (assignedVehicle) {
      setNotification(
        `Vehicle "${assignedVehicle.registrationNumber}" assigned to driver "${targetDriver?.name}".`
      );
    } else {
      setNotification(`Vehicle unassigned from driver "${targetDriver?.name}".`);
    }
  };

  // Action: Unassign Vehicle
  const handleUnassignVehicle = (driver) => {
    const oldVehicleId = driver.vehicleId;
    const oldVehicle = getVehicleById(vehicles, oldVehicleId);

    // 1. Update driver
    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id ? { ...d, vehicleId: null } : d
    );
    if (onUpdateDrivers) onUpdateDrivers(updatedDrivers);

    // 2. Synchronize vehicle
    if (onUpdateVehicles && oldVehicleId) {
      onUpdateVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v.id === oldVehicleId ? { ...v, driverId: null } : v))
      );
    }

    setNotification(
      `Vehicle ${oldVehicle ? `"${oldVehicle.registrationNumber}"` : ""} unassigned from driver "${driver.name}".`
    );
  };

  // Action: Deactivate / Activate Driver
  const handleToggleStatus = (driver) => {
    const isInactive = driver.status === "inactive";
    const nextStatus = isInactive ? "active" : "inactive";

    // Business rule: If deactivating an assigned driver, automatically unassign vehicle so inactive driver is not driving active cab
    let unassignedVehicleId = null;
    if (!isInactive && driver.vehicleId) {
      unassignedVehicleId = driver.vehicleId;
    }

    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id
        ? {
            ...d,
            status: nextStatus,
            vehicleId: unassignedVehicleId ? null : d.vehicleId,
          }
        : d
    );
    if (onUpdateDrivers) onUpdateDrivers(updatedDrivers);

    if (unassignedVehicleId && onUpdateVehicles) {
      onUpdateVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.id === unassignedVehicleId ? { ...v, driverId: null } : v
        )
      );
    }

    setNotification(
      `Driver "${driver.name}" status changed to ${nextStatus.toUpperCase()}.${
        unassignedVehicleId ? " Vehicle was automatically unassigned." : ""
      }`
    );
  };

  const selectedVendorObject = getVendorById(vendors, selectedVendor);

  return (
    <div className="dm-page-container">
      {/* Header */}
      <div className="dm-header">
        <div>
          <h1 className="dm-title">Commercial Drivers</h1>
          <p className="dm-subtitle">
            Manage commercial driver roster, licence verification, and vehicle allocations across your vendor network.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="vh-btn vh-btn-primary"
            onClick={handleOpenAdd}
          >
            + Add Commercial Driver
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="dm-alert dm-alert-success" role="status">
          <span>&#10003; {notification}</span>
          <button
            type="button"
            className="dm-alert-dismiss"
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Vendor Filter Notice (if coming from vendor click) */}
      {selectedVendor !== "all" && selectedVendorObject && (
        <div className="dm-alert dm-alert-warning">
          <span>
            Filtering driver roster for vendor: <strong>{selectedVendorObject.name}</strong>{" "}
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
      <DriverActions stats={stats} />

      {/* Filters Bar */}
      <DriverFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedVendor={selectedVendor}
        onVendorChange={setSelectedVendor}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedAvailability={selectedAvailability}
        onAvailabilityChange={setSelectedAvailability}
        selectedVerification={selectedVerification}
        onVerificationChange={setSelectedVerification}
        selectedVehicleStatus={selectedVehicleStatus}
        onVehicleStatusChange={setSelectedVehicleStatus}
        selectedDLStatus={selectedDLStatus}
        onDLStatusChange={setSelectedDLStatus}
        vendors={vendors}
        onResetFilters={handleResetFilters}
      />

      {/* Driver Table */}
      <DriverTable
        drivers={processedDrivers}
        vendors={vendors}
        vehicles={vehicles}
        admin={admin}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        onView={handleOpenDetails}
        onEdit={handleOpenEdit}
        onAssignVehicle={handleOpenAssign}
        onUnassignVehicle={handleUnassignVehicle}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add / Edit Form Modal */}
      <DriverForm
        isOpen={isFormOpen}
        initialDriver={editingDriver}
        allDrivers={drivers}
        vendors={vendors}
        vehicles={vehicles}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveDriver}
      />

      {/* Assign Vehicle Modal */}
      <AssignVehicleModal
        isOpen={isAssignModalOpen}
        driver={driverToAssign}
        vendors={vendors}
        vehicles={vehicles}
        allDrivers={drivers}
        admin={admin}
        onClose={() => setIsAssignModalOpen(false)}
        onConfirmAssignment={handleConfirmAssignment}
      />

      {/* Driver Details Modal */}
      <DriverDetails
        isOpen={isDetailsOpen}
        driver={inspectingDriver}
        vendors={vendors}
        vehicles={vehicles}
        documents={documents}
        admin={admin}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleOpenEdit}
        onAssignVehicle={handleOpenAssign}
        onNavigateToCompliance={onNavigateToCompliance}
      />
    </div>
  );
}
