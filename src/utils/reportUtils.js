/**
 * reportUtils.js
 * Comprehensive business analytics and calculation engine for Project 2 VMS.
 * All metrics are derived dynamically from active application state and compliance rules.
 */

import {
  getDocumentStatus,
  getDaysUntilExpiry,
  formatDocDate,
  formatExpiryDescription,
  getVehicleComplianceStatus,
  getDriverComplianceStatus,
  isVehicleOperational,
  getExpiringDocuments,
} from "./complianceUtils";

/**
 * Filter application state by user-selected report filters
 */
export function filterReportData({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  filters = {},
}) {
  const {
    vendorId = "all",
    dateRange = "all",
    vehicleStatus = "all",
    complianceStatus = "all",
  } = filters;

  // 1. Filter Vendors
  let filteredVendors = vendors;
  if (vendorId !== "all") {
    filteredVendors = vendors.filter((v) => v.id === vendorId);
  }

  // 2. Filter Vehicles
  let filteredVehicles = vehicles;
  if (vendorId !== "all") {
    filteredVehicles = filteredVehicles.filter((v) => v.vendorId === vendorId);
  }
  if (vehicleStatus !== "all") {
    if (vehicleStatus === "active" || vehicleStatus === "inactive") {
      filteredVehicles = filteredVehicles.filter((v) => v.status === vehicleStatus);
    } else if (vehicleStatus === "blocked") {
      filteredVehicles = filteredVehicles.filter(
        (v) => !isVehicleOperational(documents, v.id)
      );
    }
  }
  if (complianceStatus !== "all") {
    filteredVehicles = filteredVehicles.filter((v) => {
      const comp = getVehicleComplianceStatus(documents, v.id);
      return comp.status === complianceStatus;
    });
  }

  // 3. Filter Drivers
  let filteredDrivers = drivers;
  if (vendorId !== "all") {
    filteredDrivers = filteredDrivers.filter((d) => d.vendorId === vendorId);
  }
  if (complianceStatus !== "all") {
    filteredDrivers = filteredDrivers.filter((d) => {
      const comp = getDriverComplianceStatus(documents, d.id);
      return comp.status === complianceStatus;
    });
  }

  // 4. Filter Documents
  let filteredDocuments = documents;
  if (vendorId !== "all") {
    filteredDocuments = filteredDocuments.filter((doc) => {
      if (doc.ownerType === "vehicle") {
        const v = vehicles.find((item) => item.id === doc.ownerId);
        return v && v.vendorId === vendorId;
      }
      if (doc.ownerType === "driver") {
        const d = drivers.find((item) => item.id === doc.ownerId);
        return d && d.vendorId === vendorId;
      }
      return false;
    });
  }

  // 5. Date Range Filter (based on creation/expiry)
  if (dateRange !== "all") {
    const now = new Date();
    let daysCutoff = 3650; // default large
    if (dateRange === "7_days") daysCutoff = 7;
    else if (dateRange === "30_days") daysCutoff = 30;
    else if (dateRange === "90_days") daysCutoff = 90;

    const cutoffDate = new Date(now.getTime() - daysCutoff * 24 * 60 * 60 * 1000);

    // Filter by createdAt if available, otherwise preserve
    filteredVendors = filteredVendors.filter((v) => {
      if (!v.createdAt) return true;
      return new Date(v.createdAt) >= cutoffDate;
    });

    filteredDocuments = filteredDocuments.filter((doc) => {
      if (!doc.issueDate) return true;
      return new Date(doc.issueDate) >= cutoffDate;
    });
  }

  return {
    vendors: filteredVendors,
    vehicles: filteredVehicles,
    drivers: filteredDrivers,
    documents: filteredDocuments,
  };
}

/**
 * Top-level KPI Summary Statistics
 */
export function getReportSummary(vendors = [], vehicles = [], drivers = [], documents = []) {
  const totalVendors = vendors.length;
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "active").length;
  const inactiveVehicles = totalVehicles - activeVehicles;

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.status === "active").length;
  const inactiveDrivers = totalDrivers - activeDrivers;

  let nonCompliantVehicles = 0;
  let blockedVehicles = 0;
  let compliantVehicles = 0;

  vehicles.forEach((v) => {
    const comp = getVehicleComplianceStatus(documents, v.id);
    if (comp.status === "non_compliant") {
      nonCompliantVehicles++;
    } else if (comp.status === "compliant") {
      compliantVehicles++;
    }
    if (comp.operationalStatus === "blocked") {
      blockedVehicles++;
    }
  });

  let expiringDocs = 0;
  let expiredDocs = 0;
  let validDocs = 0;

  documents.forEach((d) => {
    const s = getDocumentStatus(d.expiryDate);
    if (s === "expiring_soon") expiringDocs++;
    else if (s === "expired") expiredDocs++;
    else if (s === "valid") validDocs++;
  });

  const complianceRate = totalVehicles > 0
    ? Math.round((compliantVehicles / totalVehicles) * 100)
    : 100;

  return {
    totalVendors,
    totalVehicles,
    activeVehicles,
    inactiveVehicles,
    totalDrivers,
    activeDrivers,
    inactiveDrivers,
    nonCompliantVehicles,
    blockedVehicles,
    expiringDocs,
    expiredDocs,
    validDocs,
    complianceRate,
  };
}

