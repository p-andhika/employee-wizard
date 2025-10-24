import Wizard from "@/components/custom/wizard";
import { apiService } from "@/services/api";
import { mockDepartments, mockEmployees, mockLocations } from "@/test/mockData";
import { render } from "@/test/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API service
vi.mock("@/services/api", () => ({
    apiService: {
        getDepartments: vi.fn(),
        getLocations: vi.fn(),
        getAllEmployees: vi.fn(),
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

describe("Wizard Component - Submit Flow", () => {
    const mockSetShownWizard = vi.fn();
    const mockSetStep = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
        vi.mocked(apiService.getLocations).mockResolvedValue(mockLocations);
        vi.mocked(apiService.getAllEmployees).mockResolvedValue(mockEmployees);
    });

    it("should handle submit flow with progress and completion states correctly", async () => {
        // Mock successful API responses with delay to test loading state
        let basicInfoResolveFn: (value: any) => void;
        let detailsResolveFn: (value: any) => void;

        const basicInfoPromise = new Promise((resolve) => {
            basicInfoResolveFn = resolve;
        });

        const detailsPromise = new Promise((resolve) => {
            detailsResolveFn = resolve;
        });

        vi.mocked(apiService.postBasicInfo).mockReturnValue(basicInfoPromise as any);
        vi.mocked(apiService.postDetails).mockReturnValue(detailsPromise as any);

        // Pre-set draft data to simulate completed step 1
        localStorage.setItem(
            "draft_admin",
            JSON.stringify({
                basicInfo: {
                    fullName: "John Smith",
                    email: "john.smith@company.com",
                    department: "Engineering",
                    role: "Engineer",
                    employeeId: "ENG-003",
                },
                details: {
                    photo: "",
                    employmentType: "Full-time",
                    officeLocation: "New York",
                    notes: "",
                },
                step: 2,
            })
        );

        // Render wizard at step 2 (details step) for admin
        render(
            <Wizard
                isOpen={true}
                setShownWizard={mockSetShownWizard}
                role="admin"
                step={2}
                setStep={mockSetStep}
            />
        );

        // Wait for component to load draft
        await waitFor(() => {
            expect(screen.getByText("Submit")).toBeInTheDocument();
        });

        // Submit should be enabled with complete form
        const submitButton = screen.getByText("Submit");
        expect(submitButton).not.toBeDisabled();

        // Click submit
        fireEvent.click(submitButton);

        // Should show loading state
        await waitFor(() => {
            expect(screen.getByText("Submitting...")).toBeInTheDocument();
        });

        // Button should be disabled during submission
        const submittingButton = screen.getByText("Submitting...");
        expect(submittingButton).toBeDisabled();

        // Resolve the promises
        basicInfoResolveFn!({
            fullName: "John Smith",
            email: "john.smith@company.com",
            department: "Engineering",
            role: "Engineer",
            employeeId: "ENG-003",
        });

        await waitFor(() => {
            expect(apiService.postBasicInfo).toHaveBeenCalled();
        });

        detailsResolveFn!({
            photo: "",
            employmentType: "Full-time",
            officeLocation: "New York",
            notes: "",
        });

        // After successful submission, wizard should close
        await waitFor(
            () => {
                expect(mockSetShownWizard).toHaveBeenCalledWith(false);
            },
            { timeout: 3000 }
        );

        // Draft should be cleared
        await waitFor(() => {
            expect(localStorage.getItem("draft_admin")).toBeNull();
        });
    });

    it("should disable all buttons during submission", async () => {
        // Mock with delay
        vi.mocked(apiService.postBasicInfo).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                fullName: "Test User",
                                email: "test@example.com",
                                department: "Engineering",
                                role: "Engineer",
                                employeeId: "ENG-001",
                            }),
                        100
                    )
                )
        );

        vi.mocked(apiService.postDetails).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                photo: "",
                                employmentType: "Full-time",
                                officeLocation: "New York",
                                notes: "",
                            }),
                        100
                    )
                )
        );

        // Set up form data
        localStorage.setItem(
            "draft_admin",
            JSON.stringify({
                basicInfo: {
                    fullName: "Test User",
                    email: "test@example.com",
                    department: "Engineering",
                    role: "Engineer",
                    employeeId: "ENG-001",
                },
                details: {
                    photo: "",
                    employmentType: "Full-time",
                    officeLocation: "New York",
                    notes: "",
                },
                step: 2,
            })
        );

        render(
            <Wizard
                isOpen={true}
                setShownWizard={mockSetShownWizard}
                role="admin"
                step={2}
                setStep={mockSetStep}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("Submit")).toBeInTheDocument();
        });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        // Should show loading state and be disabled
        await waitFor(() => {
            const button = screen.getByText("Submitting...");
            expect(button).toBeDisabled();
        });

        // Back and Clear Draft buttons should also be disabled during submission
        await waitFor(() => {
            const backButton = screen.queryByText("Back");
            if (backButton) {
                expect(backButton).toBeDisabled();
            }

            const clearButtons = screen.queryAllByText("Clear Draft");
            clearButtons.forEach((btn) => {
                expect(btn).toBeDisabled();
            });
        });
    });

    it("should handle submission error gracefully", async () => {
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        // Mock API to fail with a delay
        vi.mocked(apiService.postBasicInfo).mockImplementation(
            () =>
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Network error")), 50)
                )
        );

        // Set up form data
        localStorage.setItem(
            "draft_admin",
            JSON.stringify({
                basicInfo: {
                    fullName: "Test User",
                    email: "test@example.com",
                    department: "Engineering",
                    role: "Engineer",
                    employeeId: "ENG-001",
                },
                details: {
                    photo: "",
                    employmentType: "Full-time",
                    officeLocation: "New York",
                    notes: "",
                },
                step: 2,
            })
        );

        render(
            <Wizard
                isOpen={true}
                setShownWizard={mockSetShownWizard}
                role="admin"
                step={2}
                setStep={mockSetStep}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("Submit")).toBeInTheDocument();
        });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        // Wait for error to be handled
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Submit error:",
                expect.any(Error)
            );
        }, { timeout: 2000 });

        // Wizard should remain open (not close on error)
        expect(mockSetShownWizard).not.toHaveBeenCalledWith(false);

        consoleErrorSpy.mockRestore();
    });

    it("should show correct progress states", async () => {
        render(
            <Wizard
                isOpen={true}
                setShownWizard={mockSetShownWizard}
                role="admin"
                step={1}
                setStep={mockSetStep}
            />
        );

        // Step indicators should be visible
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should show completion state after successful submission", async () => {
        vi.mocked(apiService.postBasicInfo).mockResolvedValue({
            fullName: "Test",
            email: "test@test.com",
            department: "Engineering",
            role: "Engineer",
            employeeId: "ENG-001",
        });

        vi.mocked(apiService.postDetails).mockResolvedValue({
            photo: "",
            employmentType: "Full-time",
            officeLocation: "New York",
            notes: "",
        });

        localStorage.setItem(
            "draft_admin",
            JSON.stringify({
                basicInfo: {
                    fullName: "Test",
                    email: "test@test.com",
                    department: "Engineering",
                    role: "Engineer",
                    employeeId: "ENG-001",
                },
                details: {
                    photo: "",
                    employmentType: "Full-time",
                    officeLocation: "New York",
                    notes: "",
                },
                step: 2,
            })
        );

        render(
            <Wizard
                isOpen={true}
                setShownWizard={mockSetShownWizard}
                role="admin"
                step={2}
                setStep={mockSetStep}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("Submit")).toBeInTheDocument();
        });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        // After successful submission, wizard closes and draft clears
        await waitFor(() => {
            expect(mockSetShownWizard).toHaveBeenCalledWith(false);
            expect(localStorage.getItem("draft_admin")).toBeNull();
        }, { timeout: 3000 });
    });
});
