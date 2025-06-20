import React from "react";
import { InputWithIconsProps, SelectWithIconProps } from "@/interfaces/InputFilter";
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

