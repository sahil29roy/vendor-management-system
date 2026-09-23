import React from "react";

export default function ExpiringDocuments({
  expiringDocs = [],
  onNavigate,
}) {
  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Upcoming Expiries &amp; Renewals</h3>
          <p className="dsh-card-subtitle">
            Most urgent compliance requirements needing regulatory renewal.
          </p>
        </div>
        <button
          type="button"
          className="dsh-card-action"
          onClick={() => onNavigate && onNavigate("compliance")}
        >
          View All Compliance &rarr;
        </button>
      </div>

      {expiringDocs.length === 0 ? (
        <div className="dsh-empty-state" style={{ padding: "20px" }}>
          <span style={{ fontSize: "18px", color: "#10b981" }}>&#x2714;</span>
          <p className="dsh-empty-desc" style={{ margin: 0 }}>
            No expired or impending document expiries within 30 days.
          </p>
        </div>
      ) : (
        <div className="dsh-table-wrap">
          <table className="dsh-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Owner / Asset</th>
                <th>Vendor</th>
                <th>Expiry Date</th>
                <th>Status / Days</th>
              </tr>
            </thead>
            <tbody>
              {expiringDocs.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{doc.type}</span>
                      <span style={{ fontSize: "10px", color: "#6b7280", fontFamily: "monospace" }}>
                        {doc.documentNumber}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          backgroundColor: doc.ownerType === "vehicle" ? "#e0e7ff" : "#fef3c7",
                          color: doc.ownerType === "vehicle" ? "#3730a3" : "#92400e",
                          fontWeight: 600,
                        }}
                      >
                        {doc.ownerTypeLabel}
                      </span>
                      <span style={{ fontWeight: 600 }}>{doc.ownerLabel}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "#4b5563" }}>{doc.vendorName}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{doc.formattedExpiry}</span>
                  </td>
                  <td>
                    <span
                      className={`dsh-pill-badge ${
                        doc.status === "expired"
                          ? "dsh-pill-red"
                          : doc.daysRemaining <= 15
                          ? "dsh-pill-red"
                          : "dsh-pill-yellow"
                      }`}
                    >
                      {doc.description}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
