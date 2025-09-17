export interface InputWithIconsProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon: string;
  rightIcon?: string;
  inputClassName?: string;
}

export interface SelectWithIconProps {
  iconSrc: string;
  altText: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  aria_label:string;
  inputClassName?: string;
}

export interface MultiSelectProps {
  iconSrc: string;
  altText: string;
  placeholder: string;
  options: string[];
  value: string[];
  aria_label:string;
  inputClassName?: string;
  onChange: (selected: string[]) => void;
}

export interface SingleSelectDropdownProps {
  iconSrc: string;
  altText: string;
  placeholder: string;
  options: string[];
  value: string;
  aria_label: string;
  inputClassName?: string;
  onChange: (selected: string) => void;
}

export interface AutocompleteInputProps {
  iconSrc: string;
  altText: string;
  placeholder: string;
  options: string[];
  value: string[];
  aria_label: string;
  inputClassName?: string;
  onChange: (selected: string[]) => void;
}

