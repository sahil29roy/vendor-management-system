import React from "react";

export default function DocumentStatusBadge({ status, label }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let badgeClass = "comp-badge";
  let displayLabel = label;
  let icon = "";

  switch (normalized) {
    case "valid":
      badgeClass += " valid";
      displayLabel = displayLabel || "Valid";
      icon = "✓";
      break;
    case "expiring_soon":
    case "expiring":
      badgeClass += " expiring_soon";
      displayLabel = displayLabel || "Expiring Soon";
      icon = "⏳";
      break;
    case "expired":
      badgeClass += " expired";
      displayLabel = displayLabel || "Expired";
      icon = "✕";
      break;
    case "missing":
      badgeClass += " missing";
      displayLabel = displayLabel || "Missing";
      icon = "!";
      break;
    case "compliant":
      badgeClass += " compliant";
      displayLabel = displayLabel || "Compliant";
      icon = "✓";
      break;
    case "non_compliant":
      badgeClass += " non_compliant";
      displayLabel = displayLabel || "Non-Compliant";
      icon = "✕";
      break;
    case "allowed":
      badgeClass += " operational-allowed";
      displayLabel = displayLabel || "Allowed";
      icon = "✓";
      break;
    case "blocked":
      badgeClass += " operational-blocked";
      displayLabel = displayLabel || "Blocked";
      icon = "🚫";
      break;
    default:
      badgeClass += " missing";
      displayLabel = displayLabel || status;
  }

  return (
    <span className={badgeClass}>
      {icon && <span>{icon}</span>}
      <span>{displayLabel}</span>
    </span>
  );
}
