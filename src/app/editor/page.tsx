"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import { useResume } from "@/contexts/ResumeContext";

import dynamic from "next/dynamic";

import { ContactEditor } from "@/components/editor/sections/ContactEditor";
import { ExperienceEditor } from "@/components/editor/sections/ExperienceEditor";
import { EducationEditor } from "@/components/editor/sections/EducationEditor";
import { SkillsEditor } from "@/components/editor/sections/SkillsEditor";
import { ProjectsEditor } from "@/components/editor/sections/ProjectsEditor";
import { ATSCheckerSidebar } from "@/components/ats/ATSCheckerSidebar";
import ResumePreview from "@/components/ResumePreview";

const ExportPdfButton = dynamic(() => import("@/components/ExportPdfButton"), { ssr: false });
const TemplateSelect = dynamic(() => import("@/components/TemplateSelect"), { ssr: false });

export default function EditorPage() {
  const { resume, loading, saveResume } = useResume();
  const [activeSectionId, setActiveSectionId] = useState<string | null>("contact");
  const [isATSSidebarOpen, setIsATSSidebarOpen] = useState(false);

  if (loading || !resume) {
    return <div className="p-8">Loading Resume...</div>;
  }

  const renderSectionEditor = () => {
    const section = resume.sections.find((s) => s.id === activeSectionId);
    if (!section) {
      return <div className="p-8 text-gray-500">Select a section to edit</div>;
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
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 🔝 Top bar with Logout */}
      <TopBar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Editor - 30% */}
        <div className="w-[30%] p-6 border-r bg-white overflow-y-auto">
          {/* Header + Actions */}
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-xl font-bold">Editor</h2>

            <div className="flex flex-col gap-2">
              <TemplateSelect />
              <button
                onClick={() => setIsATSSidebarOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm"
              >
                Optimize for Job
              </button>
              <ExportPdfButton resume={resume} />
              <button
                onClick={() => saveResume()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
              >
                Save Resume
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex flex-col gap-2 mb-6">
            {resume.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-3 py-2 rounded border text-left transition-colors ${activeSectionId === section.id
                  ? "bg-blue-100 border-blue-300 text-blue-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderSectionEditor()}
          </div>
        </div>

        {/* Center Column: Live Resume Preview - 70% (MAIN FOCUS) */}
        <div className="w-[70%] bg-gray-50 overflow-hidden">
          <ResumePreview resume={resume} />
        </div>
      </div>

      {/* ATS Checker Sidebar */}
      {isATSSidebarOpen && (
        <ATSCheckerSidebar
          resume={resume}
          onClose={() => setIsATSSidebarOpen(false)}
        />
      )}
    </div>
  );
}
