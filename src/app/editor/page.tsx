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

const ExportPdfButton = dynamic(() => import("@/components/ExportPdfButton"), { ssr: false });
const TemplateSelect = dynamic(() => import("@/components/TemplateSelect"), { ssr: false });

export default function EditorPage() {
  const { resume, loading, saveResume } = useResume();
  const [activeSectionId, setActiveSectionId] = useState<string | null>("contact");

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
      <div className="flex flex-1">
        {/* Left Column: Editor */}
        <div className="w-1/2 p-8 border-r bg-white">
          {/* Header + Actions */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Editor</h2>

            <div className="flex items-center gap-4">
              <TemplateSelect />
              <div className="flex items-center gap-2">
                <ExportPdfButton resume={resume} />
                <button
                  onClick={() => saveResume()}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-[42px] flex items-center transition-colors"
                >
                  Save Resume
                </button>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {resume.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-3 py-1 rounded border whitespace-nowrap transition-colors ${activeSectionId === section.id
                  ? "bg-blue-100 border-blue-300 text-blue-700"
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

        Right Column: Live JSON Preview
        <div className="w-1/2 p-8 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Live Schema Preview</h2>
          <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded shadow-inner">
            {JSON.stringify(resume, null, 2)}
          </pre>
        </div>

        {/* Right Column: Live JSON Preview */}
<div className="w-1/2 p-8 bg-gray-50">
  <h2 className="text-xl font-bold mb-4">Live Schema Preview</h2>
  <pre>
    {JSON.stringify(resume, null, 2)}
  </pre>
</div>

      </div>
    </div>
  );
}
