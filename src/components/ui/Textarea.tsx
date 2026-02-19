import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    isInvalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, isInvalid, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    "dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400/20",
                    isInvalid && "border-red-300 ring-1 ring-red-100 dark:border-red-500/50 dark:ring-red-500/20",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
