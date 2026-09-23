import React, { useState, useMemo, useEffect } from "react";
import HierarchyActions from "../hierarchy/HierarchyActions";
import HierarchyTree from "../hierarchy/HierarchyTree";
import HierarchyDetails from "../hierarchy/HierarchyDetails";
import MoveVendorModal from "../hierarchy/MoveVendorModal";
import {
  buildVendorTree,
  searchHierarchyTree,
  getAllNodeIds,
  getVendorById,
  getVendorChildren,
  moveVendor,
} from "../utils/hierarchyUtils";
import "../styles/hierarchy.css";

export default function VendorHierarchy({
  vendors = [],
  admin = { id: "admin-001", name: "FleetHub Admin", role: "Super Vendor" },
  vehicles = [],
  drivers = [],
  onUpdateVendors,
  onNavigateDirectory,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState(admin ? admin.id : null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [vendorToMove, setVendorToMove] = useState(null);
  const [notification, setNotification] = useState(null);

  // 1. Build the dynamic N-level tree
  const fullTree = useMemo(() => {
    return buildVendorTree(vendors, admin);
  }, [vendors, admin]);

  // 2. Filter tree with search query, preserving ancestors
  const visibleTree = useMemo(() => {
    return searchHierarchyTree(fullTree, searchQuery);
  }, [fullTree, searchQuery]);

  // 3. Track expanded node IDs
  const allNodeIds = useMemo(() => {
    return getAllNodeIds(fullTree);
  }, [fullTree]);

  // Default: start with all nodes expanded
  const [expandedNodeIds, setExpandedNodeIds] = useState(() => new Set(allNodeIds));

  // Expand all when allNodeIds changes if new vendors are added
  useEffect(() => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      allNodeIds.forEach((id) => next.add(id));
      return next;
    });
  }, [allNodeIds]);

  // When searching, auto-expand all visible nodes so matches and ancestors are clearly seen
  useEffect(() => {
    if (searchQuery.trim()) {
      const visibleIds = getAllNodeIds(visibleTree);
      setExpandedNodeIds(new Set(visibleIds));
    }
  }, [searchQuery, visibleTree]);

  // Node expand / collapse toggle
  const handleToggleExpand = (nodeId) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedNodeIds(new Set(allNodeIds));
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set());
  };

  // Find currently selected vendor object
  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;
    return getVendorById(vendors, selectedVendorId, admin);
  }, [vendors, selectedVendorId, admin]);

  // Find parent of selected vendor
  const parentVendor = useMemo(() => {
    if (!selectedVendor || !selectedVendor.parentId) return null;
    return getVendorById(vendors, selectedVendor.parentId, admin);
  }, [vendors, selectedVendor, admin]);

  // Find direct children of selected vendor
  const directChildren = useMemo(() => {
    if (!selectedVendor) return [];
    return getVendorChildren(vendors, selectedVendor.id);
  }, [vendors, selectedVendor]);

  // Modal triggers
  const handleOpenMoveModal = (vendor) => {
    setVendorToMove(vendor);
    setIsMoveModalOpen(true);
  };

  const handleCloseMoveModal = () => {
    setIsMoveModalOpen(false);
    setVendorToMove(null);
  };

  // Confirm move vendor
  const handleConfirmMove = (vendorId, newParentId) => {
    if (!onUpdateVendors) return;

    const targetParent = getVendorById(vendors, newParentId, admin);
    const movingVendor = vendors.find((v) => v.id === vendorId);

    const updatedVendors = moveVendor(vendors, vendorId, newParentId);
    onUpdateVendors(updatedVendors);

    // Auto expand the new parent so the moved vendor is immediately visible
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      next.add(newParentId);
      next.add(vendorId);
      return next;
    });

    // Keep the moved vendor selected
    setSelectedVendorId(vendorId);

    // Feedback notice
    const parentName = targetParent ? targetParent.name : "Root";
    const vName = movingVendor ? movingVendor.name : vendorId;
    setNotification(`Successfully relocated "${vName}" under "${parentName}". Hierarchy updated.`);
  };

  return (
    <div className="vh-page-container">
      {/* Header */}
      <div className="vh-page-header">
        <div className="vh-header-top">
          <div>
            <h1 className="vh-title">Vendor Hierarchy</h1>
            <p className="vh-description">
              Manage multi-level vendor reporting structures, inspect downstream child organizations,
              and reassign operational command lines with automated circular-loop prevention.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="vh-alert-success" role="status">
          <span>&#10003; {notification}</span>
          <button
            type="button"
            className="vh-alert-dismiss"
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Action Bar (Search & Expansion Controls) */}
      <HierarchyActions
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        totalNodesCount={allNodeIds.length}
      />

      {/* Two Column Workspace Grid */}
      <div className="vh-workspace-grid">
        {/* Left Side: Dynamic Hierarchy Tree */}
        <HierarchyTree
          treeNodes={visibleTree}
          selectedVendorId={selectedVendorId}
          expandedNodeIds={expandedNodeIds}
          searchQuery={searchQuery}
          onSelectNode={(id) => setSelectedVendorId(id)}
          onToggleExpand={handleToggleExpand}
          onOpenMoveModal={handleOpenMoveModal}
        />

        {/* Right Side: Selected Organization Details Panel */}
        <HierarchyDetails
          selectedVendor={selectedVendor}
          parentVendor={parentVendor}
          directChildren={directChildren}
          vehicles={vehicles}
          drivers={drivers}
          onSelectVendor={(id) => setSelectedVendorId(id)}
          onOpenMoveModal={handleOpenMoveModal}
          onEditVendor={onNavigateDirectory}
        />
      </div>

      {/* Relocation Modal */}
      <MoveVendorModal
        isOpen={isMoveModalOpen}
        vendor={vendorToMove}
        allVendors={vendors}
        admin={admin}
        onClose={handleCloseMoveModal}
        onConfirmMove={handleConfirmMove}
      />
    </div>
  );
}
