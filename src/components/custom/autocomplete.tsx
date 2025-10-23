import { Loader2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

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
  const [inputValue, setInputValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    data: options = [],
    isLoading,
    isFetching,
  } = useQueryHook(searchQuery);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);

    if (val.length > 0) {
      setShowDropdown(true);
      debouncedSearch(val);
    } else {
      setShowDropdown(false);
      debouncedSearch.cancel();
      setSearchQuery("");
    }
  };

  const handleSelect = (option: Option) => {
    const selectedValue = option[displayKey as keyof Option] as string;
    setInputValue(selectedValue);
    onChange(selectedValue);
    setShowDropdown(false);
    setSearchQuery("");
    debouncedSearch.cancel();
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e.target.value)
        }
        onFocus={() => inputValue && setShowDropdown(true)}
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
