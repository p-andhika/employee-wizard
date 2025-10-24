import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useEmployees } from "@/hooks/useApi";
import type { Employee } from "@/types";

type Props = {
  openWizard: (selectedRole: "admin" | "ops") => void;
};

const EmployeeList = ({ openWizard }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: employees = [],
    error: employeesError,
    isLoading: isLoadingEmployees,
  } = useEmployees();

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = employees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
          <CardContent>
            {employeesError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load employees. Please make sure json-server is
                  running on ports 4001 and 4002.
                </AlertDescription>
              </Alert>
            )}

            {isLoadingEmployees ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading employees...
                </span>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first employee
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Photo
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Department
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Role
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.map((emp: Employee, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            <Avatar>
                              <AvatarImage src={emp.photo} alt={emp.fullName} />
                              <AvatarFallback>
                                {emp.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="p-4 align-middle font-medium">
                            {emp.fullName}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant="secondary">{emp.department}</Badge>
                          </td>
                          <td className="p-4 align-middle">{emp.role}</td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {emp.officeLocation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, employees.length)} of{" "}
                    {employees.length} employees
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeList;
