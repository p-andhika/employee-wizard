import { Toaster } from "sonner";
import { useState } from "react";
import EmployeeList from "./components/custom/employee-list";
import Wizard from "./components/custom/wizard";

function App() {
  const [showWizard, setShownWizard] = useState(false);
  const [role, setRole] = useState<"admin" | "ops">("admin");
  const [step, setStep] = useState(1);

  const openWizard = (selectedRole: "admin" | "ops") => {
    setRole(selectedRole);
    setStep(selectedRole === "ops" ? 2 : 1);
    setShownWizard(true);
  };

  return (
    <>
      <EmployeeList openWizard={openWizard} />

      <Wizard
        setShownWizard={setShownWizard}
        setStep={setStep}
        isOpen={showWizard}
        role={role}
        step={step}
      />

      <Toaster richColors expand />
    </>
  );
}

export default App;
