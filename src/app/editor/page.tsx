"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useResume } from "@/contexts/ResumeContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// V2 Components
import { EditorHeader } from "@/components/editor/v2/EditorHeader";
import { EditorLayout } from "@/components/editor/v2/EditorLayout";
import { EditorTabArea } from "@/components/editor/v2/EditorTabArea";
import { ContentAccordion } from "@/components/editor/v2/ContentAccordion";
import { DesignSettingsPanel } from "@/components/editor/v2/DesignSettingsPanel";
import { AddSectionModal } from "@/components/editor/v2/AddSectionModal";
import AutosaveIndicator from "@/components/editor/AutosaveIndicator";

// Existing Form Editors
import { ContactEditor } from "@/components/editor/sections/ContactEditor";
import { ExperienceEditor } from "@/components/editor/sections/ExperienceEditor";
import { EducationEditor } from "@/components/editor/sections/EducationEditor";
import { SkillsEditor } from "@/components/editor/sections/SkillsEditor";
import { ProjectsEditor } from "@/components/editor/sections/ProjectsEditor";
import { SummaryEditor } from "@/components/editor/sections/SummaryEditor";
import { CustomSectionEditor } from "@/components/editor/sections/CustomSectionEditor";

import { ATSCheckerSidebar } from "@/components/ats/ATSCheckerSidebar";
import ResumePreview from "@/components/ResumePreview";

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent" />
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const { resume, loading, updateTemplate, loadResume } = useResume();
  const [isATSSidebarOpen, setIsATSSidebarOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const loadParam = searchParams.get("load");

  // Handle template selection from URL
  useEffect(() => {
    if (templateParam && !loading && resume && resume.templateId !== templateParam) {
      updateTemplate(templateParam as any);
    }
  }, [templateParam, loading, resume, updateTemplate]);

  // Handle loading a generated resume example from the generator page.
  // The generator stores the JSON in sessionStorage and passes the key via ?load=
  useEffect(() => {
    if (!loadParam || loading) return;
    try {
      const raw = sessionStorage.getItem(loadParam);
      if (!raw) return;
      const incoming = JSON.parse(raw);
      if (incoming?.schemaVersion === "2.0" && Array.isArray(incoming.sections)) {
        loadResume(incoming);
        sessionStorage.removeItem(loadParam); // clean up after use
        // Strip the query param from the URL without a page reload
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (e) {
      console.warn("[Editor] Failed to load generated resume from sessionStorage:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadParam, loading]);

  if (loading || !resume) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hydrating Resume...</p>
        </div>
      </div>
    );
  }

  // Map resume sections to specific editor components and icons
  const renderSectionEditor = (section: any) => {
    if (section.type === "summary") return <SummaryEditor section={section} />;
    switch (section.type) {
      case "contact": return <ContactEditor section={section} />;
      case "experience": return <ExperienceEditor section={section} />;
      case "education": return <EducationEditor section={section} />;
      case "skills": return <SkillsEditor section={section} />;
      case "projects": return <ProjectsEditor section={section} />;
      case "custom": return <CustomSectionEditor section={section} />;
      default: return <div className="p-4 text-center text-gray-400 italic">Unknown section type: {section.type}</div>;
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "contact": return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      case "summary": return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
      case "experience": return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case "education": return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;
      case "skills": return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      default: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    }
  };

  const getSectionTitle = (section: any) => {
    if (section.type === "contact") return "Personal Details";
    return section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1);
  };

  const contentPanel = (
    <div className="flex flex-col gap-4 pb-20">
      {resume.sections.map((section: any, index: number) => (
        <ContentAccordion
          key={section.id}
          id={section.id}
          title={getSectionTitle(section)}
          icon={getSectionIcon(section.type)}
          defaultExpanded={index === 0}
        >
          <div className="pt-2">
            {renderSectionEditor(section)}
          </div>
        </ContentAccordion>
      ))}

      {/* Add Section Button */}
      <button
        onClick={() => setIsAddSectionOpen(true)}
        className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-500 dark:text-slate-400 hover:border-green-500 hover:text-green-500 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Section
      </button>
    </div>
  );

  const designPanel = (
    <DesignSettingsPanel />
  );

  const aiPanel = (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
      <p>AI Assistant coming soon...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 select-none overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <EditorHeader
        resume={resume}
        onOptimizeClick={() => setIsATSSidebarOpen(true)}
        atsScore={75}
      />

      <EditorLayout
        leftPanel={
          <div className="flex-1 flex flex-col min-h-0">
            {/* The Tab Area provides scroll internally to its content panel */}
            <div className="flex-1 flex flex-col min-h-0">
              <EditorTabArea
                contentPanel={contentPanel}
                designPanel={designPanel}
                aiPanel={aiPanel}
              />
            </div>
          </div>
        }
        rightPanel={
          <div className="w-full h-full min-h-full">
            <ResumePreview resume={resume as any} />
          </div>
        }
      />

      {/* ATS Checker Sidebar (Sliding Overlay) */}
      {isATSSidebarOpen && (
        <ATSCheckerSidebar
          resume={resume}
          onClose={() => setIsATSSidebarOpen(false)}
        />
      )}

      {/* Add Section Modal (Full Screen Grid) */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
      />
    </div>
  );
}

