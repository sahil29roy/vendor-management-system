/**
 * Centralized Compliance Engine & Document Utilities
 * Fleet & Driver Management System
 */

// Normalized Standard Types
export const REQUIRED_VEHICLE_DOCS = ["RC", "Permit", "Pollution Certificate"];
export const REQUIRED_DRIVER_DOCS = ["Driving License"];

/**
 * Standardize document type names
 */
export function normalizeDocType(type) {
  if (!type) return "";
  const lower = type.toLowerCase().trim();
  if (lower.includes("driving") || lower === "dl") return "Driving License";
  if (lower === "rc" || lower.includes("registration")) return "RC";
  if (lower.includes("permit")) return "Permit";
  if (lower.includes("pollution") || lower === "puc") return "Pollution Certificate";
  return type;
}

/**
 * Short label for compact badges/tables
 */
export function getDocShortLabel(type) {
  const norm = normalizeDocType(type);
  if (norm === "Driving License") return "DL";
  if (norm === "Pollution Certificate") return "Pollution";
  return norm;
}

/**
 * Parse YYYY-MM-DD into a localized midnight date to avoid timezone shift
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
}

/**
 * Normalized today at midnight
 */
export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Calculate difference in days between expiry and today
 */
export function getDaysUntilExpiry(expiryDateStr) {
  const exp = parseDate(expiryDateStr);
  if (!exp) return null;
  const today = getToday();
  const diffTime = exp.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine dynamic document status
 * - expired: days < 0
 * - expiring_soon: 0 <= days <= 30
 * - valid: days > 30
 */
export function getDocumentStatus(expiryDateStr) {
  if (!expiryDateStr) return "missing";
  const days = getDaysUntilExpiry(expiryDateStr);
  if (days === null) return "missing";
  if (days < 0) return "expired";
  if (days <= 30) return "expiring_soon";
  return "valid";
}

/**
 * Human-readable remaining days description
 */
export function formatExpiryDescription(expiryDateStr) {
  if (!expiryDateStr) return "Document Missing";
  const days = getDaysUntilExpiry(expiryDateStr);
  if (days === null) return "Invalid Date";
  if (days < 0) {
    const abs = Math.abs(days);
    return `Expired ${abs} day${abs === 1 ? "" : "s"} ago`;
  }
  if (days === 0) return "Expires today";
  if (days <= 30) return `Expires in ${days} day${days === 1 ? "" : "s"}`;
  return `Expires in ${days} days`;
}

/**
 * Human-readable date formatter
 */
export function formatDocDate(dateStr) {
  if (!dateStr) return "—";
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get required document types for ownerType
 */
export function getRequiredDocuments(ownerType) {
  if (ownerType === "vehicle") return REQUIRED_VEHICLE_DOCS;
  if (ownerType === "driver") return REQUIRED_DRIVER_DOCS;
  return [];
}

/**
 * Fetch all documents belonging to a vehicle
 */
export function getVehicleDocuments(documents = [], vehicleId) {
  if (!vehicleId) return [];
  return documents.filter(
    (d) =>
      (d.ownerType === "vehicle" && d.ownerId === vehicleId) ||
      d.vehicleId === vehicleId
  );
}

/**
 * Fetch all documents belonging to a driver
 */
export function getDriverDocuments(documents = [], driverId) {
  if (!driverId) return [];
  return documents.filter(
    (d) => d.ownerType === "driver" && d.ownerId === driverId
  );
}

/**
 * Find missing required documents for an owner
 */
export function getMissingDocuments(documents = [], ownerType, ownerId) {
  const required = getRequiredDocuments(ownerType);
  const ownerDocs =
    ownerType === "vehicle"
      ? getVehicleDocuments(documents, ownerId)
      : getDriverDocuments(documents, ownerId);

  return required.filter((reqType) => {
    return !ownerDocs.some((d) => normalizeDocType(d.type) === reqType);
  });
}

/**
 * Vehicle Compliance Evaluation
 * Status rules:
 * - If ANY required doc (RC, Permit, Pollution) is missing or expired -> non_compliant, operationalStatus: blocked
 * - Else if ANY required doc is expiring_soon -> expiring_soon, operationalStatus: allowed
 * - Else -> compliant, operationalStatus: allowed
 */
export function getVehicleComplianceStatus(documents = [], vehicleId) {
  if (!vehicleId) {
    return {
      status: "non_compliant",
      operationalStatus: "blocked",
      reasons: ["Vehicle ID missing"],
      docDetails: {},
    };
  }

  const vDocs = getVehicleDocuments(documents, vehicleId);
  const reasons = [];
  let hasExpired = false;
  let hasMissing = false;
  let hasExpiringSoon = false;

  const docDetails = {};

  REQUIRED_VEHICLE_DOCS.forEach((reqType) => {
    const doc = vDocs.find((d) => normalizeDocType(d.type) === reqType);
    if (!doc) {
      hasMissing = true;
      reasons.push(`Missing ${getDocShortLabel(reqType)}`);
      docDetails[reqType] = { status: "missing", doc: null };
    } else {
      const docStatus = getDocumentStatus(doc.expiryDate);
      docDetails[reqType] = { status: docStatus, doc };
      if (docStatus === "expired") {
        hasExpired = true;
        reasons.push(`Expired ${getDocShortLabel(reqType)} (${formatDocDate(doc.expiryDate)})`);
      } else if (docStatus === "expiring_soon") {
        hasExpiringSoon = true;
        reasons.push(`${getDocShortLabel(reqType)} expiring soon (${formatExpiryDescription(doc.expiryDate)})`);
      }
    }
  });

  if (hasMissing || hasExpired) {
    return {
      status: "non_compliant",
      operationalStatus: "blocked",
      reasons,
      docDetails,
    };
  }

  if (hasExpiringSoon) {
    return {
      status: "expiring_soon",
      operationalStatus: "allowed",
      reasons,
      docDetails,
    };
  }

  return {
    status: "compliant",
    operationalStatus: "allowed",
    reasons: ["All mandatory documents valid"],
    docDetails,
  };
}

/**
 * Driver Compliance Evaluation
 * Status rules:
 * - DL missing or expired -> non_compliant
 * - DL expiring soon -> expiring_soon
 * - DL valid -> compliant
 */
export function getDriverComplianceStatus(documents = [], driverId) {
  if (!driverId) {
    return {
      status: "non_compliant",
      reasons: ["Driver ID missing"],
      dlDoc: null,
      dlStatus: "missing",
    };
  }

  const dDocs = getDriverDocuments(documents, driverId);
  const dlDoc = dDocs.find((d) => normalizeDocType(d.type) === "Driving License");

  if (!dlDoc) {
    return {
      status: "non_compliant",
      reasons: ["Missing Driving Licence"],
      dlDoc: null,
      dlStatus: "missing",
    };
  }

  const dlStatus = getDocumentStatus(dlDoc.expiryDate);
  if (dlStatus === "expired") {
    return {
      status: "non_compliant",
      reasons: [`Expired Driving Licence (${formatDocDate(dlDoc.expiryDate)})`],
      dlDoc,
      dlStatus,
    };
  }

  if (dlStatus === "expiring_soon") {
    return {
      status: "expiring_soon",
      reasons: [`Driving Licence expiring soon (${formatExpiryDescription(dlDoc.expiryDate)})`],
      dlDoc,
      dlStatus,
    };
  }

  return {
    status: "compliant",
    reasons: ["Valid Driving Licence"],
    dlDoc,
    dlStatus: "valid",
  };
}

/**
 * Helper to check operational eligibility for vehicles
 */
export function isVehicleOperational(documents = [], vehicleId) {
  const result = getVehicleComplianceStatus(documents, vehicleId);
  return result.operationalStatus === "allowed";
}

/**
 * Global dynamic compliance statistics
 */
export function getComplianceStats(documents = [], vehicles = [], drivers = []) {
  let validCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  documents.forEach((doc) => {
    const status = getDocumentStatus(doc.expiryDate);
    if (status === "valid") validCount++;
    else if (status === "expiring_soon") expiringSoonCount++;
    else if (status === "expired") expiredCount++;
  });

  // Calculate missing documents across vehicles and drivers
  let missingDocsCount = 0;
  let nonCompliantVehiclesCount = 0;
  let blockedVehiclesCount = 0;

  vehicles.forEach((vehicle) => {
    const comp = getVehicleComplianceStatus(documents, vehicle.id);
    const missing = getMissingDocuments(documents, "vehicle", vehicle.id);
    missingDocsCount += missing.length;
    if (comp.status === "non_compliant") {
      nonCompliantVehiclesCount++;
      blockedVehiclesCount++;
    }
  });

  let nonCompliantDriversCount = 0;
  drivers.forEach((driver) => {
    const comp = getDriverComplianceStatus(documents, driver.id);
    const missing = getMissingDocuments(documents, "driver", driver.id);
    missingDocsCount += missing.length;
    if (comp.status === "non_compliant") {
      nonCompliantDriversCount++;
    }
  });

  return {
    totalDocuments: documents.length,
    valid: validCount,
    expiringSoon: expiringSoonCount,
    expired: expiredCount,
    missing: missingDocsCount,
    nonCompliantVehicles: nonCompliantVehiclesCount,
    blockedVehicles: blockedVehiclesCount,
    nonCompliantDrivers: nonCompliantDriversCount,
  };
}

/**
 * Retrieve documents expiring within threshold
 */
export function getExpiringDocuments(documents = [], daysThreshold = 30) {
  return documents
    .map((doc) => {
      const days = getDaysUntilExpiry(doc.expiryDate);
      const status = getDocumentStatus(doc.expiryDate);
      return { ...doc, daysRemaining: days, dynamicStatus: status };
    })
    .filter((doc) => {
      if (doc.dynamicStatus === "expired") return true;
      if (doc.daysRemaining !== null && doc.daysRemaining <= daysThreshold) return true;
      return false;
    })
    .sort((a, b) => (a.daysRemaining ?? -999) - (b.daysRemaining ?? -999));
}

/**
 * Filter documents by search and multi-select criteria
 */
export function filterDocuments({
  documents = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  searchQuery = "",
  ownerType = "all",
  documentType = "all",
  vendorId = "all",
  status = "all",
  expiryRange = "all",
}) {
  const query = searchQuery.trim().toLowerCase();

  return documents.filter((doc) => {
    const normType = normalizeDocType(doc.type);
    const dynamicStatus = getDocumentStatus(doc.expiryDate);
    const days = getDaysUntilExpiry(doc.expiryDate);

    // Resolve owner details
    let ownerName = "";
    let vehicleReg = "";
    let docVendorId = "";

    if (doc.ownerType === "vehicle") {
      const v = vehicles.find((item) => item.id === doc.ownerId);
      if (v) {
        ownerName = v.registrationNumber;
        vehicleReg = v.registrationNumber;
        docVendorId = v.vendorId;
      }
    } else if (doc.ownerType === "driver") {
      const d = drivers.find((item) => item.id === doc.ownerId);
      if (d) {
        ownerName = d.name;
        docVendorId = d.vendorId;
        const v = vehicles.find((item) => item.id === d.vehicleId);
        if (v) vehicleReg = v.registrationNumber;
      }
    }

    const vendor = vendors.find((v) => v.id === docVendorId);
    const vendorName = vendor ? vendor.name : "";

    // 1. Search Query
    if (query) {
      const docNum = (doc.documentNumber || "").toLowerCase();
      const typeLower = (doc.type || "").toLowerCase();
      const ownerLower = ownerName.toLowerCase();
      const regLower = vehicleReg.toLowerCase();
      const vendorLower = vendorName.toLowerCase();

      const matches =
        docNum.includes(query) ||
        typeLower.includes(query) ||
        ownerLower.includes(query) ||
        regLower.includes(query) ||
        vendorLower.includes(query);

      if (!matches) return false;
    }

    // 2. Owner Type
    if (ownerType !== "all" && doc.ownerType !== ownerType) {
      return false;
    }

    // 3. Document Type
    if (documentType !== "all") {
      if (normalizeDocType(documentType) !== normType) {
        return false;
      }
    }

    // 4. Vendor Filter
    if (vendorId !== "all" && docVendorId !== vendorId) {
      return false;
    }

    // 5. Status Filter
    if (status !== "all" && dynamicStatus !== status) {
      return false;
    }

    // 6. Expiry Range Filter
    if (expiryRange !== "all") {
      if (expiryRange === "expired" && dynamicStatus !== "expired") return false;
      if (expiryRange === "7_days" && (days === null || days < 0 || days > 7)) return false;
      if (expiryRange === "30_days" && (days === null || days < 0 || days > 30)) return false;
      if (expiryRange === "more_than_30" && (days === null || days <= 30)) return false;
    }

    return true;
  });
}
