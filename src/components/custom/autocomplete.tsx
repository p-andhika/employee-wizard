import { Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

type Option = {
  id: number;
  name: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  useQueryHook: (searchQuery: string) => {
    data: Array<Option> | undefined;
    isLoading: boolean;
    isFetching: boolean;
  };
  placeholder: string;
  displayKey: string;
  error?: boolean;
};

const Autocomplete = ({
  value,
  onChange,
  useQueryHook,
  placeholder,
  displayKey,
  error,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    data: options = [],
    isLoading,
    isFetching,
  } = useQueryHook(searchQuery);

  const handleInputChange = (val: string) => {
    onChange(val);
    setSearchQuery(val);

    if (val.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option[displayKey as keyof Option] as string);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e.target.value)
        }
        onFocus={() => value && setShowDropdown(true)}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
      />
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {isLoading || isFetching ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
              >
                {option[displayKey as keyof Option]}
              </div>
            ))
          ) : searchQuery ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
