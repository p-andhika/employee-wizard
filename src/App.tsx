import { Button } from "@/components/ui/button";
import Autocomplete from "./components/custom/autocomplete";
import { useDepartments } from "./hooks/useApi";
import { useState } from "react";

function App() {
  const [basicInfo, setBasicInfo] = useState({
    department: "",
  });

  return (
    <>
      <Autocomplete
        displayKey="name"
        useQueryHook={useDepartments}
        value={basicInfo.department}
        onChange={(val) => setBasicInfo({ ...basicInfo, department: val })}
        placeholder="Search department..."
      />
    </>
  );
}

export default App;
