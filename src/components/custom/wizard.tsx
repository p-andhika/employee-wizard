import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Autocomplete from "./autocomplete";
import type { BasicInfo, Details, Employee } from "@/types";
import { generateEmployeeId, validateEmail } from "@/lib/utils";
import {
  useDepartments,
  useEmployees,
  useLocations,
  useSubmitEmployee,
} from "@/hooks/useApi";
import { Button } from "../ui/button";
import { toast } from "sonner";
import ImageUpload from "./image-upload";

type Props = {
  setShownWizard: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
  role: "admin" | "ops";
  step: number;
};

const Wizard = ({ isOpen, setShownWizard, role, step, setStep }: Props) => {
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    fullName: "",
    email: "",
    department: "",
    role: "",
    employeeId: "",
  });

  const [details, setDetails] = useState<Details>({
    photo: "",
    employmentType: "",
    officeLocation: "",
    notes: "",
  });

  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const saveDraft = useCallback(() => {
    const draftKey = role === "admin" ? "draft_admin" : "draft_ops";
    const draft = { basicInfo, details, step };
    localStorage.setItem(draftKey, JSON.stringify(draft));
    toast.info("Draft saved!");
  }, [basicInfo, details, step, role]);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = setTimeout(() => {
        saveDraft();
      }, 2000);
    }

    return () => clearTimeout(autoSaveTimeout.current);
  }, [basicInfo, details, saveDraft, isOpen]);

  // load draft on mount
  useEffect(() => {
    if (isOpen) {
      const draftKey = role === "admin" ? "draft_admin" : "draft_ops";
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setBasicInfo(draft.basicInfo || basicInfo);
        setDetails(draft.details || details);
        setStep(draft.step || 1);
      }
    }
  }, [role, isOpen]);

  const { data: employees = [] } = useEmployees(isOpen);

  // generate employee id
  useEffect(() => {
    if (basicInfo.department && !basicInfo.employeeId) {
      const existingIds = employees
        .map((e: Employee) => e.employeeId)
        .filter(Boolean);
      const newId = generateEmployeeId(basicInfo.department, existingIds);
      setBasicInfo((prev) => ({ ...prev, employeeId: newId }));
    }
  }, [basicInfo.department, employees]);

  // validation
  const isStep1Valid = () => {
    return (
      basicInfo.fullName &&
      validateEmail(basicInfo.email) &&
      basicInfo.department &&
      basicInfo.role &&
      basicInfo.employeeId
    );
  };

  const isStep2Valid = () => {
    return details.employmentType && details.officeLocation;
  };

  const handleClearDraft = () => {
    const draftKey = role === "admin" ? "draft_admin" : "draft_ops";
    localStorage.removeItem(draftKey);
    setBasicInfo({
      fullName: "",
      email: "",
      department: "",
      role: "",
      employeeId: "",
    });
    setDetails({
      photo: "",
      employmentType: "",
      officeLocation: "",
      notes: "",
    });
    setStep(1);
    resetSubmit();
  };

  const {
    submitEmployee,
    isSubmitting,
    reset: resetSubmit,
  } = useSubmitEmployee();

  const handleSubmit = async () => {
    try {
      const res = await submitEmployee(basicInfo, details);

      if (res.success) {
        setShownWizard(false);
        resetSubmit();
        handleClearDraft();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setShownWizard(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            {role === "admin"
              ? "Admin Access - Full Form"
              : "Ops Access - Details Only"}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center ${role === "admin" ? "" : "opacity-50"}`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors ${
                    step >= 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <div
                  className={`w-24 h-1 transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`}
                ></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors ${
                    step >= 2
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && role === "admin" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={basicInfo.fullName}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, email: e.target.value })
                    }
                    placeholder="employee@company.com"
                    className={
                      basicInfo.email && !validateEmail(basicInfo.email)
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {basicInfo.email && !validateEmail(basicInfo.email) && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      Invalid email format
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Autocomplete
                    value={basicInfo.department}
                    onChange={(val) =>
                      setBasicInfo({
                        ...basicInfo,
                        department: val,
                        employeeId: "",
                      })
                    }
                    useQueryHook={useDepartments}
                    placeholder="Search department..."
                    displayKey="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={basicInfo.role}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, role: val })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ops">Ops</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Engineer">Engineer</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={basicInfo.employeeId}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid()}
                    className="flex-1"
                  >
                    Next Step
                  </Button>
                  <Button onClick={handleClearDraft} variant="outline">
                    Clear Draft
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo</Label>
                  <ImageUpload
                    value={details.photo}
                    onChange={(val) => setDetails({ ...details, photo: val })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select
                    value={details.employmentType}
                    onValueChange={(val) =>
                      setDetails({ ...details, employmentType: val })
                    }
                  >
                    <SelectTrigger id="employmentType">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location *</Label>
                  <Autocomplete
                    value={details.officeLocation}
                    onChange={(val) =>
                      setDetails({ ...details, officeLocation: val })
                    }
                    useQueryHook={useLocations}
                    placeholder="Search location..."
                    displayKey="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={details.notes}
                    onChange={(e) =>
                      setDetails({ ...details, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  {role === "admin" && (
                    <Button
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      variant="outline"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStep2Valid() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    onClick={handleClearDraft}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    Clear Draft
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Wizard;
