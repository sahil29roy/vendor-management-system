import React from "react";

export default function OperationalAlerts({
  alerts = [],
  onNavigate,
}) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="dsh-alerts-container">
        <div className="dsh-alert-banner dsh-alert-healthy">
          <div className="dsh-alert-left">
            <span className="dsh-alert-icon">&#x2714;</span>
            <div>
              <span className="dsh-alert-title">Compliance Clean Status: </span>
              <span>All monitored compliance requirements are currently satisfied.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dsh-alerts-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`dsh-alert-banner ${
            alert.severity === "critical" ? "dsh-alert-critical" : "dsh-alert-warning"
          }`}
        >
          <div className="dsh-alert-left">
            <span className="dsh-alert-icon">
              {alert.severity === "critical" ? "⚠" : "ℹ"}
            </span>
            <div>
              <div className="dsh-alert-title">{alert.title}</div>
              <div className="dsh-alert-desc">{alert.description}</div>
            </div>
          </div>

          {alert.actionLabel && (
            <button
              type="button"
              className="dsh-alert-btn"
              onClick={() => onNavigate && onNavigate(alert.targetRoute)}
            >
              {alert.actionLabel} &rarr;
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
