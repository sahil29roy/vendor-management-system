import React from "react";

export default function DriverVerificationBadge({ verification }) {
  const v = (verification || "verified").toLowerCase();

  let className = "dm-badge-pill dm-verif-verified";
  let label = "\u2713 Verified";

  if (v === "pending" || v === "pending verification") {
    className = "dm-badge-pill dm-verif-pending";
    label = "\u23F3 Pending";
  } else if (v === "rejected") {
    className = "dm-badge-pill dm-verif-rejected";
    label = "\u2717 Rejected";
  }

  return <span className={className}>{label}</span>;
}