/**
 * Vendor Overview Scorecard
 */
export function getVendorOverviewReport(vendors = [], vehicles = [], drivers = [], documents = []) {
  return vendors.map((vendor) => {
    const vVehicles = vehicles.filter((v) => v.vendorId === vendor.id);
    const vDrivers = drivers.filter((d) => d.vendorId === vendor.id);

    const totalVehicles = vVehicles.length;
    const activeVehicles = vVehicles.filter((v) => v.status === "active").length;
    const inactiveVehicles = totalVehicles - activeVehicles;

    const totalDrivers = vDrivers.length;
    const activeDrivers = vDrivers.filter((d) => d.status === "active").length;
    const inactiveDrivers = totalDrivers - activeDrivers;

    let compliantCount = 0;
    let expiringCount = 0;
    let nonCompliantCount = 0;
    let blockedCount = 0;

    vVehicles.forEach((v) => {
      const comp = getVehicleComplianceStatus(documents, v.id);
      if (comp.status === "compliant") compliantCount++;
      else if (comp.status === "expiring_soon") expiringCount++;
      else if (comp.status === "non_compliant") nonCompliantCount++;

      if (comp.operationalStatus === "blocked") blockedCount++;
    });

    const complianceRate = totalVehicles > 0
      ? Math.round(((totalVehicles - nonCompliantCount) / totalVehicles) * 100)
      : 100;

    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      level: vendor.level || "Regional Vendor",
      location: vendor.location || "India",
      status: vendor.status || "active",
      totalVehicles,
      activeVehicles,
      inactiveVehicles,
      totalDrivers,
      activeDrivers,
      inactiveDrivers,
      compliantCount,
      expiringCount,
      nonCompliantCount,
      blockedCount,
      complianceRate,
    };
  });
}

/**
 * Fleet Status & Dispatch Eligibility Breakdown
 */
export function getFleetStatusBreakdown(vehicles = [], documents = []) {
  const total = vehicles.length;
  if (total === 0) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      compliant: 0,
      expiringSoon: 0,
      nonCompliant: 0,
      allowed: 0,
      blocked: 0,
    };
  }

  let active = 0;
  let inactive = 0;
  let compliant = 0;
  let expiringSoon = 0;
  let nonCompliant = 0;
  let allowed = 0;
  let blocked = 0;

  vehicles.forEach((v) => {
    if (v.status === "active") active++;
    else inactive++;

    const comp = getVehicleComplianceStatus(documents, v.id);
    if (comp.status === "compliant") compliant++;
    else if (comp.status === "expiring_soon") expiringSoon++;
    else if (comp.status === "non_compliant") nonCompliant++;

    if (comp.operationalStatus === "blocked") blocked++;
    else allowed++;
  });

  return {
    total,
    active,
    inactive,
    compliant,
    expiringSoon,
    nonCompliant,
    allowed,
    blocked,
    activePct: Math.round((active / total) * 100),
    inactivePct: Math.round((inactive / total) * 100),
    compliantPct: Math.round((compliant / total) * 100),
    nonCompliantPct: Math.round((nonCompliant / total) * 100),
    blockedPct: Math.round((blocked / total) * 100),
    allowedPct: Math.round((allowed / total) * 100),
  };
}

/**
 * Compliance Breakdown by Component (Documents, Vehicles, Drivers)
 */
export function getComplianceBreakdown(documents = [], vehicles = [], drivers = []) {
  let docValid = 0;
  let docExpiring = 0;
  let docExpired = 0;

  documents.forEach((d) => {
    const s = getDocumentStatus(d.expiryDate);
    if (s === "valid") docValid++;
    else if (s === "expiring_soon") docExpiring++;
    else if (s === "expired") docExpired++;
  });

  let vehCompliant = 0;
  let vehExpiring = 0;
  let vehNonCompliant = 0;

  vehicles.forEach((v) => {
    const comp = getVehicleComplianceStatus(documents, v.id);
    if (comp.status === "compliant") vehCompliant++;
    else if (comp.status === "expiring_soon") vehExpiring++;
    else if (comp.status === "non_compliant") vehNonCompliant++;
  });

  let drvCompliant = 0;
  let drvExpiring = 0;
  let drvNonCompliant = 0;

  drivers.forEach((d) => {
    const comp = getDriverComplianceStatus(documents, d.id);
    if (comp.status === "compliant") drvCompliant++;
    else if (comp.status === "expiring_soon") drvExpiring++;
    else if (comp.status === "non_compliant") drvNonCompliant++;
  });

  return {
    documents: {
      total: documents.length,
      valid: docValid,
      expiring: docExpiring,
      expired: docExpired,
    },
    vehicles: {
      total: vehicles.length,
      compliant: vehCompliant,
      expiring: vehExpiring,
      nonCompliant: vehNonCompliant,
    },
    drivers: {
      total: drivers.length,
      compliant: drvCompliant,
      expiring: drvExpiring,
      nonCompliant: drvNonCompliant,
    },
  };
}

