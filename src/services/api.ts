import type {
  BasicInfo,
  Department,
  Details,
  Employee,
  Location,
} from "@/types";
import axios from "axios";

const API_CONFIG = {
  BASE_URL_1: import.meta.env.VITE_API_URL_1 || "http://localhost:4001",
  BASE_URL_2: import.meta.env.VITE_API_URL_2 || "http://localhost:4002",
  TIMEOUT: 10000,
};

const api1 = axios.create({
  baseURL: API_CONFIG.BASE_URL_1,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const api2 = axios.create({
  baseURL: API_CONFIG.BASE_URL_2,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  getDepartments: async (query: string = ""): Promise<Array<Department>> => {
    const response = await api1.get<Array<Department>>(`/departments`, {
      params: query ? { name_like: query } : undefined,
    });
    return response.data;
  },

  getLocations: async (query: string = ""): Promise<Array<Location>> => {
    const response = await api2.get<Array<Location>>(`/locations`, {
      params: query ? { name_like: query } : undefined,
    });
    return response.data;
  },

  getBasicInfo: async (): Promise<Array<BasicInfo>> => {
    const response = await api1.get<Array<BasicInfo>>("/basicInfo");
    return response.data;
  },

  postBasicInfo: async (data: BasicInfo): Promise<BasicInfo> => {
    const response = await api1.post<BasicInfo>("/basicInfo", data);
    return response.data;
  },

  getDetails: async (): Promise<Array<Details>> => {
    const response = await api2.get<Array<Details>>("/details");
    return response.data;
  },

  postDetails: async (data: Details): Promise<Details> => {
    const response = await api2.post<Details>("/details", data);
    return response.data;
  },

  getAllEmployees: async (): Promise<Employee[]> => {
    try {
      const [basicData, detailsData] = await Promise.all([
        apiService.getBasicInfo(),
        apiService.getDetails(),
      ]);

      // Merge data by email or employeeId
      const merged = basicData.map((basic) => {
        const detail = detailsData.find(
          (d) => d.email === basic.email || d.employeeId === basic.employeeId,
        );
        return { ...basic, ...detail } as Employee;
      });

      return merged;
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      throw error;
    }
  },
};
