import React from "react";

export default function DriverActions({ stats }) {
  return (
    <div className="dm-stats-strip">
      <div className="dm-stat-card">
        <span className="dm-stat-label">Total Drivers</span>
        <span className="dm-stat-value">{stats.total}</span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Active</span>
        <span className="dm-stat-value dm-stat-value-active">{stats.active}</span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Available</span>
        <span className="dm-stat-value dm-stat-value-active">{stats.available}</span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">On Trip</span>
        <span className="dm-stat-value dm-stat-value-purple">{stats.onTrip}</span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Unassigned</span>
        <span className="dm-stat-value dm-stat-value-warning">
          {stats.unassigned}
        </span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Pending Verification</span>
        <span className="dm-stat-value dm-stat-value-warning">
          {stats.pendingVerification}
        </span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Expired DLs</span>
        <span className="dm-stat-value dm-stat-value-danger">
          {stats.expiredDL}
        </span>
      </div>

      <div className="dm-stat-card">
        <span className="dm-stat-label">Inactive</span>
        <span className="dm-stat-value" style={{ color: "#6b7280" }}>
          {stats.inactive}
        </span>
      </div>
    </div>
  );
}
