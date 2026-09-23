import React, { useState, useMemo, useEffect } from "react";
import ComplianceActions from "../compliance/ComplianceActions";
import ComplianceSummary from "../compliance/ComplianceSummary";
import ComplianceFilters from "../compliance/ComplianceFilters";
import ComplianceTable from "../compliance/ComplianceTable";
import DocumentDetails from "../compliance/DocumentDetails";
import DocumentPreview from "../compliance/DocumentPreview";
import UploadDocumentModal from "../compliance/UploadDocumentModal";
import ReplaceDocumentModal from "../compliance/ReplaceDocumentModal";
import {
  getComplianceStats,
  filterDocuments,
} from "../utils/complianceUtils";
import "../styles/compliance.css";

export default function Compliance({
  documents = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  onUpdateDocuments,
  initialVendorFilter = null,
  initialVehicleFilter = null,
  initialDriverFilter = null,
  onClearInitialFilters,
  onViewVehicleInModule,
  onViewDriverInModule,
}) {
  const [activeTab, setActiveTab] = useState("documents");

  // Filters State
  const [filters, setFilters] = useState({
    searchQuery: "",
    ownerType: "all",
    documentType: "all",
    vendorId: initialVendorFilter || "all",
    status: "all",
    expiryRange: "all",
  });

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocForDetails, setSelectedDocForDetails] = useState(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [selectedDocForReplace, setSelectedDocForReplace] = useState(null);

  // Sync initial filters if provided externally
  useEffect(() => {
    if (initialVendorFilter) {
      setFilters((prev) => ({ ...prev, vendorId: initialVendorFilter }));
    }
  }, [initialVendorFilter]);

  useEffect(() => {
    if (initialVehicleFilter) {
      // Find registration number for search
      const v = vehicles.find((item) => item.id === initialVehicleFilter);
      if (v) {
        setFilters((prev) => ({
          ...prev,
          searchQuery: v.registrationNumber,
          ownerType: "vehicle",
        }));
        setActiveTab("vehicles");
      }
    }
  }, [initialVehicleFilter, vehicles]);

  useEffect(() => {
    if (initialDriverFilter) {
      const d = drivers.find((item) => item.id === initialDriverFilter);
      if (d) {
        setFilters((prev) => ({
          ...prev,
          searchQuery: d.name,
          ownerType: "driver",
        }));
        setActiveTab("drivers");
      }
    }
  }, [initialDriverFilter, drivers]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    return getComplianceStats(documents, vehicles, drivers);
  }, [documents, vehicles, drivers]);

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return filterDocuments({
      documents,
      vehicles,
      drivers,
      vendors,
      searchQuery: filters.searchQuery,
      ownerType: filters.ownerType,
      documentType: filters.documentType,
      vendorId: filters.vendorId,
      status: filters.status,
      expiryRange: filters.expiryRange,
    });
  }, [documents, vehicles, drivers, vendors, filters]);

  // Filter reset
  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      ownerType: "all",
      documentType: "all",
      vendorId: "all",
      status: "all",
      expiryRange: "all",
    });
    if (onClearInitialFilters) {
      onClearInitialFilters();
    }
  };

  // Stat Card click to quick-filter
  const handleStatClick = (item) => {
    if (item.tab) {
      setActiveTab(item.tab);
    } else if (item.statusFilter) {
      setFilters((prev) => ({
        ...prev,
        status: item.statusFilter,
      }));
      setActiveTab("documents");
    } else {
      handleResetFilters();
      setActiveTab("documents");
    }
  };

  // Upload handler
  const handleUploadDocument = (newDoc) => {
    onUpdateDocuments((prev) => [newDoc, ...prev]);
  };

  // Replace handler
  const handleReplaceDocument = (oldDocId, updatedDoc) => {
    onUpdateDocuments((prev) =>
      prev.map((d) => (d.id === oldDocId ? updatedDoc : d))
    );
  };

  return (
    <div className="comp-container">
      {/* Header Actions */}
      <ComplianceActions
        onUploadClick={() => setIsUploadOpen(true)}
        stats={stats}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Summary KPI Strip */}
      <ComplianceSummary stats={stats} onStatClick={handleStatClick} />

      {/* Filters Toolbar */}
      <ComplianceFilters
        filters={filters}
        onFilterChange={setFilters}
        vendors={vendors}
        onReset={handleResetFilters}
      />

      {/* Main Table Views */}
      <ComplianceTable
        activeTab={activeTab}
        onTabChange={setActiveTab}
        documents={documents}
        filteredDocuments={filteredDocuments}
        vehicles={vehicles}
        drivers={drivers}
        vendors={vendors}
        onViewDoc={(doc) => setSelectedDocForDetails(doc)}
        onReplaceDoc={(doc) => setSelectedDocForReplace(doc)}
        onViewVehicle={onViewVehicleInModule}
        onViewDriver={onViewDriverInModule}
      />

      {/* MODAL 1: Document Details */}
      <DocumentDetails
        isOpen={Boolean(selectedDocForDetails)}
        document={selectedDocForDetails}
        vendors={vendors}
        vehicles={vehicles}
        drivers={drivers}
        onClose={() => setSelectedDocForDetails(null)}
        onPreview={(doc) => {
          setSelectedDocForDetails(null);
          setSelectedDocForPreview(doc);
        }}
        onReplace={(doc) => {
          setSelectedDocForDetails(null);
          setSelectedDocForReplace(doc);
        }}
      />

      {/* MODAL 2: Document Preview */}
      <DocumentPreview
        isOpen={Boolean(selectedDocForPreview)}
        document={selectedDocForPreview}
        onClose={() => setSelectedDocForPreview(null)}
      />

      {/* MODAL 3: Upload Document */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadDocument}
        vehicles={vehicles}
        drivers={drivers}
        existingDocuments={documents}
      />

      {/* MODAL 4: Replace Document */}
      <ReplaceDocumentModal
        isOpen={Boolean(selectedDocForReplace)}
        document={selectedDocForReplace}
        onClose={() => setSelectedDocForReplace(null)}
        onReplace={handleReplaceDocument}
      />
    </div>
  );
}
