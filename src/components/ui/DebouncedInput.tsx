"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, InputProps } from "./Input";
import { Textarea, TextareaProps } from "./Textarea";

interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    debounceTime?: number;
}

export const DebouncedInput = React.forwardRef<HTMLInputElement, DebouncedInputProps>(
    ({ value, onChange, debounceTime = 500, ...props }, ref) => {
        const [localValue, setLocalValue] = useState(value);
        const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

        // Sync local value when external value changes (e.g. on load or AI generate)
        // But only if we're not currently typing to avoid "jumping"
        useEffect(() => {
            if (document.activeElement !== (ref as any)?.current && value !== localValue) {
                setLocalValue(value);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalValue(newValue);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceTime);
        };

        // Ensure change is flushed on blur
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                onChange(localValue);
            }
            props.onBlur?.(e);
        };

        return (
            <Input
                {...props}
                ref={ref}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        );
    }
);
DebouncedInput.displayName = "DebouncedInput";

interface DebouncedTextareaProps extends Omit<TextareaProps, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    debounceTime?: number;
}

export const DebouncedTextarea = React.forwardRef<HTMLTextAreaElement, DebouncedTextareaProps>(
    ({ value, onChange, debounceTime = 500, ...props }, ref) => {
        const [localValue, setLocalValue] = useState(value);
        const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

        useEffect(() => {
            if (document.activeElement !== (ref as any)?.current && value !== localValue) {
                setLocalValue(value);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            setLocalValue(newValue);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceTime);
        };

        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                onChange(localValue);
            }
            props.onBlur?.(e);
        };

        return (
            <Textarea
                {...props}
                ref={ref}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        );
    }
);
DebouncedTextarea.displayName = "DebouncedTextarea";
