import React from "react";

const STANDARD_PERMISSIONS = [
  {
    id: "Fleet Management",
    label: "Fleet Management",
    desc: "Oversee fleet status, route assignments, and operational shifts.",
  },
  {
    id: "Driver Management",
    label: "Driver Management",
    desc: "Onboard drivers, assign shifts, and verify licenses.",
  },
  {
    id: "Vehicle Management",
    label: "Vehicle Management",
    desc: "Register cabs, monitor PUC/fitness certificates, and maintenance.",
  },
  {
    id: "Document Management",
    label: "Document Management",
    desc: "Upload, inspect, and approve compliance documentation.",
  },
  {
    id: "Booking Management",
    label: "Booking Management",
    desc: "Accept and dispatch employee commute bookings and ad-hoc trips.",
  },
  {
    id: "Payment Management",
    label: "Payment Management",
    desc: "View billing ledgers, generate invoices, and payout settlements.",
  },
  {
    id: "Compliance Management",
    label: "Compliance Management",
    desc: "Monitor audit scores, breathalyzer logs, and police checks.",
  },
];

const DELEGATED_PERMISSIONS = [
  {
    id: "Sub-Vendor Creation",
    label: "Sub-Vendor Creation & Onboarding",
    desc: "Allow this vendor to register and oversee lower-tier child vendors.",
  },
  {
    id: "User & Role Management",
    label: "User & Role Administration",
    desc: "Manage operator accounts and assign sub-vendor permission roles.",
  },
  {
    id: "Contract & SLA Approval",
    label: "Contract & SLA Approval",
    desc: "Directly approve sub-contractor terms and operational SLAs.",
  },
];

export default function VendorPermissions({
  selectedPermissions = [],
  delegatedAccess = false,
  delegatedPermissions = [],
  onPermissionToggle,
  onDelegatedAccessToggle,
  onDelegatedPermissionToggle,
}) {
  return (
    <div className="vms-section">
      <div className="vms-section-header">
        <h2 className="vms-section-title">Section 3 — Access and Permissions</h2>
        <p className="vms-section-desc">
          Permissions determine what operational modules and system capabilities this
          vendor can access and manage.
        </p>
      </div>

      <div className="vms-permissions-grid">
        {STANDARD_PERMISSIONS.map((perm) => {
          const isChecked = selectedPermissions.includes(perm.id);
          return (
            <label key={perm.id} className="vms-checkbox-label">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onPermissionToggle(perm.id)}
              />
              <div>
                <strong>{perm.label}</strong>
                <p className="vms-helper-text" style={{ marginTop: "2px" }}>
                  {perm.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Delegated Access Section */}
      <div className="vms-delegated-box">
        <label className="vms-delegated-toggle-label">
          <input
            type="checkbox"
            checked={delegatedAccess}
            onChange={(e) => onDelegatedAccessToggle(e.target.checked)}
          />
          Allow this vendor to perform delegated administrative actions
        </label>
        <p className="vms-helper-text" style={{ marginLeft: "24px" }}>
          Enable if this regional or city vendor requires managerial authority over
          downstream vendors, compliance policies, or user provisioning.
        </p>

        {delegatedAccess && (
          <div className="vms-delegated-options">
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1e40af",
                marginBottom: "4px",
              }}
            >
              Additional Delegated Administrative Privileges:
            </p>
            {DELEGATED_PERMISSIONS.map((dPerm) => {
              const isChecked = delegatedPermissions.includes(dPerm.id);
              return (
                <label key={dPerm.id} className="vms-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onDelegatedPermissionToggle(dPerm.id)}
                  />
                  <div>
                    <strong>{dPerm.label}</strong>
                    <span className="vms-helper-text" style={{ marginLeft: "6px" }}>
                      &mdash; {dPerm.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
