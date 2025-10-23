type Props = {
  value: string;
  onChange: (value: string) => void;
  onFetch: (query: string) => Promise<any[]>;
  placeholder: string;
  displayKey: string;
  error?: boolean;
};

const Autocomplete = ({
  value,
  onChange,
  onFetch,
  placeholder,
  displayKey,
  error,
}: Props) => {
  
};
