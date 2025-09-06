import React, {useState, useRef, useEffect} from "react";
import { InputWithIconsProps, SelectWithIconProps,MultiSelectProps } from "@/interfaces/InputFilter";
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
        {/* El "input" que muestra las selecciones y abre el dropdown */}
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

        {/* La lista de opciones que se despliega */}
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