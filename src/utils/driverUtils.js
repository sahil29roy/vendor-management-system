/**
 * driverUtils.js
 * Comprehensive utility functions for driver roster and license compliance management.
 */

export function getDriverById(drivers, driverId) {
  if (!drivers || !driverId) return null;
  return drivers.find((d) => d.id === driverId) || null;
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

export function getVehicleById(vehicles, vehicleId) {
  if (!vehicles || !vehicleId) return null;
  return vehicles.find((v) => v.id === vehicleId) || null;
}

export function getDriverDocuments(documents, driverId) {
  if (!documents || !driverId) return [];
  return documents.filter(
    (d) => d.ownerId === driverId || (d.ownerType === "driver" && d.ownerId === driverId)
  );
}

/**
 * Calculate Driving Licence (DL) status from expiry date.
 * Rules:
 * - expiryDate < today -> "Expired"
 * - expiryDate within 30 days of today -> "Expiring Soon"
 * - otherwise -> "Valid"
 */
export function getLicenseStatus(expiryDate) {
  if (!expiryDate) return "Expired";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return "Expired";

  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Expired";
  } else if (diffDays <= 30) {
    return "Expiring Soon";
  }

  return "Valid";
}

/**
 * Format date nicely for display (e.g. "14 May 2028")
 */
export function formatDLDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Check if a driver's licence number is unique across all drivers.
 */
export function isLicenseUnique(drivers, licenseNumber, currentDriverId = null) {
  if (!drivers || !licenseNumber) return false;
  const normalized = licenseNumber.trim().toUpperCase().replace(/[\s-]/g, "");

  return !drivers.some((d) => {
    if (currentDriverId && d.id === currentDriverId) return false;
    const dLic = (d.licenseNumber || "").trim().toUpperCase().replace(/[\s-]/g, "");
    return dLic === normalized;
  });
}

/**
 * Check if a vehicle is available for a driver.
 * Rules:
 * - Vehicle must belong to the same vendor as the driver.
 * - Vehicle must not be assigned to another active driver.
 */
export function isVehicleAvailableForDriver(
  vehicles,
  drivers,
  vehicleId,
  driverVendorId,
  currentDriverId = null
) {
  if (!vehicleId) return { available: true };

  const vehicle = getVehicleById(vehicles, vehicleId);
  if (!vehicle) {
    return { available: false, reason: "Vehicle does not exist." };
  }

  // Cross-vendor validation: driver & vehicle must share vendorId
  if (driverVendorId && vehicle.vendorId !== driverVendorId) {
    return {
      available: false,
      reason: "Cross-vendor assignment is strictly prohibited. Vehicle belongs to a different vendor.",
    };
  }

  // Check if assigned to another active driver in vehicles array
  if (vehicle.driverId && vehicle.driverId !== currentDriverId) {
    const existingDriver = getDriverById(drivers, vehicle.driverId);
    return {
      available: false,
      conflictingDriver: existingDriver,
      reason: `Vehicle ${vehicle.registrationNumber} is already assigned to active driver ${existingDriver?.name || vehicle.driverId}.`,
    };
  }

  // Double check in drivers array
  const conflictingDriver = drivers.find((d) => {
    if (currentDriverId && d.id === currentDriverId) return false;
    return d.vehicleId === vehicleId && d.status !== "inactive";
  });

  if (conflictingDriver) {
    return {
      available: false,
      conflictingDriver,
      reason: `Vehicle ${vehicle.registrationNumber} is already assigned to active driver ${conflictingDriver.name}.`,
    };
  }

  return { available: true };
}

/**
 * Get all vehicles belonging to a vendor with their availability status
 */
export function getAvailableVehiclesForVendor(vehicles, vendorId, currentDriverId = null) {
  if (!vehicles || !vendorId) return [];

  return vehicles
    .filter((v) => v.vendorId === vendorId)
    .map((v) => {
      const isAssignedToOther = v.driverId && v.driverId !== currentDriverId;
      return {
        ...v,
        isAvailable: !isAssignedToOther && v.status !== "inactive",
      };
    });
}

/**
 * Compute derived driver statistics dynamically
 */
