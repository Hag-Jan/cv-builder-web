"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState, $getRoot } from "lexical";
import { useEffect } from "react";
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

// Plugin to sync initial value
function InitialValuePlugin({ value }: { value: string[] }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Only set if editor is empty? Or always? 
        // For simplicity in this skeleton, we assume initial load only.
        // Complex two-way binding with Lexical is tricky.
        // We'll skip forcing updates from props for now to avoid loops, 
        // reliant on the parent component key-ing the editor to reset it.
    }, []);

    return null;
}

// Plugin to extract text as string[] (one per paragraph)
function ExtractStatePlugin({ onChange }: { onChange: (val: string[]) => void }) {
    const [editor] = useLexicalComposerContext();

    return (
        <OnChangePlugin
            onChange={(editorState: EditorState) => {
                editorState.read(() => {
                    const root = $getRoot();
                    const children = root.getChildren();
                    const lines = children.map(child => child.getTextContent()).filter(Boolean);
                    onChange(lines);
                });
            }}
        />
    );
}

export function LexicalRichText({ initialValue = [], onChange, placeholder, className }: LexicalRichTextProps) {
    const initialConfig = {
        namespace: "ResumeEditor",
        theme,
        onError: (e: any) => console.error(e),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={clsx("relative border rounded p-2 min-h-[100px]", className)}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="outline-none h-full" />}
                    placeholder={<div className="absolute top-2 left-2 text-gray-400 pointer-events-none">{placeholder || "Enter text..."}</div>}
                    ErrorBoundary={(props) => <div>Error: {props.children}</div>}
                />
                <HistoryPlugin />
                <ExtractStatePlugin onChange={onChange} />
                {/* We would perform initial state setting here if needed, 
            but for Act 1 skeleton, we might just start empty or use a key to reset.
         */}
            </div>
        </LexicalComposer>
    );
}
