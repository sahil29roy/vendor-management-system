import React from "react";

export default function HierarchyActions({
  searchQuery,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
  totalNodesCount,
}) {
  return (
    <div className="vh-action-bar">
      <div className="vh-search-wrapper">
        <span className="vh-search-icon">&#128269;</span>
        <input
          type="text"
          className="vh-search-input"
          placeholder="Search by vendor name, tier, city, or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="vh-alert-dismiss"
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
            onClick={() => onSearchChange("")}
            title="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      <div className="vh-actions-right">
        <span style={{ fontSize: "12px", color: "#6b7280", marginRight: "6px" }}>
          {totalNodesCount} {totalNodesCount === 1 ? "organization" : "organizations"}
        </span>
        <button
          type="button"
          className="vh-btn vh-btn-secondary"
          onClick={onExpandAll}
          title="Expand all branches in tree"
        >
          <span>&#x25BC;</span> Expand All
        </button>
        <button
          type="button"
          className="vh-btn vh-btn-secondary"
          onClick={onCollapseAll}
          title="Collapse all branches in tree"
        >
          <span>&#x25B6;</span> Collapse All
        </button>
      </div>
    </div>
  );
}
