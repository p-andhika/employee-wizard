export type Department = {
  id: number;
  name: string;
};

export type Location = {
  id: number;
  name: string;
};

export type BasicInfo = {
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
};

export type Details = {
  photo: string;
  employmentType: string;
  officeLocation: string;
  notes: string;
  email?: string;
  employeeId?: string;
};

export type Employee = BasicInfo & Details;
