// components/InputFilter.tsx
import React, {useState, useRef, useEffect} from "react";
import { InputWithIconsProps, SelectWithIconProps,MultiSelectProps, SingleSelectDropdownProps, AutocompleteInputProps } from "@/interfaces/InputFilter";
import { DataFilterStyles } from "@/styles/DataFilterStyles";

export const InputWithIcons: React.FC<InputWithIconsProps> = ({
    placeholder,
    value,
    onChange,
    leftIcon,
    rightIcon,
    inputClassName = '',
}) => {
    return (
        <div className="relative w-full">
            <img
                src={leftIcon}
                alt=""
                className={DataFilterStyles.LeftFieldImage}
            />
            <input
                className={inputClassName}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {rightIcon && (
                <img
                src={rightIcon}
                alt=""
                className={DataFilterStyles.RightFieldImage}
                />
            )}
        </div>
    );
};

export const SelectWithIcon: React.FC<SelectWithIconProps> = ({
    iconSrc,
    altText,
    value,
    onChange,
    options,
    placeholder,
    aria_label,
    inputClassName = '',
}) => {
    return (
        <div className="relative w-full">
            <img
                src={iconSrc}
                alt={altText}
                className={`${DataFilterStyles.LeftFieldImage} ${inputClassName}  `}
            />
            <select
                aria-label={aria_label}
                className={`${DataFilterStyles.Dropdown} appearance-none  `}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
                ))}
            </select>
            <img
                src="/resources/Icons/Components_Cards/DropDown_Icon_Cards.png"
                alt="Chevron"
                className={`${DataFilterStyles.RightFieldImage} w-[1rem] h-[1rem]`}
            />
        </div>
    );
};

export const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
    iconSrc,
    altText,
    placeholder,
    options,
    value,
    aria_label,
    inputClassName,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const displayLimit = 1;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectOption = (option: string) => {
        let newSelection: string[];
        if (value.includes(option)) {
        newSelection = value.filter((item) => item !== option);
        } else {
        newSelection = [...value, option];
        }
        onChange(newSelection);
    };

    const handleRemoveOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        const newSelection = value.filter((item) => item !== option);
        onChange(newSelection);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
        <div
            className={`${DataFilterStyles.Dropdown} flex items-center gap-2 cursor-pointer h-auto text-brand-600 min-h-[2.75rem] py-2`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <img
                src={iconSrc}
                alt={altText}
                className={`${DataFilterStyles.LeftFieldImage} ${inputClassName}  `}
            />
            <div className="flex flex-wrap gap-1 flex-grow items-center">
                {value.length > 0 ? (
                    <>
                    {value.slice(0, displayLimit).map((item) => (
                        <span
                        key={item}
                        className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
                        >
                        {item}
                        <button
                            onClick={(e) => handleRemoveOption(e, item)}
                            className="ml-1 text-brand-400 hover:text-brand-800"
                        >
                            &times;
                        </button>
                        </span>
                    ))}

                    {value.length > displayLimit && (
                        <span className="ml-1 text-xs font-medium text-slate-500">
                        +{value.length - displayLimit} more
                        </span>
                    )}
                    </>
                ) : (
                    <span className="text-slate-400">{placeholder}</span>
                )}
            </div>
            <img
                src="/resources/Icons/Components_Cards/DropDown_Icon_Cards.png"
                alt="Chevron"
                className={`${DataFilterStyles.RightFieldImage} w-[1rem] h-[1rem]`}
            />
        </div>

        {isOpen && (
            <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-pop">
                {options.map((option) => (
                    <li
                        key={option}
                        className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        onClick={() => handleSelectOption(option)}
                    >
                    <input
                        aria-label={aria_label}
                        type="checkbox"
                        checked={value.includes(option)}
                        readOnly
                        className="mr-2 h-4 w-4 accent-brand-600"
                    />
                    {option}
                    </li>
                ))}
            </ul>
        )}
        </div>
    );
};

export const SelectDropdownWithIcon: React.FC<SingleSelectDropdownProps> = ({
    iconSrc,
    altText,
    placeholder,
    options,
    value,
    aria_label,
    inputClassName,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectOption = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleClearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
        <div
            className={`${DataFilterStyles.Dropdown} flex items-center gap-2 cursor-pointer h-auto text-brand-600 min-h-[2.75rem] py-2`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <img
                src={iconSrc}
                alt={altText}
                className={`${DataFilterStyles.LeftFieldImage} ${inputClassName}  `}
            />
            <div className="flex flex-wrap gap-1 flex-grow items-center">
                {value ? (
                    <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        {value}
                        <button
                            onClick={handleClearSelection}
                            className="ml-1 text-brand-400 hover:text-brand-800"
                        >
                            &times;
                        </button>
                    </span>
                ) : (
                    <span className="text-slate-400">{placeholder}</span>
                )}
            </div>
            <img
                src="/resources/Icons/Components_Cards/DropDown_Icon_Cards.png"
                alt="Chevron"
                className={`${DataFilterStyles.RightFieldImage} w-[1rem] h-[1rem]`}
            />
        </div>

        {isOpen && (
            <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-pop">
                {options.map((option) => (
                    <li
                        key={option}
                        className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        onClick={() => handleSelectOption(option)}
                    >
                    <input
                        aria-label={aria_label}
                        type="radio"
                        checked={value === option}
                        readOnly
                        className="mr-2 h-4 w-4 accent-brand-600"
                    />
                    {option}
                    </li>
                ))}
            </ul>
        )}
        </div>
    );
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    iconSrc,
    altText,
    placeholder,
    options,
    value,
    aria_label,
    inputClassName,
    onChange,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !value.includes(option)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        setIsOpen(newValue.length > 0);
    };

    const handleSelectOption = (option: string) => {
        const newSelection = [...value, option];
        onChange(newSelection);
        setSearchTerm("");
        setIsOpen(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleRemoveOption = (optionToRemove: string) => {
        const newSelection = value.filter(item => item !== optionToRemove);
        onChange(newSelection);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && searchTerm === '' && value.length > 0) {
            const newSelection = value.slice(0, -1);
            onChange(newSelection);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <img
                src={iconSrc}
                alt={altText}
                className={`${DataFilterStyles.LeftFieldImage} ${inputClassName}`}
            />

            <div className={`${DataFilterStyles.Input} relative`}>
                {value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                        {value.map((item) => (
                            <span
                                key={item}
                                className="flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
                            >
                                {item}
                                <button
                                    onClick={() => handleRemoveOption(item)}
                                    className="text-brand-400 hover:text-brand-800"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    aria-label={aria_label}
                />
            </div>

            <img
                src="/resources/Icons/search_icon.png"
                alt="Search"
                className={DataFilterStyles.RightFieldImage}
            />

            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-pop">
                    {filteredOptions.map((option) => (
                        <li
                            key={option}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                            onClick={() => handleSelectOption(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const SimpleDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
}> = ({
  value,
  onChange,
  options,
  placeholder,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className="field flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-pop">
          {options.map((option) => (
            <div
              key={option}
              className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};