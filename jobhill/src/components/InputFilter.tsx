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
                alt="left icon"
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
                alt="right icon"
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
            className={`${DataFilterStyles.Dropdown} flex items-center gap-2 cursor-pointer h-auto text-[#0353A4] min-h-[3rem] p-2`}
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
                        className="text-md text-[#0353A4]"
                        >
                        {item}
                        <button
                            onClick={(e) => handleRemoveOption(e, item)}
                            className="ml-2 text-[#0353A4] hover:text-blue-900"
                        >
                            &times;
                        </button>
                        </span>
                    ))}

                    {value.length > displayLimit && (
                        <span className="text-md text-[#0353A4] font-medium ml-1">
                        y {value.length - displayLimit} más...
                        </span>
                    )}
                    </>
                ) : (
                    <span className={''}>{placeholder}</span>
                )}
            </div>
            <img
                src="/resources/Icons/Components_Cards/DropDown_Icon_Cards.png"
                alt="Chevron"
                className={`${DataFilterStyles.RightFieldImage} w-[1rem] h-[1rem]`}
            />
        </div>

        {isOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                    <li
                        key={option}
                        className="px-4 py-2 text-[#0353A4] hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectOption(option)}
                    >
                    <input
                        aria-label={aria_label}
                        type="checkbox"
                        checked={value.includes(option)}
                        readOnly
                        className="mr-2"
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
            className={`${DataFilterStyles.Dropdown} flex items-center gap-2 cursor-pointer h-auto text-[#0353A4] min-h-[3rem] p-2`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <img
                src={iconSrc}
                alt={altText}
                className={`${DataFilterStyles.LeftFieldImage} ${inputClassName}  `}
            />
            <div className="flex flex-wrap gap-1 flex-grow items-center">
                {value ? (
                    <span className="text-md text-[#0353A4]">
                        {value}
                        <button
                            onClick={handleClearSelection}
                            className="ml-2 text-[#0353A4] hover:text-blue-900"
                        >
                            &times;
                        </button>
                    </span>
                ) : (
                    <span className={''}>{placeholder}</span>
                )}
            </div>
            <img
                src="/resources/Icons/Components_Cards/DropDown_Icon_Cards.png"
                alt="Chevron"
                className={`${DataFilterStyles.RightFieldImage} w-[1rem] h-[1rem]`}
            />
        </div>

        {isOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                    <li
                        key={option}
                        className="px-4 py-2 text-[#0353A4] hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectOption(option)}
                    >
                    <input
                        aria-label={aria_label}
                        type="radio"
                        checked={value === option}
                        readOnly
                        className="mr-2"
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
                                className="bg-blue-100 text-[#0353A4] px-2 py-1 rounded text-xs flex items-center gap-1"
                            >
                                {item}
                                <button
                                    onClick={() => handleRemoveOption(item)}
                                    className="text-[#0353A4] hover:text-blue-900"
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
                    className="w-full outline-none bg-transparent text-[#0353A4]"
                    aria-label={aria_label}
                />
            </div>

            <img
                src="/resources/Icons/search_icon.png"
                alt="Search"
                className={DataFilterStyles.RightFieldImage}
            />

            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map((option) => (
                        <li
                            key={option}
                            className="px-4 py-2 text-[#0353A4] hover:bg-gray-100 cursor-pointer"
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
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-900"
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