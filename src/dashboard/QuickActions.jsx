import React from "react";

export default function QuickActions({
  onNavigate,
}) {
  const actions = [
    {
      id: "qa-vendor",
      label: "+ Add Vendor",
      target: "create-vendor",
      isPrimary: true,
      icon: "+",
    },
    {
      id: "qa-vehicle",
      label: "+ Commercial Cab",
      target: "vehicles",
      isPrimary: false,
      icon: "+",
    },
    {
      id: "qa-driver",
      label: "+ Roster Driver",
      target: "drivers",
      isPrimary: false,
      icon: "+",
    },
    {
      id: "qa-hierarchy",
      label: "Vendor Tree",
      target: "hierarchy",
      isPrimary: false,
      icon: "🌳",
    },
    {
      id: "qa-compliance",
      label: "Audit Compliance",
      target: "compliance",
      isPrimary: false,
      icon: "🛡",
    },
    {
      id: "qa-reports",
      label: "BI Reports",
      target: "reports",
      isPrimary: false,
      icon: "📊",
    },
  ];

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Quick Operations</h3>
          <p className="dsh-card-subtitle">
            Direct operational shortcuts to central workflows.
          </p>
        </div>
      </div>

      <div className="dsh-actions-grid">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            className={`dsh-action-btn ${act.isPrimary ? "dsh-action-btn-primary" : ""}`}
            onClick={() => onNavigate && onNavigate(act.target)}
          >
            <span>{act.icon}</span>
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
