import React from "react";

export default function RecentActivity({
  activities = [],
}) {
  const getBadgeClass = (type) => {
    switch (type) {
      case "VENDOR_CREATED":
      case "VEHICLE_ADDED":
      case "DRIVER_ADDED":
        return "dsh-pill-green";
      case "DRIVER_ASSIGNED":
      case "VEHICLE_ASSIGNED":
        return "dsh-pill-purple";
      case "DOC_UPLOADED":
      case "DOC_RENEWED":
        return "dsh-pill-green";
      case "VENDOR_MOVED":
        return "dsh-pill-yellow";
      case "COMPLIANCE_ALERT":
        return "dsh-pill-red";
      default:
        return "dsh-pill-gray";
    }
  };

  return (
    <div className="dsh-card">
      <div className="dsh-card-header">
        <div>
          <h3 className="dsh-card-title">Recent Activity</h3>
          <p className="dsh-card-subtitle">
            Live frontend session activity stream (audit log).
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            backgroundColor: "#f3f4f6",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: 600,
            color: "#6b7280",
          }}
        >
          Session Live
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="dsh-empty-state" style={{ padding: "20px" }}>
          <p className="dsh-empty-desc" style={{ margin: 0 }}>
            No operational events recorded during this frontend session yet.
          </p>
        </div>
      ) : (
        <div className="dsh-activity-list">
          {activities.map((act) => (
            <div key={act.id} className="dsh-activity-item">
              <div className="dsh-activity-dot" />
              <div className="dsh-activity-body">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className={`dsh-pill-badge ${getBadgeClass(act.type)}`} style={{ fontSize: "10px" }}>
                    {act.type.replace(/_/g, " ")}
                  </span>
                  <span className="dsh-activity-time">{act.timestamp}</span>
                </div>
                <div className="dsh-activity-msg">{act.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
