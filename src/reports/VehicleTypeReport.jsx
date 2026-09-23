import React from "react";

export default function VehicleTypeReport({ modelData = [] }) {
  const totalVehicles = modelData.reduce((acc, curr) => acc + curr.count, 0);

  const colors = [
    "#7c3aed",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#06b6d4",
    "#ec4899",
    "#8b5cf6",
  ];

  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Fleet Model Breakdown</h3>
          <p className="rpt-card-subtitle">
            Vehicle distribution across commercial models and seating variants.
          </p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280" }}>
          {totalVehicles} Vehicles
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modelData.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
            No vehicle models available.
          </div>
        ) : (
          modelData.map((item, index) => {
            const color = colors[index % colors.length];

            return (
              <div key={item.model} className="rpt-bar-item">
                <div className="rpt-bar-header">
                  <span className="rpt-bar-label">{item.model}</span>
                  <span className="rpt-bar-value">
                    {item.count} cabs &bull; <strong>{item.percentage}%</strong>
                  </span>
                </div>
                <div className="rpt-bar-track">
                  <div
                    className="rpt-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
