"use client";

import React, { useState } from "react";

type Tab = "content" | "design" | "ai";

interface EditorTabAreaProps {
    contentPanel: React.ReactNode;
    designPanel?: React.ReactNode;
    aiPanel?: React.ReactNode;
    onLastSavedClick?: () => void;
}

export function EditorTabArea({ contentPanel, designPanel, aiPanel, onLastSavedClick }: EditorTabAreaProps) {
    const [activeTab, setActiveTab] = useState<Tab>("content");

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 px-4 pt-4 gap-6 text-sm font-medium shrink-0">
                <button
                    onClick={() => setActiveTab("content")}
                    className={`pb-3 border-b-2 transition ${activeTab === "content" ? "border-green-500 text-green-500" : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                    Content
                </button>
                <button
                    onClick={() => setActiveTab("design")}
                    className={`pb-3 border-b-2 transition ${activeTab === "design" ? "border-green-500 text-green-500" : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                    Design
                </button>
                <button
                    onClick={() => setActiveTab("ai")}
                    className={`pb-3 border-b-2 transition ${activeTab === "ai" ? "border-green-500 text-green-500" : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                    AI Assistant
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
                {activeTab === "content" && contentPanel}
                {activeTab === "design" && designPanel}
                {activeTab === "ai" && aiPanel}
            </div>

            {/* Footer / Status Bar */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 shrink-0">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                    <span>Last saved: Just now</span>
                    <button onClick={onLastSavedClick} className="text-green-500 hover:underline">History</button>
                </div>
            </div>
        </div>
    );
}
