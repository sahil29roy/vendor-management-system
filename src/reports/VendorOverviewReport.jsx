import React from "react";

export default function VendorOverviewReport({
  vendorData = [],
  onViewVendorVehicles,
  onViewVendorDrivers,
  onViewVendorCompliance,
}) {
  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Vendor Network Overview Scorecard</h3>
          <p className="rpt-card-subtitle">
            Cross-vendor fleet size, workforce capacity, and regulatory compliance health.
          </p>
        </div>
        <span style={{ fontSize: "11px", color: "#6b7280" }}>
          {vendorData.length} Registered Vendors
        </span>
      </div>

      <div className="rpt-table-container">
        {vendorData.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
            No vendors found matching current reporting criteria.
          </div>
        ) : (
          <table className="rpt-table">
            <thead>
              <tr>
                <th>Vendor Organization</th>
                <th>Hierarchy Level</th>
                <th>Location</th>
                <th>Commercial Fleet</th>
                <th>Drivers Onboarded</th>
                <th>Non-Compliant</th>
                <th>Compliance Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendorData.map((v) => {
                const isPerfect = v.complianceRate === 100;
                const isLow = v.complianceRate < 80;

                return (
                  <tr key={v.vendorId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.vendorName}</div>
                      <span style={{ fontSize: "10px", color: "#6b7280" }}>ID: {v.vendorId}</span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                        }}
                      >
                        {v.level}
                      </span>
                    </td>

                    <td>{v.location}</td>

                    <td>
                      <span
                        className="rpt-link"
                        onClick={() => onViewVendorVehicles && onViewVendorVehicles(v.vendorId)}
                        title="Click to view vehicles"
                      >
                        {v.totalVehicles} Vehicles
                      </span>{" "}
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        ({v.activeVehicles} active)
                      </span>
                    </td>

                    <td>
                      <span
                        className="rpt-link"
                        onClick={() => onViewVendorDrivers && onViewVendorDrivers(v.vendorId)}
                        title="Click to view drivers"
                      >
                        {v.totalDrivers} Drivers
                      </span>{" "}
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        ({v.activeDrivers} active)
                      </span>
                    </td>

                    <td>
                      {v.nonCompliantCount > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#dc2626",
                            backgroundColor: "#fee2e2",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {v.nonCompliantCount} Cabs
                        </span>
                      ) : (
                        <span style={{ color: "#166534", fontSize: "11px" }}>None (0)</span>
                      )}
                    </td>

                    <td style={{ minWidth: "120px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div className="rpt-bar-track" style={{ flex: 1 }}>
                          <div
                            className="rpt-bar-fill"
                            style={{
                              width: `${v.complianceRate}%`,
                              backgroundColor: isPerfect ? "#10b981" : isLow ? "#ef4444" : "#f59e0b",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: isPerfect ? "#10b981" : isLow ? "#ef4444" : "#f59e0b",
                            minWidth: "32px",
                            textAlign: "right",
                          }}
                        >
                          {v.complianceRate}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="rpt-link"
                        style={{ background: "none", border: "none", padding: 0 }}
                        onClick={() => onViewVendorCompliance && onViewVendorCompliance(v.vendorId)}
                      >
                        Audit Compliance &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
