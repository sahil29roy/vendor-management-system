/**
 * hierarchyUtils.js
 * Dynamic N-level parent-child vendor hierarchy utilities.
 */

/**
 * Find vendor or admin by ID
 */
export function getVendorById(vendors, vendorId, admin = null) {
  if (admin && admin.id === vendorId) {
    return {
      ...admin,
      level: admin.role || "Super Vendor",
      location: "Central Headquarters",
      status: "active",
      vehicleCount: 0,
      driverCount: 0,
    };
  }
  return vendors.find((v) => v.id === vendorId) || null;
}

/**
 * Get direct child vendors of a given parentId
 */
export function getVendorChildren(vendors, parentId) {
  return vendors.filter((v) => v.parentId === parentId);
}

/**
 * Get all descendant IDs of a vendor (recursive, unlimited levels)
 */
export function getDescendantIds(vendors, vendorId) {
  const descendantIds = [];

  function collect(currentId) {
    const directChildren = vendors.filter((v) => v.parentId === currentId);
    for (const child of directChildren) {
      descendantIds.push(child.id);
      collect(child.id);
    }
  }

  collect(vendorId);
  return descendantIds;
}

/**
 * Check if possibleDescendantId is a descendant of vendorId
 */
export function isDescendant(vendors, vendorId, possibleDescendantId) {
  if (!vendorId || !possibleDescendantId) return false;
  const descendants = getDescendantIds(vendors, vendorId);
  return descendants.includes(possibleDescendantId);
}

/**
 * Validate whether a vendor can be moved under newParentId
 * Returns { allowed: boolean, reason?: string }
 */
export function canMoveVendor(vendors, vendorId, newParentId, admin = null) {
  if (!vendorId) {
    return { allowed: false, reason: "Invalid vendor ID." };
  }

  if (vendorId === newParentId) {
    return { allowed: false, reason: "A vendor cannot be assigned as its own parent." };
  }

  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) {
    return { allowed: false, reason: "Vendor not found." };
  }

  // Check if moving to current parent
  if (vendor.parentId === newParentId) {
    return { allowed: false, reason: "Vendor is already assigned to this parent." };
  }

  // Circular hierarchy check: cannot move under its own descendant
  if (isDescendant(vendors, vendorId, newParentId)) {
    return {
      allowed: false,
      reason: "Cannot move vendor under one of its own descendants (would cause a circular loop).",
    };
  }

  // Check if target parent exists
  const isSuperAdmin = admin && (admin.id === newParentId || newParentId === null);
  const targetParent = vendors.find((v) => v.id === newParentId);

  if (!isSuperAdmin && !targetParent) {
    return { allowed: false, reason: "Target parent vendor does not exist." };
  }

  if (targetParent && targetParent.status === "inactive") {
    return {
      allowed: false,
      reason: "Cannot assign to an inactive parent vendor.",
    };
  }

  return { allowed: true, reason: "" };
}

/**
 * Move a vendor under a new parent (immutable)
 */
export function moveVendor(vendors, vendorId, newParentId) {
  return vendors.map((v) =>
    v.id === vendorId ? { ...v, parentId: newParentId } : v
  );
}

/**
 * Recursively build an N-level hierarchy tree.
 * Handles multiple root nodes and optional top-level Admin root.
 */
export function buildVendorTree(vendors, admin = null) {
  // Map of children by parentId
  const childrenMap = new Map();

  vendors.forEach((v) => {
    const pId = v.parentId || "__ROOT__";
    if (!childrenMap.has(pId)) {
      childrenMap.set(pId, []);
    }
    childrenMap.get(pId).push(v);
  });

  // Recursive tree node builder
  function buildNode(item, depth = 0) {
    const rawChildren = childrenMap.get(item.id) || [];
    const children = rawChildren.map((child) => buildNode(child, depth + 1));

    return {
      ...item,
      depth,
      children,
      childCount: children.length,
    };
  }

  // If admin is provided, it acts as the primary root if vendors point to it
  if (admin) {
    const adminChildren = [
      ...(childrenMap.get(admin.id) || []),
      ...(childrenMap.get("__ROOT__") || []),
    ];

    const adminRoot = {
      id: admin.id,
      name: admin.name,
      level: admin.role || "Super Vendor",
      role: admin.role || "Super Vendor",
      location: "Central Headquarters",
      status: "active",
      parentId: null,
      depth: 0,
      children: adminChildren.map((child) => buildNode(child, 1)),
      childCount: adminChildren.length,
      isRoot: true,
      isAdmin: true,
    };

    // Also check if any vendors have orphaned parentIds that aren't admin or other vendors
    const allKnownIds = new Set([admin.id, ...vendors.map((v) => v.id)]);
    const orphanedRoots = vendors.filter(
      (v) => v.parentId && !allKnownIds.has(v.parentId)
    );

    if (orphanedRoots.length > 0) {
      return [adminRoot, ...orphanedRoots.map((v) => buildNode(v, 0))];
    }

    return [adminRoot];
  }

  // Without admin, find all root nodes (parentId is null or not found)
  const rootVendors = vendors.filter(
    (v) => !v.parentId || !vendors.some((p) => p.id === v.parentId)
  );

  return rootVendors.map((v) => buildNode(v, 0));
}

/**
 * Filter tree by search query while preserving ancestors of matched nodes.
 */
export function searchHierarchyTree(treeNodes, query) {
  if (!query || !query.trim()) {
    return treeNodes;
  }

  const q = query.trim().toLowerCase();

  function filterNode(node) {
    const isDirectMatch =
      (node.name && node.name.toLowerCase().includes(q)) ||
      (node.level && node.level.toLowerCase().includes(q)) ||
      (node.role && node.role.toLowerCase().includes(q)) ||
      (node.location && node.location.toLowerCase().includes(q)) ||
      (node.id && node.id.toLowerCase().includes(q)) ||
      (node.contactPerson && node.contactPerson.toLowerCase().includes(q));

    const filteredChildren = [];
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const filteredChild = filterNode(child);
        if (filteredChild) {
          filteredChildren.push(filteredChild);
        }
      }
    }

    if (isDirectMatch || filteredChildren.length > 0) {
      return {
        ...node,
        isMatch: isDirectMatch,
        children: filteredChildren,
        childCount: filteredChildren.length,
      };
    }

    return null;
  }

  return treeNodes.map(filterNode).filter(Boolean);
}

/**
 * Collect all node IDs from tree (for Expand All)
 */
export function getAllNodeIds(treeNodes) {
  const ids = [];

  function traverse(nodes) {
    if (!nodes) return;
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(treeNodes);
  return ids;
}
