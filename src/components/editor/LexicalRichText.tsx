"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState, $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect, useRef } from "react";
import clsx from "clsx";

const theme = {
    paragraph: "mb-1",
};

interface LexicalRichTextProps {
    initialValue?: string[]; // Treat as paragraphs/bullets
    onChange: (bullets: string[]) => void;
    placeholder?: string;
    className?: string;
}

// Plugin to sync value from props to editor
function SynchronizationPlugin({ value }: { value: string[] }) {
    const [editor] = useLexicalComposerContext();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }

        // CRITICAL PERFORMANCE GUARD:
        // Do not update the editor state if the editor is currently focused.
        // This prevents "input blocking" and cursor jumps caused by the 
        // synchronization loop during active typing.
        if (editor.getRootElement() === document.activeElement) {
            return;
        }

        console.log("[Lexical Sync] Updating with value:", value);

        editor.update(() => {
            const root = $getRoot();
            const children = root.getChildren();
            const currentLines = children.map((child) => child.getTextContent());

            const isMatch =
                currentLines.length === value.length &&
                currentLines.every((line, i) => line === value[i]);

            if (isMatch) return;

            root.clear();
            value.forEach((line) => {
                const p = $createParagraphNode();
                p.append($createTextNode(line));
                root.append(p);
            });
        });
    }, [value, editor]);

    return null;
}

// Plugin to extract text as string[] (one per paragraph)
function ExtractStatePlugin({ onChange, debounceTime = 800 }: { onChange: (val: string[]) => void, debounceTime?: number }) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (
        <OnChangePlugin
            onChange={(editorState: EditorState) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                timeoutRef.current = setTimeout(() => {
                    editorState.read(() => {
                        const root = $getRoot();
                        const children = root.getChildren();
                        const lines = children
                            .map((child) => child.getTextContent())
                            .filter(Boolean);
                        onChange(lines);
                    });
                }, debounceTime);
            }}
        />
    );
}

export function LexicalRichText({
    initialValue = [],
    onChange,
    placeholder,
    className,
}: LexicalRichTextProps) {
    const initialConfig = {
        namespace: "ResumeEditor",
        theme,
        onError: (e: any) => console.error(e),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={clsx("relative border border-gray-200 dark:border-gray-800 rounded p-2 min-h-[100px] bg-white dark:bg-gray-800/50", className)}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="outline-none h-full" />}
                    placeholder={
                        <div className="absolute top-2 left-2 text-gray-400 dark:text-gray-500 pointer-events-none">
                            {placeholder || "Enter text..."}
                        </div>
                    }
                    ErrorBoundary={(props) => <div>Error: {props.children}</div>}
                />
                <HistoryPlugin />
                <ExtractStatePlugin onChange={onChange} debounceTime={1500} />
                <SynchronizationPlugin value={initialValue} />
            </div>
        </LexicalComposer>
    );
}
