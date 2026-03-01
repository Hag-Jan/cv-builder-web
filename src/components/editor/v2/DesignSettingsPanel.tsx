"use client";

import React, { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { listTemplates } from "@/lib/pdf/templateEngine";

import { TemplatePicker } from "@/components/TemplatePicker";

// ─────────────────────────────────────────────
// Sub-panel: Section heading
// ─────────────────────────────────────────────
function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            {children}
        </div>
    );
}

// ─────────────────────────────────────────────
// Sub-panel: Slider control
// ─────────────────────────────────────────────
function SliderControl({ label, min, max, step = 1, value, unit, onChange }: {
    label: string; min: number; max: number; step?: number;
    value: number; unit: string; onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="uppercase">{label}</span>
                <span className="text-green-600 dark:text-green-400">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-green-600"
            />
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function DesignSettingsPanel() {
    const { resume, updateTemplate, updateDesign } = useResume();

    // UI-only state
    const [activeTab, setActiveTab] = useState<string>("Basics");
    const [colorTab, setColorTab] = useState<"basic" | "advanced" | "border">("basic");

    if (!resume) return null;

    // Derived State from Context (with defaults)
    const design = resume.design || {};
    const DEFAULT_ACCENT = "#16A34A";
    const DEFAULT_FONT = "Alegreya";

    const ACCENT = design.accentColor || DEFAULT_ACCENT;
    const DESIGN = design; // Use existing 'design' variable

    const nameColor = DESIGN.applyColorToName ? ACCENT : "#111827";
    const headingColor = DESIGN.applyColorToHeadings ? ACCENT : "#111827";
    const jobTitleColor = DESIGN.applyColorToJobTitles ? ACCENT : "#111827";

    const fontFamily = DESIGN.fontFamily || DEFAULT_FONT; // Renamed from FONT to fontFamily to match existing
    const ALIGN = DESIGN.headerAlign || 'left'; // Use 'left' as default as per original code

    const fontSize = design.fontSize ?? 10.5;
    const lineHeight = design.lineHeight ?? 1.4;
    const pageMargins = design.pageMargins ?? 24;
    const entrySpace = design.entrySpace ?? 12;

    const accentColor = design.accentColor ?? "#16A34A";

    const headingSize = design.headingSize ?? "L";
    const headingCase = design.headingCase ?? "upper";

    const headerAlign = design.headerAlign ?? "left";
    const skillsMode = design.skillsMode ?? "grid";

    const selectedFont = design.fontFamily ?? "Alegreya";
    const layoutCols = design.layoutCols ?? "1";

    const fonts = ["Lora", "Source Serif Pro", "Alegreya", "Inter", "Helvetica", "Georgia"];


    return (
        <div className="p-5 space-y-5 overflow-y-auto pb-20">
            {/* Sub-tab strip */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 overflow-x-auto gap-1">
                {["Basics", "Layout & Spacing", "Design", "Header", "Sections"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${activeTab === tab
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Basics" && (
                <>
                    {/* ── Language & Region ── */}
                    <PanelSection title="Language & Region">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                                <select
                                    value={design.language || "English (US)"}
                                    onChange={(e) => updateDesign({ language: e.target.value })}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-900 dark:text-slate-100"
                                >
                                    {["English (UK)", "English (US)", "French", "Spanish"].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Format</label>
                                <select
                                    value={design.dateFormat || "MMM YYYY"}
                                    onChange={(e) => updateDesign({ dateFormat: e.target.value })}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-900 dark:text-slate-100"
                                >
                                    {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "MMM YYYY"].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Format</label>
                                <select
                                    value={design.pageFormat || "A4"}
                                    onChange={(e) => updateDesign({ pageFormat: e.target.value as any })}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-900 dark:text-slate-100"
                                >
                                    {["A4", "Letter"].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                    </PanelSection>

                    {/* ── Template Selection ── */}
                    <div className="pt-2">
                        <TemplatePicker
                            selectedId={resume.templateId}
                            onSelect={(id) => updateTemplate(id as any)}
                        />
                    </div>
                </>
            )}

            {activeTab === "Layout & Spacing" && (
                <>
                    {/* ── Layout ── */}
                    <PanelSection title="Layout">
                        <div className="grid grid-cols-3 gap-2">
                            {(["1", "2", "mix"] as const).map((col) => (
                                <button
                                    key={col}
                                    onClick={() => updateDesign({ layoutCols: col })}
                                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${layoutCols === col
                                        ? "border-green-500 text-green-600 dark:text-green-400 bg-green-500/5"
                                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                        }`}
                                >
                                    {col === "1" ? "1-column" : col === "2" ? "2-column" : "Mix"}
                                </button>
                            ))}
                        </div>
                        <div className="h-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
                            <p className="text-slate-400 text-xs text-center">Drag and drop sections to reorder<br /><span className="font-semibold text-green-500">(coming soon)</span></p>
                        </div>
                    </PanelSection>

                    {/* ── Spacing ── */}
                    <PanelSection title="Spacing">
                        <SliderControl label="Font Size" min={8} max={14} step={0.5} value={fontSize} unit="pt" onChange={(v) => updateDesign({ fontSize: v })} />
                        <SliderControl label="Line Height" min={1} max={2} step={0.1} value={lineHeight} unit="" onChange={(v) => updateDesign({ lineHeight: v })} />
                        <SliderControl label="Page Margins" min={10} max={40} value={pageMargins} unit="mm" onChange={(v) => updateDesign({ pageMargins: v })} />
                        <SliderControl label="Entry Space" min={4} max={24} value={entrySpace} unit="px" onChange={(v) => updateDesign({ entrySpace: v })} />
                    </PanelSection>
                </>
            )}

            {activeTab === "Design" && (
                <>
                    {/* ── Colors ── */}
                    <PanelSection title="Colors">
                        <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                            {(["basic", "advanced", "border"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setColorTab(tab)}
                                    className={`text-sm font-bold capitalize pb-1 transition-colors ${colorTab === tab
                                        ? "text-green-600 border-b-2 border-green-500"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div
                                    className="w-8 h-8 rounded-full ring-2 ring-offset-2 cursor-pointer"
                                    style={{ backgroundColor: accentColor }}
                                />
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => updateDesign({ accentColor: e.target.value })}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Accent Color</span>
                            <span className="ml-auto text-xs font-mono text-slate-400">{accentColor.toUpperCase()}</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apply to:</p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { label: "Name", key: "applyColorToName" },
                                    { label: "Job title", key: "applyColorToJobTitles" },
                                    { label: "Headings", key: "applyColorToHeadings" },
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!(design as any)[item.key]}
                                            onChange={(e) => updateDesign({ [item.key]: e.target.checked })}
                                            className="rounded border-slate-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </PanelSection>

                    {/* ── Font ── */}
                    <PanelSection title="Font">
                        <div className="grid grid-cols-2 gap-2">
                            {fonts.map((font) => (
                                <button
                                    key={font}
                                    onClick={() => updateDesign({ fontFamily: font })}
                                    className={`px-4 py-2.5 border-2 rounded-lg text-sm text-left transition-all ${selectedFont === font
                                        ? "border-green-500 bg-green-500/5 text-green-700 dark:text-green-400 font-bold"
                                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                        }`}
                                    style={{ fontFamily: font }}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    </PanelSection>
                </>
            )}

            {activeTab === "Header" && (
                <>

                    {/* ── Personal Details Header ── */}
                    <PanelSection title="Personal Details">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Align</span>
                            <div className="flex gap-2">
                                {(["left", "center", "right"] as const).map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateDesign({ headerAlign: align })}
                                        className={`p-2 rounded border-2 transition-all ${headerAlign === align
                                            ? "border-green-500 text-green-600 bg-green-500/5"
                                            : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                                            }`}
                                        title={`Align ${align}`}
                                    >
                                        {align === "left" && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" /></svg>
                                        )}
                                        {align === "center" && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" /></svg>
                                        )}
                                        {align === "right" && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </PanelSection>
                </>
            )}

            {activeTab === "Sections" && (
                <>
                    {/* ── Section Headings ── */}
                    <PanelSection title="Section Headings">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Style</span>
                                <div className="flex gap-2">
                                    {(["L", "M", "S"] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => updateDesign({ headingSize: s })}
                                            className={`px-3 py-1 rounded text-sm font-bold border-2 transition-all ${headingSize === s
                                                ? "border-green-500 text-green-600 bg-green-500/5"
                                                : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Case</span>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1">
                                    {(["upper", "normal"] as const).map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => updateDesign({ headingCase: c })}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${headingCase === c
                                                ? "bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400"
                                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                                }`}
                                        >
                                            {c === "upper" ? "UPPERCASE" : "Normal"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PanelSection>

                    {/* ── Skills, Languages, Interests Display Mode ── */}
                    <PanelSection title="Skills, Languages, Interests">
                        <div className="grid grid-cols-2 gap-2">
                            {(["grid", "level", "compact", "bubble"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => updateDesign({ skillsMode: mode })}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 capitalize transition-all ${skillsMode === mode
                                        ? "border-green-500 bg-green-500/5 text-green-700 dark:text-green-400"
                                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </PanelSection>
                </>
            )}

            {/* ── Feedback ── */}
            <div className="pt-2 space-y-3">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Any feedback or missing feature?</p>
                <textarea
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-green-500 focus:outline-none min-h-[80px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    placeholder="Tell us what you'd like to see..."
                />
                <button className="w-full py-3 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-95">
                    Send Feedback
                </button>
            </div>
        </div>
    );
}