/**
 * Expiry Audit Report sorted by urgency (Expired first, then nearest expiry)
 */
export function getExpiringDocumentsReport(
  documents = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  thresholdDays = 30
) {
  const expiring = getExpiringDocuments(documents, thresholdDays);

  return expiring.map((doc) => {
    let ownerName = "—";
    let vehiclePlate = "—";
    let vendorName = "—";

    if (doc.ownerType === "vehicle") {
      const v = vehicles.find((item) => item.id === doc.ownerId);
      if (v) {
        ownerName = `${v.registrationNumber} (${v.model})`;
        vehiclePlate = v.registrationNumber;
        const vend = vendors.find((item) => item.id === v.vendorId);
        if (vend) vendorName = vend.name;
      }
    } else if (doc.ownerType === "driver") {
      const d = drivers.find((item) => item.id === doc.ownerId);
      if (d) {
        ownerName = `${d.name} (${d.phone})`;
        const vend = vendors.find((item) => item.id === d.vendorId);
        if (vend) vendorName = vend.name;
        const v = vehicles.find((item) => item.id === d.vehicleId);
        if (v) vehiclePlate = v.registrationNumber;
      }
    }

    return {
      id: doc.id,
      type: doc.type,
      documentNumber: doc.documentNumber,
      ownerType: doc.ownerType,
      ownerName,
      vendorName,
      vehiclePlate,
      issueDate: formatDocDate(doc.issueDate),
      expiryDate: formatDocDate(doc.expiryDate),
      daysRemaining: doc.daysRemaining,
      status: doc.dynamicStatus,
      description: formatExpiryDescription(doc.expiryDate),
    };
  });
}

/**
 * Vehicle Model Distribution Breakdown
 */
export function getVehicleTypeBreakdown(vehicles = []) {
  const modelCounts = {};
  vehicles.forEach((v) => {
    const m = v.model || "Unknown Model";
    modelCounts[m] = (modelCounts[m] || 0) + 1;
  });

  const total = vehicles.length;
  const items = Object.entries(modelCounts).map(([model, count]) => ({
    model,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  // Sort descending by count
  return items.sort((a, b) => b.count - a.count);
}

/**
 * Fuel Type Distribution Breakdown
 */
export function getFuelTypeBreakdown(vehicles = []) {
  const standardFuelTypes = ["Diesel", "Petrol", "CNG", "Electric"];
  const counts = { Diesel: 0, Petrol: 0, CNG: 0, Electric: 0 };

  vehicles.forEach((v) => {
    const f = v.fuelType || "Petrol";
    if (counts[f] !== undefined) {
      counts[f]++;
    } else {
      counts[f] = (counts[f] || 0) + 1;
    }
  });

  const total = vehicles.length;
  return standardFuelTypes.map((fuel) => ({
    fuel,
    count: counts[fuel] || 0,
    percentage: total > 0 ? Math.round(((counts[fuel] || 0) / total) * 100) : 0,
  }));
}

/**
 * Driver Availability Breakdown
 */
export function getDriverAvailabilityBreakdown(drivers = []) {
  const counts = { Available: 0, "On Trip": 0, "Off Duty": 0, Unavailable: 0 };

  drivers.forEach((d) => {
    const avail = d.availability || "Available";
    if (counts[avail] !== undefined) {
      counts[avail]++;
    } else {
      counts[avail] = (counts[avail] || 0) + 1;
    }
  });

  const total = drivers.length;
  return Object.entries(counts).map(([availability, count]) => ({
    availability,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

/**
 * Driver Status Breakdown
 */
export function getDriverStatusBreakdown(drivers = []) {
  const total = drivers.length;
  const active = drivers.filter((d) => d.status === "active").length;
  const inactive = total - active;

  return {
    total,
    active,
    inactive,
    activePct: total > 0 ? Math.round((active / total) * 100) : 0,
    inactivePct: total > 0 ? Math.round((inactive / total) * 100) : 0,
  };
}

/**
 * Driver Verification Breakdown
 */
export function getDriverVerificationBreakdown(drivers = []) {
  const counts = { Verified: 0, Pending: 0, Rejected: 0 };

  drivers.forEach((d) => {
    const v = d.verification || "Verified";
    if (counts[v] !== undefined) {
      counts[v]++;
    } else {
      counts[v] = (counts[v] || 0) + 1;
    }
  });

  const total = drivers.length;
  return Object.entries(counts).map(([verification, count]) => ({
    verification,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}
