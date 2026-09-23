import React, { useState, useMemo } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardStats from "../dashboard/DashboardStats";
import OperationalAlerts from "../dashboard/OperationalAlerts";
import FleetOverview from "../dashboard/FleetOverview";
import VendorOverview from "../dashboard/VendorOverview";
import ComplianceOverview from "../dashboard/ComplianceOverview";
import DriverOverview from "../dashboard/DriverOverview";
import ExpiringDocuments from "../dashboard/ExpiringDocuments";
import QuickActions from "../dashboard/QuickActions";
import RecentActivity from "../dashboard/RecentActivity";
import {
  getDashboardStats,
  getFleetOverview,
  getVendorOverview,
  getCompactHierarchy,
  getComplianceOverview,
  getDriverOverview,
  getUpcomingExpiries,
  getOperationalAlerts,
} from "../utils/dashboardUtils";
import "../styles/dashboard.css";

export default function Dashboard({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  admin = null,
  activities = [],
  onNavigate,
}) {
  // Vendor scope filter ("all" or specific vendorId)
  const [selectedVendorId, setSelectedVendorId] = useState("all");

  // Dynamic calculations derived from single source of truth
  const stats = useMemo(
    () =>
      getDashboardStats({
        vendors,
        vehicles,
        drivers,
        documents,
        selectedVendorId,
      }),
    [vendors, vehicles, drivers, documents, selectedVendorId]
  );

  const fleetOverview = useMemo(
    () =>
      getFleetOverview({
        vehicles,
        documents,
        selectedVendorId,
      }),
    [vehicles, documents, selectedVendorId]
  );

  const vendorOverview = useMemo(
    () =>
      getVendorOverview({
        vendors,
        vehicles,
        drivers,
        documents,
        limit: 5,
      }),
    [vendors, vehicles, drivers, documents]
  );

  const hierarchyTree = useMemo(
    () => getCompactHierarchy({ vendors, admin }),
    [vendors, admin]
  );

  const complianceOverview = useMemo(
    () =>
      getComplianceOverview({
        documents,
        vehicles,
        drivers,
        selectedVendorId,
      }),
    [documents, vehicles, drivers, selectedVendorId]
  );

  const driverOverview = useMemo(
    () =>
      getDriverOverview({
        drivers,
        selectedVendorId,
      }),
    [drivers, selectedVendorId]
  );

  const expiringDocs = useMemo(
    () =>
      getUpcomingExpiries({
        documents,
        vehicles,
        drivers,
        vendors,
        selectedVendorId,
        limit: 5,
      }),
    [documents, vehicles, drivers, vendors, selectedVendorId]
  );

  const alerts = useMemo(
    () =>
      getOperationalAlerts({
        vehicles,
        drivers,
        documents,
        selectedVendorId,
      }),
    [vehicles, drivers, documents, selectedVendorId]
  );

  return (
    <div className="dsh-container">
      {/* Dashboard Header with Live Date & Scope Selector */}
      <DashboardHeader
        vendors={vendors}
        selectedVendorId={selectedVendorId}
        onSelectVendor={setSelectedVendorId}
      />

      {/* High-Priority Operational Alerts Banner */}
      <OperationalAlerts alerts={alerts} onNavigate={onNavigate} />

      {/* Top Summary KPI Cards */}
      <DashboardStats stats={stats} onNavigate={onNavigate} />

      {/* Row 1: Fleet Overview & Compliance Overview */}
      <div className="dsh-grid-2col">
        <FleetOverview fleetData={fleetOverview} onNavigate={onNavigate} />
        <ComplianceOverview
          complianceData={complianceOverview}
          onNavigate={onNavigate}
        />
      </div>

      {/* Row 2: Vendor Overview & Driver Workforce Overview */}
      <div className="dsh-grid-2col">
        <VendorOverview
          vendors={vendorOverview}
          hierarchyTree={hierarchyTree}
          onNavigate={onNavigate}
          onSelectVendor={setSelectedVendorId}
        />
        <DriverOverview driverData={driverOverview} onNavigate={onNavigate} />
      </div>

      {/* Row 3: Upcoming Expiries, Quick Actions & Recent Activity */}
      <div className="dsh-grid-2col">
        <ExpiringDocuments expiringDocs={expiringDocs} onNavigate={onNavigate} />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <QuickActions onNavigate={onNavigate} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
