import React from "react";

export default function VendorOverview({
  vendors = [],
  hierarchyTree = null,
  onNavigate,
  onSelectVendor,
}) {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="dsh-card">
        <div className="dsh-card-header">
          <h3 className="dsh-card-title">Vendor Network</h3>
        </div>
        <div className="dsh-empty-state">
          <p className="dsh-empty-desc">No vendor partners found in network.</p>
        </div>
      </div>
    );
  }

  // Recursive compact tree rendering
  const renderCompactNode = (node, prefix = "", isLast = true, isRoot = false) => {
    if (!node) return null;

    const currentBranch = isRoot ? "" : isLast ? "└── " : "├── ";
    const nextPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");

    return (
      <React.Fragment key={node.id}>
        <div className="dsh-tree-line">
          <span style={{ color: "#9ca3af" }}>{prefix + currentBranch}</span>
          <span className={isRoot ? "dsh-tree-root" : "dsh-tree-node"}>
            {node.name}
          </span>
          {!isRoot && (
            <span
              style={{
                fontSize: "10px",
                color: "#6b7280",
                marginLeft: "4px",
                backgroundColor: "#e5e7eb",
                padding: "1px 5px",
                borderRadius: "4px",
              }}
            >
              {node.level || "Vendor"}
            </span>
          )}
        </div>
        {node.children &&
          node.children.map((child, idx) =>
            renderCompactNode(
              child,
              nextPrefix,
              idx === node.children.length - 1,
              false
            )
          )}
      </React.Fragment>
    );
  };

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Vendor Network &amp; Hierarchy</h3>
          <p className="dsh-card-subtitle">
            Partner capacity and organizational tiering.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="dsh-card-action"
            onClick={() => onNavigate && onNavigate("hierarchy")}
          >
            Full Hierarchy &rarr;
          </button>
          <button
            type="button"
            className="dsh-card-action"
            onClick={() => onNavigate && onNavigate("vendors")}
          >
            All Vendors &rarr;
          </button>
        </div>
      </div>

      {/* Top Vendors Table */}
      <div className="dsh-table-wrap">
        <table className="dsh-table">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Vehicles</th>
              <th>Drivers</th>
              <th>Compliance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr
                key={v.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectVendor && onSelectVendor(v.id)}
                title={`Click to filter dashboard for ${v.name}`}
              >
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{v.name}</span>
                    <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 400 }}>
                      {v.location}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{v.vehicleCount}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{v.driverCount}</span>
                </td>
                <td>
                  <span
                    className={`dsh-pill-badge ${
                      v.compliantRate === 100
                        ? "dsh-pill-green"
                        : v.compliantRate >= 70
                        ? "dsh-pill-yellow"
                        : "dsh-pill-red"
                    }`}
                  >
                    {v.compliantRate}%
                  </span>
                </td>
                <td>
                  <span
                    className={`dsh-pill-badge ${
                      v.status === "active" ? "dsh-pill-green" : "dsh-pill-gray"
                    }`}
                  >
                    {v.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Hierarchy Tree Preview */}
      {hierarchyTree && (
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            Compact Hierarchy Tree
          </div>
          <div className="dsh-hierarchy-compact">
            {renderCompactNode(hierarchyTree, "", true, true)}
          </div>
        </div>
      )}
    </div>
  );
}
