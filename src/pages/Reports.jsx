import React, { useState, useMemo } from "react";
import ReportSummaryCards from "../reports/ReportSummaryCards";
import ReportFilters from "../reports/ReportFilters";
import VendorOverviewReport from "../reports/VendorOverviewReport";
import FleetStatusReport from "../reports/FleetStatusReport";
import ComplianceReport from "../reports/ComplianceReport";
import ExpiryReport from "../reports/ExpiryReport";
import VehicleTypeReport from "../reports/VehicleTypeReport";
import FuelTypeReport from "../reports/FuelTypeReport";
import DriverStatusReport from "../reports/DriverStatusReport";
import ReportExport from "../reports/ReportExport";
import {
  filterReportData,
  getReportSummary,
  getVendorOverviewReport,
  getFleetStatusBreakdown,
  getComplianceBreakdown,
  getExpiringDocumentsReport,
  getVehicleTypeBreakdown,
  getFuelTypeBreakdown,
  getDriverStatusBreakdown,
  getDriverAvailabilityBreakdown,
  getDriverVerificationBreakdown,
} from "../utils/reportUtils";
import { getVehicleComplianceStatus } from "../utils/complianceUtils";
import { exportToCSV } from "../utils/exportUtils";
import "../styles/reports.css";

export default function Reports({
  vendors = [],
  vehicles = [],
  drivers = [],
  documents = [],
  onNavigateToVendors,
  onNavigateToVehicles,
  onNavigateToDrivers,
  onNavigateToCompliance,
}) {
  const [filters, setFilters] = useState({
    vendorId: "all",
    dateRange: "all",
    vehicleStatus: "all",
    complianceStatus: "all",
  });

  // 1. Filtered Data Slice
  const filteredData = useMemo(() => {
    return filterReportData({
      vendors,
      vehicles,
      drivers,
      documents,
      filters,
    });
  }, [vendors, vehicles, drivers, documents, filters]);

  // 2. Dynamic Derived Metrics
  const summary = useMemo(() => {
    return getReportSummary(
      filteredData.vendors,
      filteredData.vehicles,
      filteredData.drivers,
      filteredData.documents
    );
  }, [filteredData]);

  const vendorOverview = useMemo(() => {
    return getVendorOverviewReport(
      filteredData.vendors,
      filteredData.vehicles,
      filteredData.drivers,
      filteredData.documents
    );
  }, [filteredData]);

  const fleetData = useMemo(() => {
    return getFleetStatusBreakdown(filteredData.vehicles, filteredData.documents);
  }, [filteredData]);

  const complianceData = useMemo(() => {
    return getComplianceBreakdown(
      filteredData.documents,
      filteredData.vehicles,
      filteredData.drivers
    );
  }, [filteredData]);

  const expiringDocs = useMemo(() => {
    return getExpiringDocumentsReport(
      filteredData.documents,
      filteredData.vehicles,
      filteredData.drivers,
      filteredData.vendors,
      30
    );
  }, [filteredData]);

  const modelData = useMemo(() => {
    return getVehicleTypeBreakdown(filteredData.vehicles);
  }, [filteredData]);

  const fuelData = useMemo(() => {
    return getFuelTypeBreakdown(filteredData.vehicles);
  }, [filteredData]);

  const driverStatus = useMemo(() => {
    return getDriverStatusBreakdown(filteredData.drivers);
  }, [filteredData]);

  const driverAvail = useMemo(() => {
    return getDriverAvailabilityBreakdown(filteredData.drivers);
  }, [filteredData]);

  const driverVerif = useMemo(() => {
    return getDriverVerificationBreakdown(filteredData.drivers);
  }, [filteredData]);

  // Handle Card Click for Drill Down
  const handleCardClick = (card) => {
    if (card.drillView === "vendors" && onNavigateToVendors) {
      onNavigateToVendors();
    } else if (card.drillView === "vehicles" && onNavigateToVehicles) {
      onNavigateToVehicles(filters.vendorId !== "all" ? filters.vendorId : null);
    } else if (card.drillView === "drivers" && onNavigateToDrivers) {
      onNavigateToDrivers(filters.vendorId !== "all" ? filters.vendorId : null);
    } else if (card.drillView === "compliance" && onNavigateToCompliance) {
      onNavigateToCompliance(filters.vendorId !== "all" ? filters.vendorId : null);
    }
  };

  // CSV Export Handlers
  const handleExportVendorOverview = () => {
    const headers = [
      "Vendor ID",
      "Vendor Name",
      "Hierarchy Level",
      "Location",
      "Total Vehicles",
      "Active Vehicles",
      "Total Drivers",
      "Active Drivers",
      "Non-Compliant Vehicles",
      "Compliance Rate (%)",
    ];

    const rows = vendorOverview.map((v) => [
      v.vendorId,
      v.vendorName,
      v.level,
      v.location,
      v.totalVehicles,
      v.activeVehicles,
      v.totalDrivers,
      v.activeDrivers,
      v.nonCompliantCount,
      `${v.complianceRate}%`,
    ]);

    exportToCSV(headers, rows, `vendor_overview_report_${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportFleetCompliance = () => {
    const headers = [
      "Registration Number",
      "Model",
      "Vendor ID",
      "Fuel Type",
      "Status",
      "Compliance Status",
      "Operational Eligibility",
      "Non-Compliance Reasons",
    ];

    const rows = filteredData.vehicles.map((v) => {
      const comp = getVehicleComplianceStatus(filteredData.documents, v.id);
      return [
        v.registrationNumber,
        v.model,
        v.vendorId,
        v.fuelType,
        v.status,
        comp.status,
        comp.operationalStatus,
        comp.reasons ? comp.reasons.join(" | ") : "None",
      ];
    });

    exportToCSV(headers, rows, `fleet_compliance_report_${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportExpiryAudit = () => {
    const headers = [
      "Document Category",
      "Document Number",
      "Owner Type",
      "Associated Owner",
      "Vendor Organization",
      "Vehicle Plate",
      "Expiry Date",
      "Days Remaining",
      "Validity Status",
    ];

    const rows = expiringDocs.map((doc) => [
      doc.type,
      doc.documentNumber,
      doc.ownerType,
      doc.ownerName,
      doc.vendorName,
      doc.vehiclePlate,
      doc.expiryDate,
      doc.daysRemaining,
      doc.status,
    ]);

    exportToCSV(headers, rows, `document_expiry_audit_${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="rpt-container">
      {/* Header */}
      <div className="rpt-header">
        <div>
          <h1 className="rpt-title">Reports &amp; Business Intelligence</h1>
          <p className="rpt-subtitle">
            Centralized analytics across vendor hierarchy, commercial fleet capacity, workforce shifts, and regulatory compliance.
          </p>
        </div>

        <div className="rpt-header-actions">
          <ReportExport
            onExportVendorOverview={handleExportVendorOverview}
            onExportFleetCompliance={handleExportFleetCompliance}
            onExportExpiryAudit={handleExportExpiryAudit}
          />
        </div>
      </div>

      {/* Filters Toolbar */}
      <ReportFilters
        filters={filters}
        onFilterChange={setFilters}
        vendors={vendors}
        onReset={() =>
          setFilters({
            vendorId: "all",
            dateRange: "all",
            vehicleStatus: "all",
            complianceStatus: "all",
          })
        }
      />

      {/* Top Summary Cards */}
      <ReportSummaryCards summary={summary} onCardClick={handleCardClick} />

      {/* SECTION 1: Vendor Scorecard Overview */}
      <VendorOverviewReport
        vendorData={vendorOverview}
        onViewVendorVehicles={(vendorId) => onNavigateToVehicles && onNavigateToVehicles(vendorId)}
        onViewVendorDrivers={(vendorId) => onNavigateToDrivers && onNavigateToDrivers(vendorId)}
        onViewVendorCompliance={(vendorId) => onNavigateToCompliance && onNavigateToCompliance(vendorId)}
      />

      {/* SECTION 2: Fleet Status & Component Compliance */}
      <div className="rpt-grid-2col">
        <FleetStatusReport fleetData={fleetData} />
        <ComplianceReport
          complianceData={complianceData}
          onViewCompliance={() => onNavigateToCompliance && onNavigateToCompliance(null)}
        />
      </div>

      {/* SECTION 3: Critical Expiry Audit */}
      <ExpiryReport
        expiringDocs={expiringDocs}
        onViewCompliance={() => onNavigateToCompliance && onNavigateToCompliance(null)}
      />

      {/* SECTION 4: Fleet Models & Fuel Distribution */}
      <div className="rpt-grid-2col">
        <VehicleTypeReport modelData={modelData} />
        <FuelTypeReport fuelData={fuelData} />
      </div>

      {/* SECTION 5: Driver Workforce & Availability */}
      <DriverStatusReport
        statusData={driverStatus}
        availabilityData={driverAvail}
        verificationData={driverVerif}
      />
    </div>
  );
}
