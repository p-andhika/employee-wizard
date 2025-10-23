import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

type Props = {
  openWizard: (selectedRole: "admin" | "ops") => void;
};

const EmployeeList = ({ openWizard }: Props) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Employee List</CardTitle>
                  <CardDescription>
                    Manage your organization's employees
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openWizard("admin")}>
                  + Add (Admin)
                </Button>
                <Button onClick={() => openWizard("ops")} variant="secondary">
                  + Add (Ops)
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeList;
