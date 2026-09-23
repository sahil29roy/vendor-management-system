import React from "react";

export default function HierarchyNode({
  node,
  selectedVendorId,
  expandedNodeIds,
  searchQuery,
  onSelectNode,
  onToggleExpand,
  onOpenMoveModal,
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedVendorId === node.id;
  const depth = node.depth || 0;

  // Level badge CSS class
  const getBadgeClass = (level) => {
    const l = (level || "").toLowerCase();
    if (l.includes("super")) return "vh-badge-pill vh-badge-super";
    if (l.includes("regional")) return "vh-badge-pill vh-badge-regional";
    if (l.includes("city")) return "vh-badge-pill vh-badge-city";
    return "vh-badge-pill vh-badge-local";
  };

  // Helper for search highlight
  const renderHighlightedName = (name) => {
    if (!searchQuery || !searchQuery.trim() || !name) return name;
    const query = searchQuery.trim().toLowerCase();
    const index = name.toLowerCase().indexOf(query);
    if (index === -1) return name;

    const before = name.substring(0, index);
    const match = name.substring(index, index + query.length);
    const after = name.substring(index + query.length);

    return (
      <>
        {before}
        <span className="vh-node-name match-highlight">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="vh-node-wrapper">
      <div
        className={`vh-node-row ${isSelected ? "selected" : ""}`}
        style={{ paddingLeft: `${depth * 22 + 8}px` }}
        onClick={() => onSelectNode(node.id)}
      >
        {/* Expand / Collapse Button or Spacer */}
        {hasChildren ? (
          <button
            type="button"
            className="vh-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            title={isExpanded ? "Collapse branch" : "Expand branch"}
          >
            {isExpanded ? "\u25BC" : "\u25B6"}
          </button>
        ) : (
          <span className="vh-toggle-spacer" />
        )}

        {/* Status Dot */}
        <span
          className={`vh-status-indicator ${
            node.status === "inactive" ? "inactive" : "active"
          }`}
          title={`Status: ${node.status || "active"}`}
        />

        {/* Main Content */}
        <div className="vh-node-content">
          <span className="vh-node-name">
            {renderHighlightedName(node.name)}
          </span>

          <span className={getBadgeClass(node.level || node.role)}>
            {node.level || node.role || "Vendor"}
          </span>

          {node.location && (
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              &bull; {node.location}
            </span>
          )}
        </div>

        {/* Meta / Child count & Quick Actions */}
        <div className="vh-node-meta">
          {hasChildren && (
            <span className="vh-children-count-tag">
              {node.childCount} {node.childCount === 1 ? "child" : "children"}
            </span>
          )}

          {!node.isAdmin && (
            <button
              type="button"
              className="vh-btn vh-btn-secondary"
              style={{ padding: "2px 8px", fontSize: "11px" }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
                onOpenMoveModal(node);
              }}
              title="Change parent reporting line"
            >
              Move
            </button>
          )}
        </div>
      </div>

      {/* Recursive Children Container */}
      {hasChildren && isExpanded && (
        <div className="vh-node-children-container">
          {node.children.map((child) => (
            <HierarchyNode
              key={child.id}
              node={child}
              selectedVendorId={selectedVendorId}
              expandedNodeIds={expandedNodeIds}
              searchQuery={searchQuery}
              onSelectNode={onSelectNode}
              onToggleExpand={onToggleExpand}
              onOpenMoveModal={onOpenMoveModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
