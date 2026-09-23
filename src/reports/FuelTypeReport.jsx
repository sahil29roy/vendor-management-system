import React from "react";

export default function FuelTypeReport({ fuelData = [] }) {
  const fuelColors = {
    Diesel: "#4b5563",
    Petrol: "#f59e0b",
    CNG: "#10b981",
    Electric: "#3b82f6",
  };

  const total = fuelData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rpt-card">
      <div className="rpt-card-header">
        <div>
          <h3 className="rpt-card-title">Fleet Fuel Type Utilization</h3>
          <p className="rpt-card-subtitle">
            Environmental and operational fuel profile across all commercial cabs.
          </p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280" }}>
          {total} Vehicles
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {fuelData.map((item) => {
          const color = fuelColors[item.fuel] || "#7c3aed";

          return (
            <div key={item.fuel} className="rpt-bar-item">
              <div className="rpt-bar-header">
                <span className="rpt-bar-label">{item.fuel}</span>
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
        })}
      </div>
    </div>
  );
}
