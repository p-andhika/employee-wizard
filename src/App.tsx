// import Autocomplete from "./components/custom/autocomplete";
// import ImageUpload from "./components/custom/image-upload";
// import { useDepartments } from "./hooks/useApi";
import { useState } from "react";
import EmployeeList from "./components/custom/employee-list";
import Wizard from "./components/custom/wizard";

function App() {
  // const [basicInfo, setBasicInfo] = useState({
  //   department: "",
  // });
  //
  // const [details, setDetails] = useState({
  //   photo: "",
  // });

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
        isOpen={showWizard}
        setShownWizard={setShownWizard}
        role={role}
        step={step}
      />
    </>
  );
}

export default App;
