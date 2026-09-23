import React from "react";

export default function DriverStatusBadge({ status }) {
  const s = (status || "active").toLowerCase();
  const isActive = s === "active";

  return (
    <span
      className={`dm-badge-pill ${
        isActive ? "vm-status-active" : "vm-status-inactive"
      }`}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          display: "inline-block",
        }}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
