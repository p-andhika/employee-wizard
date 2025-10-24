import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { type Dispatch, type SetStateAction } from "react";
import { Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  setShownWizard: Dispatch<SetStateAction<boolean>>;
  role: "admin" | "ops";
  step: number;
};

const Wizard = ({ isOpen, setShownWizard, role, step }: Props) => {
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
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Wizard;
