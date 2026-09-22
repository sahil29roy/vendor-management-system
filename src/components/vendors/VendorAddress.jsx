import React from "react";

export default function VendorAddress({ formData, onChange }) {
  return (
    <div className="vms-section">
      <div className="vms-section-header">
        <h2 className="vms-section-title">Section 4 — Contact / Address</h2>
        <p className="vms-section-desc">
          Official physical and operational headquarters address.
        </p>
      </div>

      <div className="vms-grid-2">
        {/* Full Address Textarea */}
        <div className="vms-form-group vms-grid-full">
          <label className="vms-label" htmlFor="address">
            Complete Street Address
          </label>
          <textarea
            id="address"
            name="address"
            className="vms-textarea"
            placeholder="Enter building, street, landmark, and locality"
            value={formData.address || ""}
            onChange={onChange}
            rows={3}
          />
        </div>

        {/* City */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className="vms-input"
            placeholder="e.g. Ludhiana, Chandigarh, Jaipur"
            value={formData.city || ""}
            onChange={onChange}
          />
        </div>

        {/* State */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="state">
            State / Province
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className="vms-input"
            placeholder="e.g. Punjab, Rajasthan, Delhi"
            value={formData.state || ""}
            onChange={onChange}
          />
        </div>

        {/* Postal Code */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="postalCode">
            Postal / ZIP Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            className="vms-input"
            placeholder="e.g. 141001"
            value={formData.postalCode || ""}
            onChange={onChange}
          />
        </div>

        {/* Country */}
        <div className="vms-form-group">
          <label className="vms-label" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            className="vms-input"
            placeholder="Enter country"
            value={formData.country || "India"}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
