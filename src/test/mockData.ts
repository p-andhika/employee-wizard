import type { BasicInfo, Details, Employee } from "@/types";

export const mockEmployees: Employee[] = [
  {
    employeeId: "ENG-001",
    fullName: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    role: "Engineer",
    photo: "https://example.com/photo1.jpg",
    employmentType: "Full-time",
    officeLocation: "Jakarta",
    notes: "Senior developer",
  },
  {
    employeeId: "OPS-001",
    fullName: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Operations",
    role: "Ops",
    photo: "",
    employmentType: "Full-time",
    officeLocation: "Depok",
    notes: "",
  },
];

export const mockDepartments = [
  { id: 1, name: "Lending" },
  { id: 2, name: "Funding" },
  { id: 3, name: "Operations" },
  { id: 4, name: "Engineering" },
];

export const mockLocations = [
  { id: 1, name: "Jakarta" },
  { id: 2, name: "Depok" },
  { id: 3, name: "Surabaya" },
];

export const mockBasicInfo: BasicInfo = {
  fullName: "Test User",
  email: "test@company.com",
  department: "Engineering",
  role: "Engineer",
  employeeId: "ENG-002",
};

export const mockDetails: Details = {
  photo: "",
  employmentType: "Full-time",
  officeLocation: "Jakarta",
  notes: "Test notes",
};
