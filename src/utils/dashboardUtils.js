/**
 * dashboardUtils.js
 * Central operational analytics engine for Project 2 VMS Dashboard.
 * 100% derived from existing application state and shared domain utilities.
 */

import {
  getDocumentStatus,
  formatDocDate,
  formatExpiryDescription,
  getVehicleComplianceStatus,
  getDriverComplianceStatus,
  isVehicleOperational,
  getComplianceStats,
  getExpiringDocuments,
  getDocShortLabel,
} from "./complianceUtils";

import {
  getFleetStatusBreakdown,
  getComplianceBreakdown,
  getDriverAvailabilityBreakdown,
  getDriverStatusBreakdown,
} from "./reportUtils";

import { buildVendorTree } from "./hierarchyUtils";

/**
 * Filter data by selected vendor scope if specified
 */
export function scopeDataByVendor({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  selectedVendorId = "all",
}) {
  if (!selectedVendorId || selectedVendorId === "all") {
    return {
      scopedVendors: vendors,
      scopedVehicles: vehicles,
      scopedDrivers: drivers,
      scopedDocuments: documents,
    };
  }

  const scopedVendors = vendors.filter((v) => v.id === selectedVendorId);
  const scopedVehicles = vehicles.filter((v) => v.vendorId === selectedVendorId);
  const scopedDrivers = drivers.filter((d) => d.vendorId === selectedVendorId);

  const scopedDocuments = documents.filter((doc) => {
    if (doc.ownerType === "vehicle") {
      const v = vehicles.find((item) => item.id === doc.ownerId);
      return v && v.vendorId === selectedVendorId;
    }
    if (doc.ownerType === "driver") {
      const d = drivers.find((item) => item.id === doc.ownerId);
      return d && d.vendorId === selectedVendorId;
    }
    return false;
  });

  return {
    scopedVendors,
    scopedVehicles,
    scopedDrivers,
    scopedDocuments,
  };
}

/**
 * Top summary KPI statistics for high-level cards
 */
export function getDashboardStats({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  selectedVendorId = "all",
}) {
  const { scopedVehicles, scopedDrivers, scopedDocuments } = scopeDataByVendor({
    vendors,
    vehicles,
    drivers,
    documents,
    selectedVendorId,
  });

  const totalVendors = vendors.length; // Global network size
  const totalVehicles = scopedVehicles.length;
  const totalDrivers = scopedDrivers.length;

  const activeVehicles = scopedVehicles.filter((v) => v.status === "active").length;

  // Non-compliant vehicles count
  let nonCompliantVehicles = 0;
  let blockedVehicles = 0;
  scopedVehicles.forEach((v) => {
    const comp = getVehicleComplianceStatus(documents, v.id);
    if (comp.status === "non_compliant") {
      nonCompliantVehicles++;
    }
    if (comp.operationalStatus === "blocked") {
      blockedVehicles++;
    }
  });

  // Expiring documents count (expired + expiring within 30 days)
  let expiringDocsCount = 0;
  scopedDocuments.forEach((doc) => {
    const status = getDocumentStatus(doc.expiryDate);
    if (status === "expired" || status === "expiring_soon") {
      expiringDocsCount++;
    }
  });

  return {
    totalVendors,
    totalVehicles,
    totalDrivers,
    activeVehicles,
    nonCompliantVehicles,
    blockedVehicles,
    expiringDocuments: expiringDocsCount,
  };
}

/**
 * Concise fleet summary with dispatch status
 */
export function getFleetOverview({
  vehicles = [],
  documents = [],
  selectedVendorId = "all",
}) {
  const targetVehicles =
    selectedVendorId && selectedVendorId !== "all"
      ? vehicles.filter((v) => v.vendorId === selectedVendorId)
      : vehicles;

  return getFleetStatusBreakdown(targetVehicles, documents);
}

/**
 * Vendor network overview with derived counts from vehicle and driver arrays
 */
