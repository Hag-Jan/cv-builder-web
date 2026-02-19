import React from 'react';
import { Sparkles, Check, X, Loader2, RotateCcw } from 'lucide-react';

interface AIBulletChoicesProps {
    suggestions: string[];
    onSelect: (selectedText: string) => void;
    onClose: () => void;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

/**
 * AIBulletChoices
 * 
 * Displays 3 AI-optimized bullet suggestions for the user to choose from.
 * Each suggestion is displayed as a card with a selection button.
 */
export default function AIBulletChoices({
    suggestions,
    onSelect,
    onClose,
    onRegenerate,
    isRegenerating = false
}: AIBulletChoicesProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles className="w-5 h-5" />
                        <h2 className="text-lg font-bold">AI Bullet Suggestions</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-gray-500 font-medium">
                        Select the version that best fits your experience. All suggestions use the STAR method for maximum impact.
                    </p>

                    <div className="grid gap-4">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => onSelect(suggestion)}
                                className="group relative p-4 text-left border-2 border-gray-100 hover:border-blue-500 rounded-xl transition-all hover:bg-blue-50/50 hover:shadow-md active:scale-[0.99]"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                                            Suggestion {index + 1}
                                        </div>
                                        <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                            {suggestion}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-blue-600 text-white p-1.5 rounded-full">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                    <button
                        onClick={onRegenerate}
                        disabled={isRegenerating || !onRegenerate}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                        {isRegenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RotateCcw className="w-4 h-4" />
                        )}
                        <span>Try again</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
