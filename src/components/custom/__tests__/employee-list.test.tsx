import EmployeeList from "@/components/custom/employee-list";
import { apiService } from "@/services/api";
import { mockEmployees } from "@/test/mockData";
import { render } from "@/test/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API service
vi.mock("@/services/api", () => ({
  apiService: {
    getAllEmployees: vi.fn(),
  },
}));

describe("EmployeeList Component", () => {
  const mockOpenWizard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render component with title", () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue([]);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    expect(screen.getByText("Employee List")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your organization's employees"),
    ).toBeInTheDocument();
  });

  it("should render Add buttons", () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue([]);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    expect(screen.getByText("+ Add (Admin)")).toBeInTheDocument();
    expect(screen.getByText("+ Add (Ops)")).toBeInTheDocument();
  });

  it("should call openWizard with admin role when Add (Admin) is clicked", () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue([]);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    const adminButton = screen.getByText("+ Add (Admin)");
    fireEvent.click(adminButton);

    expect(mockOpenWizard).toHaveBeenCalledWith("admin");
  });

  it("should call openWizard with ops role when Add (Ops) is clicked", () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue([]);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    const opsButton = screen.getByText("+ Add (Ops)");
    fireEvent.click(opsButton);

    expect(mockOpenWizard).toHaveBeenCalledWith("ops");
  });

  it("should show loading state while fetching employees", () => {
    vi.mocked(apiService.getAllEmployees).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<EmployeeList openWizard={mockOpenWizard} />);

    expect(screen.getByText("Loading employees...")).toBeInTheDocument();
  });

  it("should display empty state when no employees exist", async () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue([]);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText("No employees yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Get started by adding your first employee"),
    ).toBeInTheDocument();
  });

  it("should display employee list when employees exist", async () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue(mockEmployees);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Operations")).toBeInTheDocument();
  });

  it("should display employee avatars", async () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue(mockEmployees);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check that avatar fallbacks are rendered (initials)
    expect(screen.getByText("JD")).toBeInTheDocument(); // John Doe
    expect(screen.getByText("JS")).toBeInTheDocument(); // Jane Smith
  });

  it("should paginate employees correctly", async () => {
    // Create more than 5 employees to test pagination
    const manyEmployees = Array.from({ length: 12 }, (_, i) => ({
      ...mockEmployees[0],
      employeeId: `EMP-${i + 1}`,
      fullName: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
    }));

    vi.mocked(apiService.getAllEmployees).mockResolvedValue(manyEmployees);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText("Employee 1")).toBeInTheDocument();
    });

    // Should show first 5 employees
    expect(screen.getByText("Employee 5")).toBeInTheDocument();
    expect(screen.queryByText("Employee 6")).not.toBeInTheDocument();

    // Navigate to next page - find button by testing ID or just get all buttons
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1]; // Last button is next
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Employee 6")).toBeInTheDocument();
    });
  });

  it("should disable previous button on first page", async () => {
    // Create more than 5 employees to ensure pagination is shown
    const manyEmployees = Array.from({ length: 12 }, (_, i) => ({
      ...mockEmployees[0],
      employeeId: `EMP-${i + 1}`,
      fullName: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
    }));

    vi.mocked(apiService.getAllEmployees).mockResolvedValue(manyEmployees);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText("Employee 1")).toBeInTheDocument();
    });

    // Get all buttons, pagination buttons are at the end
    const buttons = screen.getAllByRole("button");
    // Previous button should be disabled (third from end: prev, page text, next)
    const prevButton = buttons[buttons.length - 2]; // Second from end
    expect(prevButton).toBeDisabled();
  });

  it("should show error message when fetching employees fails", async () => {
    vi.mocked(apiService.getAllEmployees).mockRejectedValue(
      new Error("Network error"),
    );

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load employees/i)).toBeInTheDocument();
    });
  });

  it("should display pagination info correctly", async () => {
    vi.mocked(apiService.getAllEmployees).mockResolvedValue(mockEmployees);

    render(<EmployeeList openWizard={mockOpenWizard} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Showing 1 to 2 of 2 employees/i),
      ).toBeInTheDocument();
    });
  });
});
