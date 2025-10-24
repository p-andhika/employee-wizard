import Autocomplete from "@/components/custom/autocomplete";
import { mockDepartments } from "@/test/mockData";
import { render } from "@/test/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Autocomplete Component", () => {
  const mockUseQueryHook = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryHook.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
    });
  });

  it("should render input field with placeholder", () => {
    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    expect(input).toBeInTheDocument();
  });

  it("should display current value in input", () => {
    render(
      <Autocomplete
        value="Engineering"
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByDisplayValue("Engineering");
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when input value changes", () => {
    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    fireEvent.change(input, { target: { value: "Eng" } });

    expect(mockOnChange).toHaveBeenCalledWith("Eng");
  });

  it("should show dropdown with options when typing", async () => {
    mockUseQueryHook.mockReturnValue({
      data: mockDepartments,
      isLoading: false,
      isFetching: false,
    });

    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    fireEvent.change(input, { target: { value: "Eng" } });

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });
  });

  it("should display loading state", () => {
    mockUseQueryHook.mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: true,
    });

    render(
      <Autocomplete
        value="test"
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    fireEvent.focus(input);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display no results message when no options found", async () => {
    const emptyQueryHook = vi.fn().mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
    });

    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={emptyQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    fireEvent.change(input, { target: { value: "NonExistent" } });

    await waitFor(
      () => {
        const noResults = screen.queryByText("No results found");
        expect(noResults).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("should select option when clicked", async () => {
    mockUseQueryHook.mockReturnValue({
      data: mockDepartments,
      isLoading: false,
      isFetching: false,
    });

    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    fireEvent.change(input, { target: { value: "Eng" } });

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    const option = screen.getByText("Engineering");
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("Engineering");
  });

  it("should apply error styling when error prop is true", () => {
    render(
      <Autocomplete
        value=""
        onChange={mockOnChange}
        useQueryHook={mockUseQueryHook}
        placeholder="Search departments..."
        displayKey="name"
        error={true}
      />,
    );

    const input = screen.getByPlaceholderText("Search departments...");
    expect(input).toHaveClass("border-destructive");
  });
});
