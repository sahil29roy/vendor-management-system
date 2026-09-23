import React from "react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import {
  getDocumentStatus,
  formatDocDate,
  formatExpiryDescription,
  getDocShortLabel,
} from "../utils/complianceUtils";

export default function ComplianceRow({
  type = "document",
  data,
  vendors = [],
  vehicles = [],
  drivers = [],
  onViewDoc,
  onReplaceDoc,
  onViewVehicle,
  onViewDriver,
}) {
  // 1. ALL DOCUMENTS ROW
  if (type === "document") {
    const doc = data;
    const dynamicStatus = getDocumentStatus(doc.expiryDate);

    // Resolve owner
    let ownerDisplayName = "—";
    let vehicleReg = "—";
    let docVendorId = "";

    if (doc.ownerType === "vehicle") {
      const v = vehicles.find((item) => item.id === doc.ownerId);
      if (v) {
        ownerDisplayName = v.registrationNumber;
        vehicleReg = v.registrationNumber;
        docVendorId = v.vendorId;
      }
    } else if (doc.ownerType === "driver") {
      const d = drivers.find((item) => item.id === doc.ownerId);
      if (d) {
        ownerDisplayName = d.name;
        docVendorId = d.vendorId;
        const v = vehicles.find((item) => item.id === d.vehicleId);
        if (v) vehicleReg = v.registrationNumber;
      }
    }

    const vendor = vendors.find((v) => v.id === docVendorId);
    const vendorName = vendor ? vendor.name : "—";

    return (
      <tr className={dynamicStatus === "expired" ? "highlight-expired" : ""}>
        <td>
          <div style={{ fontWeight: 600 }}>{doc.type}</div>
          <span style={{ fontSize: "11px", color: "#6b7280" }}>
            {doc.documentNumber}
          </span>
        </td>

        <td>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: doc.ownerType === "vehicle" ? "#ede9fe" : "#e0f2fe",
              color: doc.ownerType === "vehicle" ? "#6d28d9" : "#0369a1",
              fontWeight: 600,
            }}
          >
            {doc.ownerType === "vehicle" ? "Vehicle" : "Driver"}
          </span>
        </td>

        <td>
          <div style={{ fontWeight: 600 }}>{ownerDisplayName}</div>
        </td>

        <td>{vendorName}</td>

        <td>
          <code
            style={{
              backgroundColor: "#f3f4f6",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {vehicleReg}
          </code>
        </td>

        <td>{formatDocDate(doc.issueDate)}</td>

        <td>
          <div style={{ fontWeight: 500 }}>{formatDocDate(doc.expiryDate)}</div>
          <div style={{ fontSize: "11px", color: dynamicStatus === "expired" ? "#b91c1c" : "#6b7280" }}>
            {formatExpiryDescription(doc.expiryDate)}
          </div>
        </td>

        <td>
          <DocumentStatusBadge status={dynamicStatus} />
        </td>

        <td>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className="comp-btn comp-btn-secondary comp-btn-sm"
              onClick={() => onViewDoc && onViewDoc(doc)}
            >
              Details
            </button>
            <button
              type="button"
              className="comp-btn comp-btn-secondary comp-btn-sm"
              onClick={() => onReplaceDoc && onReplaceDoc(doc)}
            >
              Renew
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // 2. VEHICLE COMPLIANCE MATRIX ROW
  if (type === "vehicle_matrix") {
    const { vehicle, compliance, vendor } = data;
    const rc = compliance.docDetails?.["RC"] || { status: "missing" };
    const permit = compliance.docDetails?.["Permit"] || { status: "missing" };
    const pollution = compliance.docDetails?.["Pollution Certificate"] || { status: "missing" };

    return (
      <tr className={compliance.status === "non_compliant" ? "highlight-expired" : ""}>
        <td>
          <div style={{ fontWeight: 700, letterSpacing: "0.02em" }}>
            {vehicle.registrationNumber}
          </div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>{vehicle.model}</div>
        </td>

        <td>{vendor ? vendor.name : "—"}</td>

        {/* RC */}
        <td>
          <div className="comp-matrix-cell">
            <DocumentStatusBadge status={rc.status} label={rc.status === "missing" ? "Missing" : getDocShortLabel("RC")} />
            {rc.doc && (
              <span className="comp-matrix-subtext">
                {formatDocDate(rc.doc.expiryDate)}
              </span>
            )}
          </div>
        </td>

        {/* Permit */}
        <td>
          <div className="comp-matrix-cell">
            <DocumentStatusBadge status={permit.status} label={permit.status === "missing" ? "Missing" : "Permit"} />
            {permit.doc && (
              <span className="comp-matrix-subtext">
                {formatDocDate(permit.doc.expiryDate)}
              </span>
            )}
          </div>
        </td>

        {/* Pollution */}
        <td>
          <div className="comp-matrix-cell">
            <DocumentStatusBadge status={pollution.status} label={pollution.status === "missing" ? "Missing" : "Pollution"} />
            {pollution.doc && (
              <span className="comp-matrix-subtext">
                {formatDocDate(pollution.doc.expiryDate)}
              </span>
            )}
          </div>
        </td>

        {/* Overall Compliance */}
        <td>
          <DocumentStatusBadge status={compliance.status} />
          {compliance.reasons && compliance.reasons.length > 0 && compliance.status !== "compliant" && (
            <div style={{ fontSize: "10px", color: "#b91c1c", marginTop: "2px" }}>
              {compliance.reasons.join(", ")}
            </div>
          )}
        </td>

        {/* Operational Status */}
        <td>
          <DocumentStatusBadge
            status={compliance.operationalStatus === "blocked" ? "blocked" : "allowed"}
            label={compliance.operationalStatus === "blocked" ? "Cannot Operate" : "Operational"}
          />
        </td>

        <td>
          <button
            type="button"
            className="comp-btn comp-btn-secondary comp-btn-sm"
            onClick={() => onViewVehicle && onViewVehicle(vehicle)}
          >
            Vehicle Info
          </button>
        </td>
      </tr>
    );
  }

  // 3. DRIVER COMPLIANCE MATRIX ROW
  if (type === "driver_matrix") {
    const { driver, compliance, vendor, vehicle } = data;

    return (
      <tr className={compliance.status === "non_compliant" ? "highlight-expired" : ""}>
        <td>
          <div style={{ fontWeight: 700 }}>{driver.name}</div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>{driver.phone}</div>
        </td>

        <td>{vendor ? vendor.name : "—"}</td>

        <td>
          {vehicle ? (
            <code style={{ fontSize: "12px", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
              {vehicle.registrationNumber}
            </code>
          ) : (
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Unassigned</span>
          )}
        </td>

        <td>
          <div style={{ fontWeight: 600 }}>
            {compliance.dlDoc ? compliance.dlDoc.documentNumber : "No DL on File"}
          </div>
          <span style={{ fontSize: "11px", color: "#6b7280" }}>
            {compliance.dlDoc ? `Expires: ${formatDocDate(compliance.dlDoc.expiryDate)}` : "—"}
          </span>
        </td>

        <td>
          <DocumentStatusBadge status={compliance.dlStatus} />
        </td>

        <td>
          <DocumentStatusBadge status={compliance.status} />
        </td>

        <td>
          <button
            type="button"
            className="comp-btn comp-btn-secondary comp-btn-sm"
            onClick={() => onViewDriver && onViewDriver(driver)}
          >
            Driver Profile
          </button>
        </td>
      </tr>
    );
  }

  return null;
}
