import { useDepartments, useEmployees, useLocations } from "@/hooks/useApi";
import { apiService } from "@/services/api";
import { mockDepartments, mockEmployees, mockLocations } from "@/test/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API service
vi.mock("@/services/api", () => ({
  apiService: {
    getDepartments: vi.fn(),
    getLocations: vi.fn(),
    getAllEmployees: vi.fn(),
    getBasicInfo: vi.fn(),
    getDetails: vi.fn(),
    postBasicInfo: vi.fn(),
    postDetails: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useApi Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useDepartments", () => {
    it("should fetch departments when search query is provided", async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);

      const { result } = renderHook(() => useDepartments("eng"), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.getDepartments).toHaveBeenCalledWith("eng");
      expect(result.current.data).toEqual(mockDepartments);
    });

    it("should not fetch when search query is empty", () => {
      const { result } = renderHook(() => useDepartments(""), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(apiService.getDepartments).not.toHaveBeenCalled();
    });
  });

  describe("useLocations", () => {
    it("should fetch locations when search query is provided", async () => {
      vi.mocked(apiService.getLocations).mockResolvedValue(mockLocations);

      const { result } = renderHook(() => useLocations("new"), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.getLocations).toHaveBeenCalledWith("new");
      expect(result.current.data).toEqual(mockLocations);
    });

    it("should not fetch when search query is empty", () => {
      const { result } = renderHook(() => useLocations(""), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(apiService.getLocations).not.toHaveBeenCalled();
    });
  });

  describe("useEmployees", () => {
    it("should fetch all employees when enabled", async () => {
      vi.mocked(apiService.getAllEmployees).mockResolvedValue(mockEmployees);

      const { result } = renderHook(() => useEmployees(true), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.getAllEmployees).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockEmployees);
    });

    it("should not fetch when disabled", () => {
      const { result } = renderHook(() => useEmployees(false), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(apiService.getAllEmployees).not.toHaveBeenCalled();
    });
  });
});
