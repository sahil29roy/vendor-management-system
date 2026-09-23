import React from "react";
import HierarchyNode from "./HierarchyNode";

export default function HierarchyTree({
  treeNodes = [],
  selectedVendorId,
  expandedNodeIds,
  searchQuery,
  onSelectNode,
  onToggleExpand,
  onOpenMoveModal,
}) {
  if (!treeNodes || treeNodes.length === 0) {
    return (
      <div className="vh-tree-card">
        <div className="vh-empty-state">
          <div className="vh-empty-state-title">No Vendors Found</div>
          <p style={{ fontSize: "13px" }}>
            {searchQuery
              ? `No organization matched "${searchQuery}". Try searching by another name, city, or level.`
              : "The vendor hierarchy is currently empty."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-tree-card">
      <div className="vh-tree-header">
        <span className="vh-tree-title">Organization Tree</span>
        <span className="vh-tree-count-badge">
          {treeNodes.length} Root Structure{treeNodes.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="vh-tree-nodes-list">
        {treeNodes.map((rootNode) => (
          <HierarchyNode
            key={rootNode.id}
            node={rootNode}
            selectedVendorId={selectedVendorId}
            expandedNodeIds={expandedNodeIds}
            searchQuery={searchQuery}
            onSelectNode={onSelectNode}
            onToggleExpand={onToggleExpand}
            onOpenMoveModal={onOpenMoveModal}
          />
        ))}
      </div>
    </div>
  );
}
