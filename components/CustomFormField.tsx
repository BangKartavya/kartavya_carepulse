"use client";

import React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Control} from "react-hook-form";
import {FormFieldType} from "@/components/forms/PatientForm";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {E164Number} from "libphonenumber-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({field, props}: { field: any, props: CustomProps }) => {
    const {fieldType, iconAlt, iconSrc, placeholder, showTimeSelect, dateFormat, renderSkeleton, name, label} = props;

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt || "icon"}
                            height={24}
                            width={24}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="IN"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        alt="calendar"
                        width={24}
                        height={24}
                        className="ml-2"
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? "MM/dd/YYYY"}
                            showTimeSelect={showTimeSelect ?? false}
                            showYearDropdown
                            timeInputLabel="Time:"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field) : null
            );
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">

                                <SelectValue placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea placeholder={placeholder} {...field} className="shad-textArea">

                    </Textarea>
                </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
                <div className="flex items-center gap-4">
                    <Checkbox
                        id={name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <Label htmlFor={name} className="checkbox-label">
                        {label}
                    </Label>
                </div>
            )
        default:
            break;
    }
};

const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, name, label, placeholder} = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}

                    <RenderField field={field} props={props}/>
                    <FormMessage className="shad-error"/>
                </FormItem>
            )}
        />
    );
};

export default CustomFormField;