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
function ExtractStatePlugin({ onChange }: { onChange: (val: string[]) => void }) {
    return (
        <OnChangePlugin
            onChange={(editorState: EditorState) => {
                editorState.read(() => {
                    const root = $getRoot();
                    const children = root.getChildren();
                    const lines = children
                        .map((child) => child.getTextContent())
                        .filter(Boolean);
                    onChange(lines);
                });
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
            <div className={clsx("relative border rounded p-2 min-h-[100px]", className)}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="outline-none h-full" />}
                    placeholder={
                        <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
                            {placeholder || "Enter text..."}
                        </div>
                    }
                    ErrorBoundary={(props) => <div>Error: {props.children}</div>}
                />
                <HistoryPlugin />
                <ExtractStatePlugin onChange={onChange} />
                <SynchronizationPlugin value={initialValue} />
            </div>
        </LexicalComposer>
    );
}
