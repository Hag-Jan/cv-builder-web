"use client";

import React, { useState } from "react";

interface EditorLayoutProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
}

export function EditorLayout({ leftPanel, rightPanel }: EditorLayoutProps) {
    const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Left Column: Editor & Settings */}
            <aside className={`w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0 ${activeMobileTab === 'edit' ? 'block' : 'hidden lg:flex'}`}>
                {leftPanel}
            </aside>

            {/* Right Column: Preview Area */}
            <div className={`w-full lg:w-[55%] xl:w-[60%] bg-gray-100 dark:bg-slate-950 overflow-y-auto flex justify-center p-8 lg:p-12 relative pb-24 lg:pb-0 ${activeMobileTab === 'preview' ? 'block' : 'hidden lg:flex'}`}>
                {rightPanel}
            </div>

            {/* Mobile Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around p-3 z-50">
                <button
                    onClick={() => setActiveMobileTab('edit')}
                    className={`flex flex-col items-center gap-1 ${activeMobileTab === 'edit' ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    <span className="text-[10px] font-bold">Edit</span>
                </button>
                <button
                    onClick={() => setActiveMobileTab('preview')}
                    className={`flex flex-col items-center gap-1 ${activeMobileTab === 'preview' ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span className="text-[10px] font-bold">Preview</span>
                </button>
            </div>
        </div>
    );
}
