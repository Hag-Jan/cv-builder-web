"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import { useResume } from "@/contexts/ResumeContext";
import dynamic from "next/dynamic";

import SectionNav from "@/components/editor/SectionNav";
import EditorShell from "@/components/editor/EditorShell";

import { ContactEditor } from "@/components/editor/sections/ContactEditor";
import { ExperienceEditor } from "@/components/editor/sections/ExperienceEditor";
import { EducationEditor } from "@/components/editor/sections/EducationEditor";
import { SkillsEditor } from "@/components/editor/sections/SkillsEditor";
import { ProjectsEditor } from "@/components/editor/sections/ProjectsEditor";
import { SummaryEditor } from "@/components/editor/sections/SummaryEditor";
import { ATSCheckerSidebar } from "@/components/ats/ATSCheckerSidebar";
import ResumePreview from "@/components/ResumePreview";

const ExportPdfButton = dynamic(() => import("@/components/ExportPdfButton"), {
  ssr: false,
  loading: () => <button className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded text-[10px] font-bold uppercase" disabled>Loading...</button>
});

const TemplateSelect = dynamic(() => import("@/components/TemplateSelect"), {
  ssr: false,
  loading: () => <div className="h-10 w-48 bg-gray-50 rounded animate-pulse" />
});

export default function EditorPage() {
  const { resume, loading } = useResume();
  const [activeSectionId, setActiveSectionId] = useState<string | null>("contact");
  const [isATSSidebarOpen, setIsATSSidebarOpen] = useState(false);

  const renderSectionEditor = React.useMemo(() => {
    if (loading || !resume) return null;

    const section = resume.sections.find((s) => s.id === activeSectionId);
    if (!section) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Select a section from the left to start editing</p>
        </div>
      );
    }

    // Explicitly check for 'summary' to help TypeScript if needed
    if (section.type === "summary") {
      return <SummaryEditor section={section as any} />;
    }

    switch (section.type) {
      case "contact":
        return <ContactEditor section={section as any} />;
      case "experience":
        return <ExperienceEditor section={section as any} />;
      case "education":
        return <EducationEditor section={section as any} />;
      case "skills":
        return <SkillsEditor section={section as any} />;
      case "projects":
        return <ProjectsEditor section={section as any} />;
      default:
        return <div className="p-12 text-center text-gray-400 italic">Unknown section type: {section.type}</div>;
    }
  }, [resume, activeSectionId, loading]);

  if (loading || !resume) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hydrating Resume...</p>
        </div>
      </div>
    );
  }

  // Build nav items from resume sections
  const navItems = resume.sections.map((s) => ({
    id: s.id,
    type: s.type as any,
    label: s.type === "custom" ? (s as any).title || "Custom" : s.type,
  }));


  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top bar */}
      <TopBar />

      {/* Toolbar row - Compact and modern */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <TemplateSelect />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsATSSidebarOpen(true)}
            className="group flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all shadow-sm hover:shadow-md active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <span className="relative">
              Optimize for Job
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
            </span>
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1" />
          <ExportPdfButton resume={resume} />
        </div>
      </div>

      {/* Main 3-zone layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Zone 1: Section icon nav (~64px) - Dark slate theme for contrast */}
        <div className="w-16 bg-slate-900 border-r border-slate-800">
          <SectionNav
            sections={navItems}
            activeSectionId={activeSectionId}
            onSelect={setActiveSectionId}
          />
        </div>

        {/* Zone 2: Editor pane (~38%) */}
        <div className="w-[38%] border-r border-gray-100 bg-white overflow-hidden flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
          <EditorShell>
            <div className="p-8 h-full">
              {renderSectionEditor}
            </div>
          </EditorShell>
        </div>

        {/* Zone 3: Live resume preview (remaining space) */}
        <div className="flex-1 bg-gray-50/50 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            <ResumePreview resume={resume as any} />
          </div>
        </div>
      </div>

      {/* ATS Checker Sidebar (Sliding Overlay) */}
      {isATSSidebarOpen && (
        <ATSCheckerSidebar
          resume={resume}
          onClose={() => setIsATSSidebarOpen(false)}
        />
      )}
    </div>
  );
}
