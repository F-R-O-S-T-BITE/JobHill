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