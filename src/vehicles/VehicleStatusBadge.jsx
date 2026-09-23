import React from "react";

export default function VehicleStatusBadge({ status }) {
  const s = (status || "active").toLowerCase();

  let className = "vm-badge-status vm-status-active";
  let label = "Active";

  if (s === "inactive") {
    className = "vm-badge-status vm-status-inactive";
    label = "Inactive";
  } else if (s === "non-compliant" || s === "noncompliant") {
    className = "vm-badge-status vm-status-noncompliant";
    label = "Non-Compliant";
  }

  return (
    <span className={className}>
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}
