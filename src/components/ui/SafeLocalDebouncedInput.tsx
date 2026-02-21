"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Input } from "./Input";
import { Textarea as BaseTextarea } from "./Textarea";

interface SafeDebouncedProps {
    value: string;
    onChange: (value: string) => void;
    /**
     * @deprecated No longer used — onChange is called on every keystroke for
     * instant live-preview feedback. Autosave debouncing is handled by
     * AutosaveIndicator independently. Kept in the interface for API compat.
     */
    debounceTime?: number;
    label?: string;
    isInvalid?: boolean;
}

/**
 * SafeLocalDebouncedInput
 *
 * DESIGN INTENT
 * ─────────────
 * The input keeps a local `localValue` state so it always renders from its own
 * state (not from the global resume). This prevents:
 *   • The cursor jumping to the end on every keystroke (controlled-input footgun)
 *   • Component unmounting / focus loss caused by parent re-renders
 *
 * LIVE PREVIEW
 * ────────────
 * onChange is called on EVERY keystroke so the resume context and the live
 * preview always stay in sync. There is intentionally NO debounce here.
 * Autosave debouncing is handled by AutosaveIndicator (watches `lastUpdate`).
 *
 * EXTERNAL SYNC
 * ─────────────
 * When the same field is updated from outside (e.g., AI fill, template load),
 * we sync localValue only when the input is not focused to avoid overwriting
 * what the user is currently typing.
 */
export const SafeLocalDebouncedInput = forwardRef<
    HTMLInputElement,
    SafeDebouncedProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
>(({ value, onChange, debounceTime: _ignored, label = "unnamed", ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    // Sync external value changes only while the field is not focused.
    useEffect(() => {
        if (!isFocused && value !== localValue) {
            setLocalValue(value);
        }
    }, [value, isFocused]); // intentionally omit localValue — avoids sync loop

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        // Call immediately — no debounce. The preview updates on the next React flush.
        onChange(newValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    return (
        <Input
            {...props}
            ref={inputRef}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    );
});

SafeLocalDebouncedInput.displayName = "SafeLocalDebouncedInput";

/**
 * SafeLocalDebouncedTextarea
 *
 * Same contract as SafeLocalDebouncedInput — see above for design notes.
 */
export const SafeLocalDebouncedTextarea = forwardRef<
    HTMLTextAreaElement,
    SafeDebouncedProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">
>(({ value, onChange, debounceTime: _ignored, label = "unnamed", ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current!);

    useEffect(() => {
        if (!isFocused && value !== localValue) {
            setLocalValue(value);
        }
    }, [value, isFocused]); // intentionally omit localValue

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        // Call immediately — no debounce.
        onChange(newValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    return (
        <BaseTextarea
            {...props}
            ref={textareaRef}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    );
});

SafeLocalDebouncedTextarea.displayName = "SafeLocalDebouncedTextarea";
