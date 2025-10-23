import { Camera, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (base64: string) => void;
};

const ImageUpload = ({ value, onChange }: Props) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-background">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center">
          <Camera className="mx-auto h-10 w-10 text-muted-foreground" />
          <span className="mt-2 block text-sm text-muted-foreground">
            Click to upload photo
          </span>
        </div>
      </label>
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