export function getDriverStats(drivers = []) {
  const total = drivers.length;
  let active = 0;
  let inactive = 0;
  let available = 0;
  let onTrip = 0;
  let unassigned = 0;
  let pendingVerification = 0;
  let expiredDL = 0;

  for (const d of drivers) {
    if (d.status === "active") active++;
    else if (d.status === "inactive") inactive++;

    const avail = (d.availability || "Available").toLowerCase();
    if (avail === "available") available++;
    else if (avail === "on trip") onTrip++;

    if (!d.vehicleId) unassigned++;

    const verif = (d.verification || "Verified").toLowerCase();
    if (verif === "pending" || verif === "pending verification") {
      pendingVerification++;
    }

    if (getLicenseStatus(d.licenseExpiry) === "Expired") {
      expiredDL++;
    }
  }

  return {
    total,
    active,
    inactive,
    available,
    onTrip,
    unassigned,
    pendingVerification,
    expiredDL,
  };
}

/**
 * Filter drivers based on multiple search and dropdown criteria
 */
export function filterDrivers(
  drivers = [],
  {
    searchQuery = "",
    selectedVendor = "all",
    selectedStatus = "all",
    selectedAvailability = "all",
    selectedVerification = "all",
    selectedVehicleStatus = "all",
    selectedDLStatus = "all",
  },
  vendors = [],
  vehicles = []
) {
  const q = searchQuery.trim().toLowerCase();

  return drivers.filter((d) => {
    // 1. Vendor
    if (selectedVendor !== "all" && d.vendorId !== selectedVendor) {
      return false;
    }

    // 2. Status
    if (selectedStatus !== "all" && (d.status || "").toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }

    // 3. Availability
    if (selectedAvailability !== "all") {
      const currentAvail = (d.availability || "Available").toLowerCase();
      if (currentAvail !== selectedAvailability.toLowerCase()) {
        return false;
      }
    }

    // 4. Verification
    if (selectedVerification !== "all") {
      const currentVerif = (d.verification || "Verified").toLowerCase();
      if (currentVerif !== selectedVerification.toLowerCase()) {
        return false;
      }
    }

    // 5. Vehicle Assignment
    if (selectedVehicleStatus === "assigned" && !d.vehicleId) {
      return false;
    }
    if (selectedVehicleStatus === "unassigned" && d.vehicleId) {
      return false;
    }

    // 6. DL Status
    if (selectedDLStatus !== "all") {
      const dlStat = getLicenseStatus(d.licenseExpiry).toLowerCase();
      if (dlStat !== selectedDLStatus.toLowerCase()) {
        return false;
      }
    }

    // 7. Search Query (name, phone, email, license, vendor name, vehicle registration)
    if (q) {
      const nameMatch = (d.name || "").toLowerCase().includes(q);
      const phoneMatch = (d.phone || "").toLowerCase().includes(q);
      const emailMatch = (d.email || "").toLowerCase().includes(q);
      const licenseMatch = (d.licenseNumber || "").toLowerCase().includes(q);

      const vendor = getVendorById(vendors, d.vendorId);
      const vendorMatch = vendor ? (vendor.name || "").toLowerCase().includes(q) : false;

      const vehicle = getVehicleById(vehicles, d.vehicleId);
      const vehicleMatch = vehicle
        ? (vehicle.registrationNumber || "").toLowerCase().includes(q) ||
          (vehicle.model || "").toLowerCase().includes(q)
        : false;

      if (!nameMatch && !phoneMatch && !emailMatch && !licenseMatch && !vendorMatch && !vehicleMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort drivers array by field and order
 */
export function sortDrivers(
  drivers = [],
  sortKey = "name",
  sortOrder = "asc",
  vendors = [],
  vehicles = []
) {
  return [...drivers].sort((a, b) => {
    let valA = "";
    let valB = "";

    switch (sortKey) {
      case "name":
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
        break;
      case "vendor":
        valA = (getVendorById(vendors, a.vendorId)?.name || "").toLowerCase();
        valB = (getVendorById(vendors, b.vendorId)?.name || "").toLowerCase();
        break;
      case "vehicle":
        valA = (getVehicleById(vehicles, a.vehicleId)?.registrationNumber || "").toLowerCase();
        valB = (getVehicleById(vehicles, b.vehicleId)?.registrationNumber || "").toLowerCase();
        break;
      case "licenseExpiry":
        valA = a.licenseExpiry ? new Date(a.licenseExpiry).getTime() : 0;
        valB = b.licenseExpiry ? new Date(b.licenseExpiry).getTime() : 0;
        break;
      case "availability":
        valA = (a.availability || "Available").toLowerCase();
        valB = (b.availability || "Available").toLowerCase();
        break;
      case "status":
        valA = (a.status || "").toLowerCase();
        valB = (b.status || "").toLowerCase();
        break;
      default:
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
