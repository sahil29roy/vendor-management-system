import React, { useState, useEffect, useRef } from "react";

export default function ReportExport({
  onExportVendorOverview,
  onExportFleetCompliance,
  onExportExpiryAudit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rpt-export-wrapper" ref={menuRef}>
      <button
        type="button"
        className="vms-btn vms-btn-primary"
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>📥 Export Report</span>
        <span style={{ fontSize: "10px" }}>▼</span>
      </button>

      {isOpen && (
        <div className="rpt-export-menu">
          <button
            type="button"
            className="rpt-export-item"
            onClick={() => {
              setIsOpen(false);
              onExportVendorOverview();
            }}
          >
            <span>📊</span> Vendor Overview (CSV)
          </button>

          <button
            type="button"
            className="rpt-export-item"
            onClick={() => {
              setIsOpen(false);
              onExportFleetCompliance();
            }}
          >
            <span>🛡️</span> Fleet Compliance (CSV)
          </button>

          <button
            type="button"
            className="rpt-export-item"
            onClick={() => {
              setIsOpen(false);
              onExportExpiryAudit();
            }}
          >
            <span>⏳</span> Expiry Audit Trail (CSV)
          </button>
        </div>
      )}
    </div>
  );
}
