import Autocomplete from "./components/custom/autocomplete";
import ImageUpload from "./components/custom/image-upload";
import { useDepartments } from "./hooks/useApi";
import { useState } from "react";

function App() {
  const [basicInfo, setBasicInfo] = useState({
    department: "",
  });

  const [details, setDetails] = useState({
    photo: "",
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

      <ImageUpload
        value={details.photo}
        onChange={(val) => setDetails({ ...details, photo: val })}
      />
    </>
  );
}

export default App;
