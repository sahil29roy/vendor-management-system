import React from "react";
import DocumentStatusBadge from "../compliance/DocumentStatusBadge";

export default function ExpiryReport({ expiringDocs = [], onViewCompliance }) {
  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Document Expiry &amp; Renewal Audit Trail</h3>
          <p className="rpt-card-subtitle">
            Critical documents requiring immediate renewal sorted by urgency (expired first).
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "10px",
            backgroundColor: expiringDocs.length > 0 ? "#fee2e2" : "#dcfce7",
            color: expiringDocs.length > 0 ? "#991b1b" : "#166534",
          }}
        >
          {expiringDocs.length} Action Items
        </span>
      </div>

      <div className="rpt-table-container">
        {expiringDocs.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#166534", fontSize: "13px" }}>
            ✓ All active certificates and licences have more than 30 days of validity remaining.
          </div>
        ) : (
          <table className="rpt-table">
            <thead>
              <tr>
                <th>Document Category &amp; No.</th>
                <th>Owner Type</th>
                <th>Associated Owner</th>
                <th>Vendor</th>
                <th>Vehicle Plate</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expiringDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{doc.type}</div>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>{doc.documentNumber}</span>
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: doc.ownerType === "vehicle" ? "#ede9fe" : "#e0f2fe",
                        color: doc.ownerType === "vehicle" ? "#6d28d9" : "#0369a1",
                      }}
                    >
                      {doc.ownerType === "vehicle" ? "Vehicle" : "Driver"}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{doc.ownerName}</div>
                  </td>

                  <td>{doc.vendorName}</td>

                  <td>
                    <code style={{ fontSize: "11px", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                      {doc.vehiclePlate}
                    </code>
                  </td>

                  <td>{doc.expiryDate}</td>

                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color: doc.status === "expired" ? "#b91c1c" : "#b45309",
                      }}
                    >
                      {doc.description}
                    </span>
                  </td>

                  <td>
                    <DocumentStatusBadge status={doc.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {onViewCompliance && expiringDocs.length > 0 && (
        <div style={{ textAlign: "right", paddingTop: "4px" }}>
          <button
            type="button"
            className="rpt-link"
            style={{ background: "none", border: "none", fontSize: "12px" }}
            onClick={onViewCompliance}
          >
            Manage Renewals in Compliance Module &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
