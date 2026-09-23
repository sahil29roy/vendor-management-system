import React from "react";

export default function ComplianceActions({
  onUploadClick,
  stats,
  onNavigateTab,
}) {
  return (
    <div className="comp-header">
      <div>
        <h1 className="comp-title">Fleet &amp; Driver Document Compliance</h1>
        <p className="comp-subtitle">
          Monitor vehicle and driver documents, expiry dates, and regulatory compliance status across all vendors.
        </p>
      </div>

      <div className="comp-header-actions">
        {stats && stats.blockedVehicles > 0 && (
          <button
            type="button"
            className="comp-btn"
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderColor: "#fecaca",
            }}
            onClick={() => onNavigateTab && onNavigateTab("vehicles")}
            title="View blocked commercial vehicles"
          >
            🚫 {stats.blockedVehicles} Cabs Blocked
          </button>
        )}

        <button
          type="button"
          className="comp-btn comp-btn-primary"
          onClick={onUploadClick}
        >
          <span>+ Upload / Register Document</span>
        </button>
      </div>
    </div>
  );
}
