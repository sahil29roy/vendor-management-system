import React from "react";

export default function ComplianceReport({ complianceData, onViewCompliance }) {
  if (!complianceData) return null;

  const { documents, vehicles, drivers } = complianceData;

  const docValidPct = documents.total > 0 ? Math.round((documents.valid / documents.total) * 100) : 0;
  const docExpiringPct = documents.total > 0 ? Math.round((documents.expiring / documents.total) * 100) : 0;
  const docExpiredPct = documents.total > 0 ? Math.round((documents.expired / documents.total) * 100) : 0;

  const vehCompliantPct = vehicles.total > 0 ? Math.round((vehicles.compliant / vehicles.total) * 100) : 0;
  const vehNonCompliantPct = vehicles.total > 0 ? Math.round((vehicles.nonCompliant / vehicles.total) * 100) : 0;

  const drvCompliantPct = drivers.total > 0 ? Math.round((drivers.compliant / drivers.total) * 100) : 0;
  const drvNonCompliantPct = drivers.total > 0 ? Math.round((drivers.nonCompliant / drivers.total) * 100) : 0;

  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Fleet &amp; Driver Regulatory Compliance Audit</h3>
          <p className="rpt-card-subtitle">
            Component health breakdown across registered documents, vehicle permits, and driver licences.
          </p>
        </div>
        {onViewCompliance && (
          <button
            type="button"
            className="rpt-link"
            style={{ background: "none", border: "none", fontSize: "12px" }}
            onClick={onViewCompliance}
          >
            Open Compliance Central &rarr;
          </button>
        )}
      </div>

      <div className="rpt-grid-3col">
        {/* Document Breakdown */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#111827", marginBottom: "8px" }}>
            Documents ({documents.total})
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#166534" }}>Valid</span>
              <span className="rpt-bar-value">{documents.valid} ({docValidPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${docValidPct}%`, backgroundColor: "#10b981" }} />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b45309" }}>Expiring Soon</span>
              <span className="rpt-bar-value">{documents.expiring} ({docExpiringPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${docExpiringPct}%`, backgroundColor: "#f59e0b" }} />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b91c1c" }}>Expired</span>
              <span className="rpt-bar-value">{documents.expired} ({docExpiredPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${docExpiredPct}%`, backgroundColor: "#ef4444" }} />
            </div>
          </div>
        </div>

        {/* Vehicles Breakdown */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#111827", marginBottom: "8px" }}>
            Vehicles ({vehicles.total})
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#166534" }}>Compliant</span>
              <span className="rpt-bar-value">{vehicles.compliant} ({vehCompliantPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${vehCompliantPct}%`, backgroundColor: "#10b981" }} />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b45309" }}>Expiring Soon</span>
              <span className="rpt-bar-value">{vehicles.expiring}</span>
            </div>
            <div className="rpt-bar-track">
              <div
                className="rpt-bar-fill"
                style={{
                  width: `${vehicles.total > 0 ? Math.round((vehicles.expiring / vehicles.total) * 100) : 0}%`,
                  backgroundColor: "#f59e0b",
                }}
              />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b91c1c" }}>Non-Compliant</span>
              <span className="rpt-bar-value">{vehicles.nonCompliant} ({vehNonCompliantPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${vehNonCompliantPct}%`, backgroundColor: "#ef4444" }} />
            </div>
          </div>
        </div>

        {/* Drivers Breakdown */}
        <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#111827", marginBottom: "8px" }}>
            Driver Licences ({drivers.total})
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#166534" }}>Valid DL</span>
              <span className="rpt-bar-value">{drivers.compliant} ({drvCompliantPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${drvCompliantPct}%`, backgroundColor: "#10b981" }} />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b45309" }}>DL Expiring Soon</span>
              <span className="rpt-bar-value">{drivers.expiring}</span>
            </div>
            <div className="rpt-bar-track">
              <div
                className="rpt-bar-fill"
                style={{
                  width: `${drivers.total > 0 ? Math.round((drivers.expiring / drivers.total) * 100) : 0}%`,
                  backgroundColor: "#f59e0b",
                }}
              />
            </div>
          </div>

          <div className="rpt-bar-item">
            <div className="rpt-bar-header">
              <span className="rpt-bar-label" style={{ color: "#b91c1c" }}>Expired DL</span>
              <span className="rpt-bar-value">{drivers.nonCompliant} ({drvNonCompliantPct}%)</span>
            </div>
            <div className="rpt-bar-track">
              <div className="rpt-bar-fill" style={{ width: `${drvNonCompliantPct}%`, backgroundColor: "#ef4444" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
