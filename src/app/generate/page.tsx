"use client";

import { useState, useCallback } from "react";
import { generateResumeExample } from "@/lib/ai/actions";
import { ResumeV2 } from "@/types/resume-schema-v2";
import Link from "next/link";

// ─── Predefined role suggestions ───────────────────────────────────────────
const ROLE_SUGGESTIONS = [
    "VP of Engineering",
    "Senior Product Manager",
    "Chief Marketing Officer",
    "Staff Software Engineer",
    "Head of Sales",
    "Senior Data Scientist",
    "Director of Finance",
    "UX Design Lead",
    "DevOps Engineer",
    "Chief of Staff",
];

// ─── Section preview helpers ─────────────────────────────────────────────────
function SectionBadge({ label }: { label: string }) {
    return (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
            {label}
        </span>
    );
}

function MetricHighlight({ text }: { text: string }) {
    // Highlight numbers and percentages inside bullet text
    const parts = text.split(/(\d[\d,]*%?|\$[\d,]+[KMB]?|\d+x|\d+\+)/g);
    return (
        <span>
            {parts.map((part, i) =>
                /(\d[\d,]*%?|\$[\d,]+[KMB]?|\d+x|\d+\+)/.test(part) ? (
                    <strong key={i} className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {part}
                    </strong>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

function ResumePreviewPanel({ resume }: { resume: ResumeV2 }) {
    const contact = resume.sections.find((s) => s.type === "contact") as any;
    const summary = resume.sections.find((s) => s.type === "summary") as any;
    const experience = resume.sections.find((s) => s.type === "experience") as any;
    const skills = resume.sections.find((s) => s.type === "skills") as any;
    const education = resume.sections.find((s) => s.type === "education") as any;

    return (
        <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {/* HEADER */}
            {contact && (
                <div>
                    <SectionBadge label="Header" />
                    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 space-x-2">
                            <span>{contact.email}</span>
                            {contact.phone && <span>· {contact.phone}</span>}
                            {contact.location && <span>· {contact.location}</span>}
                            {contact.linkedin && <span>· {contact.linkedin}</span>}
                        </p>
                    </div>
                </div>
            )}

            {/* SUMMARY */}
            {summary && (
                <div>
                    <SectionBadge label="Summary" />
                    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="italic text-gray-600 dark:text-gray-300">{summary.content}</p>
                    </div>
                </div>
            )}

            {/* EXPERIENCE */}
            {experience?.items?.length > 0 && (
                <div>
                    <SectionBadge label="Experience" />
                    <div className="mt-3 space-y-4">
                        {experience.items.map((item: any) => (
                            <div
                                key={item.id}
                                className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{item.role}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.company}{item.location ? ` · ${item.location}` : ""}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {item.startDate} – {item.endDate ?? "Present"}
                                    </span>
                                </div>
                                <ul className="mt-3 space-y-1.5">
                                    {item.bullets?.map((b: string, i: number) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                            <MetricHighlight text={b} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SKILLS */}
            {skills?.categories?.length > 0 && (
                <div>
                    <SectionBadge label="Skills" />
                    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {skills.categories.map((cat: any) => (
                                <div key={cat.id}>
                                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                        {cat.label}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.skills.map((sk: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                                            >
                                                {sk}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EDUCATION */}
            {education?.items?.length > 0 && (
                <div>
                    <SectionBadge label="Education" />
                    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                        {education.items.map((edu: any) => (
                            <div key={edu.id}>
                                <p className="font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {edu.school}{edu.date ? ` · ${edu.date}` : ""}
                                </p>
                                {edu.honors && (
                                    <p className="text-xs text-gray-400 mt-0.5 italic">{edu.honors}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GenerateExamplePage() {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ResumeV2 | null>(null);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<"preview" | "json">("preview");

    const handleGenerate = useCallback(async () => {
        const trimmed = role.trim();
        if (!trimmed) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setCopied(false);

        try {
            const resume = await generateResumeExample(trimmed);
            setResult(resume);
            setView("preview");
        } catch (err: any) {
            setError(err.message || "Generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [role]);

    const handleCopy = useCallback(async () => {
        if (!result) return;
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }, [result]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) handleGenerate();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
            {/* ── Nav ─────────────────────────────────────────────────── */}
            <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
                        <span className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">R</span>
                        ResumeATS
                    </Link>
                    <Link
                        href="/editor"
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                    >
                        Open Editor →
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
                {/* ── Hero heading ───────────────────────────────────── */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AI-Powered · ATS-Optimized · Executive-Grade
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                        Role-Based Resume{" "}
                        <span className="text-emerald-600 dark:text-emerald-400">Example Generator</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base">
                        Enter any job title and get a complete, ATS-ready resume with measurable impact bullets, executive tone, and strict JSON schema output.
                    </p>
                </div>

                {/* ── Input card ─────────────────────────────────────── */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Job Role / Target Position
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="role-input"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. VP of Engineering, Senior Product Manager, Head of Sales…"
                                maxLength={120}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all disabled:opacity-50"
                            />
                            <button
                                id="generate-btn"
                                onClick={handleGenerate}
                                disabled={loading || !role.trim()}
                                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <span>✦</span> Generate
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Role suggestion chips */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {ROLE_SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setRole(s)}
                                    disabled={loading}
                                    className="px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all disabled:opacity-40"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Loading state ─────────────────────────────── */}
                    {loading && (
                        <div className="border-t border-gray-100 dark:border-gray-800 px-8 py-8 flex flex-col items-center gap-3 text-center">
                            <div className="relative h-12 w-12">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Crafting executive-level resume for <strong className="text-gray-700 dark:text-gray-200">"{role}"</strong>…
                            </p>
                            <p className="text-xs text-gray-400">Applying measurable impact bullets, ATS keywords, and strict schema.</p>
                        </div>
                    )}

                    {/* ── Error state ───────────────────────────────── */}
                    {error && !loading && (
                        <div className="border-t border-red-100 dark:border-red-900/30 px-6 py-4 bg-red-50 dark:bg-red-950/20">
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <span>⚠</span> {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Result panel ───────────────────────────────────── */}
                {result && !loading && (
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
                        {/* Result toolbar */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    {(result.sections.find((s: any) => s.type === "contact") as any)?.name ?? "Resume"} · {role}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* View toggle */}
                                <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
                                    <button
                                        onClick={() => setView("preview")}
                                        className={`px-3 py-1.5 font-medium transition-colors ${view === "preview" ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => setView("json")}
                                        className={`px-3 py-1.5 font-medium transition-colors ${view === "json" ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                    >
                                        JSON
                                    </button>
                                </div>
                                {/* Copy */}
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                                >
                                    {copied ? "✓ Copied!" : "⎘ Copy JSON"}
                                </button>
                                {/* Load into editor */}
                                <button
                                    onClick={() => {
                                        // Store in sessionStorage so the editor can pick it up
                                        sessionStorage.setItem("generated_resume_example", JSON.stringify(result));
                                        window.location.href = "/editor?load=generated_resume_example";
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-sm"
                                >
                                    Open in Editor →
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8">
                            {view === "preview" ? (
                                <ResumePreviewPanel resume={result} />
                            ) : (
                                <pre className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 overflow-auto max-h-[640px] leading-relaxed border border-gray-200 dark:border-gray-700">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            )}
                        </div>

                        {/* Footer CTA */}
                        <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-xs text-gray-400">
                                ✦ Schema: <code className="font-mono">ResumeV2 · schemaVersion 2.0</code> · ATS-safe · No graphics · No tables
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                ↺ Regenerate
                            </button>
                        </div>
                    </div>
                )}

                {/* ── How it works ───────────────────────────────────── */}
                {!result && !loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                icon: "⌨",
                                title: "Enter Any Role",
                                desc: "Type any job title — from IC to C-suite. The generator adapts vocabulary, seniority, and domain automatically.",
                            },
                            {
                                icon: "✦",
                                title: "AI Crafts the Resume",
                                desc: "Gemini generates measurable impact bullets, executive summaries, categorized skills, and realistic career timelines.",
                            },
                            {
                                icon: "{}",
                                title: "Strict JSON Output",
                                desc: "Returns a validated ResumeV2 schema object — ready to copy, paste, or load directly into the ResumeATS editor.",
                            },
                        ].map(({ icon, title, desc }) => (
                            <div
                                key={title}
                                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-2 shadow-sm"
                            >
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-lg text-emerald-600 dark:text-emerald-400">
                                    {icon}
                                </div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