export function getVendorOverview({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  limit = 5,
}) {
  const vendorList = vendors.map((vendor) => {
    const vVehicles = vehicles.filter((v) => v.vendorId === vendor.id);
    const vDrivers = drivers.filter((d) => d.vendorId === vendor.id);

    let nonCompliantCount = 0;
    let blockedCount = 0;

    vVehicles.forEach((v) => {
      const comp = getVehicleComplianceStatus(documents, v.id);
      if (comp.status === "non_compliant") nonCompliantCount++;
      if (comp.operationalStatus === "blocked") blockedCount++;
    });

    const compliantRate =
      vVehicles.length > 0
        ? Math.round(((vVehicles.length - nonCompliantCount) / vVehicles.length) * 100)
        : 100;

    return {
      id: vendor.id,
      name: vendor.name,
      level: vendor.level || "Regional Vendor",
      location: vendor.location || "India",
      status: vendor.status || "active",
      vehicleCount: vVehicles.length,
      driverCount: vDrivers.length,
      nonCompliantCount,
      blockedCount,
      compliantRate,
    };
  });

  // Sort by vehicle count descending
  const sorted = [...vendorList].sort((a, b) => b.vehicleCount - a.vehicleCount);
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Compact hierarchy summary derived from existing buildVendorTree
 */
export function getCompactHierarchy({ vendors = [], admin = null }) {
  if (!vendors || vendors.length === 0) return null;
  return buildVendorTree(vendors, admin);
}

/**
 * Compliance overview metrics reusing complianceUtils
 */
export function getComplianceOverview({
  documents = [],
  vehicles = [],
  drivers = [],
  selectedVendorId = "all",
}) {
  const { scopedVehicles, scopedDrivers, scopedDocuments } = scopeDataByVendor({
    vehicles,
    drivers,
    documents,
    selectedVendorId,
  });

  const stats = getComplianceStats(scopedDocuments, scopedVehicles, scopedDrivers);
  const breakdown = getComplianceBreakdown(scopedDocuments, scopedVehicles, scopedDrivers);

  const totalVehicles = scopedVehicles.length;
  const compliantVehicles = breakdown.vehicles.compliant;
  const vehicleComplianceRate =
    totalVehicles > 0 ? Math.round((compliantVehicles / totalVehicles) * 100) : 100;

  const totalDrivers = scopedDrivers.length;
  const compliantDrivers = breakdown.drivers.compliant;
  const driverComplianceRate =
    totalDrivers > 0 ? Math.round((compliantDrivers / totalDrivers) * 100) : 100;

  return {
    documents: {
      total: scopedDocuments.length,
      valid: stats.valid,
      expiringSoon: stats.expiringSoon,
      expired: stats.expired,
      missing: stats.missing,
    },
    vehicles: {
      total: totalVehicles,
      compliant: breakdown.vehicles.compliant,
      expiringSoon: breakdown.vehicles.expiring,
      nonCompliant: breakdown.vehicles.nonCompliant,
      blocked: stats.blockedVehicles,
      rate: vehicleComplianceRate,
    },
    drivers: {
      total: totalDrivers,
      compliant: breakdown.drivers.compliant,
      expiringSoon: breakdown.drivers.expiring,
      nonCompliant: breakdown.drivers.nonCompliant,
      rate: driverComplianceRate,
    },
  };
}

/**
 * Driver workforce overview and real-time availability breakdown
 */
export function getDriverOverview({ drivers = [], selectedVendorId = "all" }) {
  const targetDrivers =
    selectedVendorId && selectedVendorId !== "all"
      ? drivers.filter((d) => d.vendorId === selectedVendorId)
      : drivers;

  const statusData = getDriverStatusBreakdown(targetDrivers);
  const availabilityData = getDriverAvailabilityBreakdown(targetDrivers);

  return {
    total: targetDrivers.length,
    active: statusData.active,
    inactive: statusData.inactive,
    availability: availabilityData,
  };
}

/**
 * Top upcoming document renewals (expired first, then nearest expiry)
 */
export function getUpcomingExpiries({
  documents = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  selectedVendorId = "all",
  limit = 5,
}) {
  const { scopedDocuments } = scopeDataByVendor({
    vendors,
    vehicles,
    drivers,
    documents,
    selectedVendorId,
  });

  const expiringList = getExpiringDocuments(scopedDocuments, 30);

  const formatted = expiringList.map((doc) => {
    let ownerLabel = "—";
    let ownerTypeLabel = doc.ownerType === "vehicle" ? "Vehicle" : "Driver";
    let vendorName = "—";
    let vehicleReg = "";

    if (doc.ownerType === "vehicle") {
      const v = vehicles.find((item) => item.id === doc.ownerId);
      if (v) {
        ownerLabel = v.registrationNumber;
        vehicleReg = v.registrationNumber;
        const vend = vendors.find((item) => item.id === v.vendorId);
        if (vend) vendorName = vend.name;
      }
    } else if (doc.ownerType === "driver") {
      const d = drivers.find((item) => item.id === doc.ownerId);
      if (d) {
        ownerLabel = d.name;
        const vend = vendors.find((item) => item.id === d.vendorId);
        if (vend) vendorName = vend.name;
        const v = vehicles.find((item) => item.id === d.vehicleId);
        if (v) vehicleReg = v.registrationNumber;
      }
    }

    return {
      id: doc.id,
      type: doc.type,
      shortType: getDocShortLabel(doc.type),
      documentNumber: doc.documentNumber,
      ownerType: doc.ownerType,
      ownerTypeLabel,
      ownerId: doc.ownerId,
      ownerLabel,
      vendorName,
      vehicleReg,
      expiryDate: doc.expiryDate,
      formattedExpiry: formatDocDate(doc.expiryDate),
      daysRemaining: doc.daysRemaining,
      status: doc.dynamicStatus,
      description: formatExpiryDescription(doc.expiryDate),
    };
  });

  return limit ? formatted.slice(0, limit) : formatted;
}

/**
 * High-priority operational alerts dynamically derived
 */
export function getOperationalAlerts({
  vehicles = [],
  drivers = [],
  documents = [],
  selectedVendorId = "all",
}) {
  const { scopedVehicles, scopedDrivers, scopedDocuments } = scopeDataByVendor({
    vehicles,
    drivers,
    documents,
    selectedVendorId,
  });

  const alerts = [];

  // 1. Blocked / Non-Compliant Vehicles
  const blockedCabs = [];
  scopedVehicles.forEach((v) => {
    const comp = getVehicleComplianceStatus(documents, v.id);
    if (comp.operationalStatus === "blocked") {
      blockedCabs.push({
        id: v.id,
        reg: v.registrationNumber,
        reasons: comp.reasons,
      });
    }
  });

  if (blockedCabs.length > 0) {
    alerts.push({
      id: "alert-blocked-cabs",
      severity: "critical",
      title: `${blockedCabs.length} commercial cab${blockedCabs.length > 1 ? "s are" : " is"} currently blocked from dispatch`,
      description: `Mandatory regulatory documents missing or expired (${blockedCabs.map((c) => c.reg).slice(0, 3).join(", ")}${blockedCabs.length > 3 ? "..." : ""}).`,
      actionLabel: "Resolve Vehicles",
      targetRoute: "vehicles",
      count: blockedCabs.length,
    });
  }

  // 2. Expired Documents
  let expiredDocCount = 0;
  scopedDocuments.forEach((d) => {
    if (getDocumentStatus(d.expiryDate) === "expired") {
      expiredDocCount++;
    }
  });

  if (expiredDocCount > 0) {
    alerts.push({
      id: "alert-expired-docs",
      severity: "critical",
      title: `${expiredDocCount} document${expiredDocCount > 1 ? "s have" : " has"} expired and require immediate renewal`,
      description: "Immediate action required to restore operational compliance across fleet assets.",
      actionLabel: "Renew Documents",
      targetRoute: "compliance",
      count: expiredDocCount,
    });
  }

  // 3. Documents Expiring Soon (within 30 days)
  let expiringSoonCount = 0;
  scopedDocuments.forEach((d) => {
    if (getDocumentStatus(d.expiryDate) === "expiring_soon") {
      expiringSoonCount++;
    }
  });

  if (expiringSoonCount > 0) {
    alerts.push({
      id: "alert-expiring-soon",
      severity: "warning",
      title: `${expiringSoonCount} document${expiringSoonCount > 1 ? "s expire" : " expires"} within the next 30 days`,
      description: "Notify vendor partners and initiate renewal processes before expiration.",
      actionLabel: "View Expiries",
      targetRoute: "compliance",
      count: expiringSoonCount,
    });
  }

  // 4. Drivers with Non-Compliant / Expired Driving License
  const nonCompliantDrivers = [];
  scopedDrivers.forEach((d) => {
    const comp = getDriverComplianceStatus(documents, d.id);
    if (comp.status === "non_compliant") {
      nonCompliantDrivers.push({
        id: d.id,
        name: d.name,
        reasons: comp.reasons,
      });
    }
  });

  if (nonCompliantDrivers.length > 0) {
    alerts.push({
      id: "alert-driver-dl",
      severity: "critical",
      title: `${nonCompliantDrivers.length} driver${nonCompliantDrivers.length > 1 ? "s have" : " has"} an expired or missing Driving License`,
      description: `Regulatory violation: Drivers (${nonCompliantDrivers.map((d) => d.name).slice(0, 3).join(", ")}) cannot be dispatched.`,
      actionLabel: "Check Drivers",
      targetRoute: "drivers",
      count: nonCompliantDrivers.length,
    });
  }

  return alerts;
}
