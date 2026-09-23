/**
 * vehicleUtils.js
 * Comprehensive utility functions for vehicle fleet management.
 */

export function getVehicleById(vehicles, vehicleId) {
  if (!vehicles || !vehicleId) return null;
  return vehicles.find((v) => v.id === vehicleId) || null;
}

export function getVendorById(vendors, vendorId, admin = null) {
  if (!vendorId) return null;
  if (admin && (admin.id === vendorId || vendorId === "admin-001")) {
    return {
      ...admin,
      level: admin.role || "Super Vendor",
      location: "Central Headquarters",
    };
  }
  return vendors?.find((v) => v.id === vendorId) || null;
}

export function getDriverById(drivers, driverId) {
  if (!drivers || !driverId) return null;
  return drivers.find((d) => d.id === driverId) || null;
}

export function getVehicleDocuments(documents, vehicleId) {
  if (!documents || !vehicleId) return [];
  return documents.filter((d) => d.vehicleId === vehicleId);
}

/**
 * Check if a registration number is unique across all vehicles (case-insensitive, trimmed).
 * If editing an existing vehicle, currentVehicleId is excluded from the check.
 */
export function isRegistrationUnique(vehicles, registrationNumber, currentVehicleId = null) {
  if (!vehicles || !registrationNumber) return false;
  const normalized = registrationNumber.trim().toUpperCase().replace(/\s+/g, "");

  return !vehicles.some((v) => {
    if (currentVehicleId && v.id === currentVehicleId) return false;
    const vReg = (v.registrationNumber || "").trim().toUpperCase().replace(/\s+/g, "");
    return vReg === normalized;
  });
}

/**
 * Check if a driver is available to be assigned to this vehicle.
 * Business rule: ONE ACTIVE DRIVER -> ONE ACTIVE VEHICLE.
 * Returns { available: boolean, conflictingVehicle?: object }
 */
export function checkDriverAvailability(drivers, vehicles, driverId, currentVehicleId = null) {
  if (!driverId) return { available: true };

  const driver = getDriverById(drivers, driverId);
  if (!driver) return { available: false, reason: "Driver does not exist." };

  if (driver.status === "inactive") {
    return { available: false, reason: "Driver account is currently inactive." };
  }

  // Check if assigned to another active vehicle
  const conflictingVehicle = vehicles.find((v) => {
    if (currentVehicleId && v.id === currentVehicleId) return false;
    return v.driverId === driverId && v.status !== "inactive";
  });

  if (conflictingVehicle) {
    return {
      available: false,
      conflictingVehicle,
      reason: `Driver ${driver.name} is already assigned to active vehicle ${conflictingVehicle.registrationNumber} (${conflictingVehicle.model}).`,
    };
  }

  return { available: true };
}

/**
 * Compute derived vehicle statistics dynamically from current vehicle state
 */
export function getVehicleStats(vehicles = []) {
  const total = vehicles.length;
  let active = 0;
  let inactive = 0;
  let nonCompliant = 0;
  let assigned = 0;
  let unassigned = 0;

  for (const v of vehicles) {
    const s = (v.status || "").toLowerCase();
    if (s === "active") active++;
    else if (s === "inactive") inactive++;
    else if (s === "non-compliant") nonCompliant++;

    if (v.driverId) assigned++;
    else unassigned++;
  }

  return {
    total,
    active,
    inactive,
    nonCompliant,
    assigned,
    unassigned,
  };
}

/**
 * Filter vehicles based on active filter criteria
 */
export function filterVehicles(
  vehicles = [],
  {
    searchQuery = "",
    selectedVendor = "all",
    selectedFuelType = "all",
    selectedStatus = "all",
    driverFilter = "all",
  },
  vendors = [],
  drivers = []
) {
  const q = searchQuery.trim().toLowerCase();

  return vehicles.filter((v) => {
    // 1. Vendor filter
    if (selectedVendor !== "all" && v.vendorId !== selectedVendor) {
      return false;
    }

    // 2. Fuel Type filter
    if (
      selectedFuelType !== "all" &&
      (v.fuelType || "").toLowerCase() !== selectedFuelType.toLowerCase()
    ) {
      return false;
    }

    // 3. Status filter
    if (
      selectedStatus !== "all" &&
      (v.status || "").toLowerCase() !== selectedStatus.toLowerCase()
    ) {
      return false;
    }

    // 4. Driver Assignment filter
    if (driverFilter === "assigned" && !v.driverId) {
      return false;
    }
    if (driverFilter === "unassigned" && v.driverId) {
      return false;
    }

    // 5. Search Query filter (matches registration, model, vendor name, or driver name)
    if (q) {
      const regMatch = (v.registrationNumber || "").toLowerCase().includes(q);
      const modelMatch = (v.model || "").toLowerCase().includes(q);
      const idMatch = (v.id || "").toLowerCase().includes(q);

      const vendor = getVendorById(vendors, v.vendorId);
      const vendorMatch = vendor ? (vendor.name || "").toLowerCase().includes(q) : false;

      const driver = getDriverById(drivers, v.driverId);
      const driverMatch = driver ? (driver.name || "").toLowerCase().includes(q) : false;

      if (!regMatch && !modelMatch && !idMatch && !vendorMatch && !driverMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort vehicles by given key and direction
 */
export function sortVehicles(vehicles = [], sortKey = "registration", sortOrder = "asc", vendors = []) {
  return [...vehicles].sort((a, b) => {
    let valA = "";
    let valB = "";

    switch (sortKey) {
      case "registration":
        valA = (a.registrationNumber || "").toLowerCase();
        valB = (b.registrationNumber || "").toLowerCase();
        break;
      case "vendor":
        valA = (getVendorById(vendors, a.vendorId)?.name || "").toLowerCase();
        valB = (getVendorById(vendors, b.vendorId)?.name || "").toLowerCase();
        break;
      case "model":
        valA = (a.model || "").toLowerCase();
        valB = (b.model || "").toLowerCase();
        break;
      case "year":
        valA = a.year || 0;
        valB = b.year || 0;
        break;
      case "seating":
        valA = a.seatingCapacity || 0;
        valB = b.seatingCapacity || 0;
        break;
      case "status":
        valA = (a.status || "").toLowerCase();
        valB = (b.status || "").toLowerCase();
        break;
      default:
        valA = (a.registrationNumber || "").toLowerCase();
        valB = (b.registrationNumber || "").toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
