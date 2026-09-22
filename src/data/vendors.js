export const admin = {
  id: "admin-001",
  name: "FleetHub Admin",
  role: "Super Vendor",
};

export const vendors = [
  {
    id: "vendor-001",
    name: "Aryan Fleet Services",
    email: "contact@aryanfleet.com",
    phone: "+91 98765 43210",
    parentId: "admin-001",
    level: "Regional Vendor",
    location: "Ludhiana, Punjab",
    status: "active",
    vehicleCount: 5,
    driverCount: 5,
    createdAt: "2025-06-12",
  },

  {
    id: "vendor-002",
    name: "Bharat Mobility Solutions",
    email: "admin@bharatmobility.com",
    phone: "+91 98123 45678",
    parentId: "admin-001",
    level: "Regional Vendor",
    location: "Chandigarh, Punjab",
    status: "active",
    vehicleCount: 4,
    driverCount: 4,
    createdAt: "2025-07-08",
  },

  {
    id: "vendor-003",
    name: "Kavya Transport Services",
    email: "hello@kavyatransport.com",
    phone: "+91 97654 32109",
    parentId: "admin-001",
    level: "Regional Vendor",
    location: "Jaipur, Rajasthan",
    status: "active",
    vehicleCount: 6,
    driverCount: 6,
    createdAt: "2025-08-15",
  },

  {
    id: "vendor-004",
    name: "Punjab Ride Network",
    email: "support@punjabrides.com",
    phone: "+91 98987 65432",
    parentId: "vendor-001",
    level: "City Vendor",
    location: "Amritsar, Punjab",
    status: "active",
    vehicleCount: 3,
    driverCount: 3,
    createdAt: "2026-01-20",
  },

  {
    id: "vendor-005",
    name: "Delhi Prime Cabs",
    email: "admin@delhiprimecabs.com",
    phone: "+91 99887 76655",
    parentId: "vendor-002",
    level: "City Vendor",
    location: "New Delhi, Delhi",
    status: "active",
    vehicleCount: 5,
    driverCount: 5,
    createdAt: "2026-02-11",
  },

  {
    id: "vendor-006",
    name: "Pink City Mobility",
    email: "contact@pinkcitymobility.com",
    phone: "+91 98712 34567",
    parentId: "vendor-003",
    level: "City Vendor",
    location: "Jaipur, Rajasthan",
    status: "inactive",
    vehicleCount: 2,
    driverCount: 2,
    createdAt: "2026-03-05",
  },
];

export default vendors;
