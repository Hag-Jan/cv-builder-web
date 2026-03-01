# ResumeATS Technical Audit & Strategic Blueprint

---

### 1. System Structure Audit

| Aspect | Recommended Approach | Rationale |
|--------|----------------------|-----------|
| **Overall Architecture** | **Feature‑sliced monorepo** (`src/app`, `src/components`, `src/features`, `src/lib`) | Keeps UI, domain logic, and shared utilities isolated; scales with new features (e.g., ATS engine). |
| **Folder Layout** | ```text
src/
├─ app/            # Next.js App Router pages & layout
├─ components/      # Re‑usable UI primitives (Stitch‑generated)
├─ features/        # Feature‑specific modules (editor, export, ats)
│   ├─ editor/
│   ├─ export/
│   ├─ ats/
│   └─ validation/
├─ lib/             # Helpers, state store, utils
├─ contexts/        # React contexts (auth, autosave)
├─ styles/          # Tailwind config + global CSS
├─ public/          # Static assets (icons, fonts)
``` | Mirrors Next.js conventions, makes future code‑splitting trivial. |
| **State Management** | **React Context + Zustand (or Jotai) for global slices**; local component state for form fields; autosave writes to a **persisted Zustand store** (JSON in `localStorage`). | Context provides low‑overhead propagation for auth & UI theme; Zustand gives explicit store, easy snapshot for autosave & undo/redo. |
| **Template Engine** | **JSON‑driven schema + React component renderer**. <br>1. **Schema** (`resume-schema.json`) defines sections, repeatable blocks, and allowed fields. <br>2. **Renderer** (`TemplateRenderer.tsx`) reads a resume JSON and maps each section to a **layout component** (`Header`, `SectionBlock`, `EntryBlock`). | Decouples data from presentation, enables multiple visual templates without code duplication. |
| **Example Resume Data Structure** | ```json
{
  "personal": {"name":"…","email":"…","phone":"…","url":"…"},
  "summary":"…",
  "education":[{"institution":"…","degree":"…","start":"YYYY","end":"YYYY"}],
  "experience":[{"company":"…","role":"…","start":"YYYY","end":"YYYY","details":["…"]}],
  "projects":[{"title":"…","description":"…","link":"…"}],
  "skills":{
    "programming":[{"name":"React","level":"Advanced"}],
    "soft": ["Leadership","Communication"]
  }
}
``` | Normalized, ATS‑friendly (plain text), easy to serialize for autosave and export. |

---

### 2. Product Maturity Analysis

| Current Stage | Evidence |
|---------------|----------|
| **Prototype / MVP** | • Core editor works, but **validation is missing**, **dirty test data** present, **duplicate preview rendering**, **empty sections** appear. <br>• No structured example templates or JSON seed. <br>• ATS scoring is a **basic percentage**, not a real parser. |

**Missing for Production‑Ready SaaS**

1. **Robust Validation** (email, URLs, date ranges, required fields).  
2. **Data Integrity** – seed data, sanitization, schema enforcement.  
3. **Scalable Template System** – multiple ATS‑safe layouts, theming.  
4. **Advanced ATS Engine** – keyword extraction, parsing simulation, resume‑to‑job‑match analytics.  
5. **Security & Auth** – role‑based access, rate‑limited API, GDPR‑compliant data handling.  
6. **CI/CD & Testing** – unit & integration tests, end‑to‑end UI tests, automated PDF regression.  
7. **Observability** – logging, error monitoring, performance metrics.  
8. **Documentation & Onboarding** – API docs, user guides, developer README.

---

### 3. Agent Strategy Plan

| Agent | Core Responsibility | Key Interactions |
|-------|---------------------|------------------|
| **UI Agent** | Render Stitch‑generated components, handle user events, coordinate with state store. | Calls **Validation Agent** before persisting; triggers **Export Agent** on “Download PDF”. |
| **Data Model Agent** | Maintain the canonical resume JSON, enforce schema, provide CRUD APIs (`/api/resume/*`). | Supplies data to **UI Agent**, **ATS Engine**, **Export Agent**. |
| **ATS Engine Agent** | Compute ATS score, run keyword density, simulate parsing rules (e.g., regex for dates, sections). | Consumes resume JSON from **Data Model**, returns score to **UI**; feeds results to **Validation** for warnings. |
| **Export Engine Agent** | Generate PDF (via Puppeteer) and optional DOCX/HTML exports; apply selected template. | Reads resume JSON + chosen template; uses **Template Engine** to produce HTML before PDF conversion. |
| **Validation Agent** | Validate fields (email, URL, date integrity), enforce required sections, flag empty entries. | Runs on every autosave; returns validation errors to **UI** for inline feedback. |

*All agents are implemented as **Next.js API routes** under `src/app/api/[agent]/*`, keeping the codebase modular and testable.*

---

### 4. Template System Design

| Decision | Recommendation |
|----------|----------------|
| **Layout‑driven vs Schema‑driven** | **Hybrid:** a **schema** defines the data shape; each **layout** component consumes the schema. This enables **multiple visual templates** (layout‑driven) while guaranteeing **data consistency** (schema‑driven). |
| **Rendering Multiple Templates** | - Store **template registry** (`templates.ts`) mapping `templateId → React component`. <br>- `TemplateRenderer` receives `resumeJSON` + `templateId` and renders the appropriate component. <br>- For preview/export, simply switch `templateId`. |
| **ATS‑Safe Templates** | - Use **plain‑text fonts** (e.g., Arial, Times New Roman). <br>- Avoid absolute positioning, background images, or CSS that inserts hidden characters. <br>- Ensure **HTML → PDF** conversion preserves text order (no layering). |
| **Extensibility** | New templates are added by creating a component under `src/templates/` and registering it; no changes to core logic. |

---

### 5. ATS Engine Roadmap

| Sprint | Milestone | Implementation Sketch |
|--------|-----------|-----------------------|
| **Sprint 1** (Stability) | Replace **% score** with **keyword match engine**. | • Parse job description (user‑provided). <br>• Build a **keyword dictionary** (skills, verbs, industry terms). <br>• Compute **coverage %** and **density**. |
| **Sprint 2** (Simulation) | **Resume parsing simulation** (ATS‑like extraction). | • Implement **section regexes** (e.g., `Education`, `Experience`). <br>• Extract dates, titles, companies → compare against job requirements. |
| **Sprint 3** (Advanced Analytics) | **Weighted scoring**, **soft‑skill detection**, **visual feedback**. | • Weight matches by relevance (role‑specific vs generic). <br>• Add **readability metrics** (Flesch‑Kincaid). <br>• UI heatmap overlay showing under‑optimized sections. |

*All steps expose a **public API** (`/api/ats/score`) that the UI Agent consumes.*

---

### 6. Strategic Product Positioning

| Market Segment | Suggested Position |
|----------------|--------------------|
| **Direct Competitors** (FlowCV, Enhancv) | Position **ResumeATS** as a **“Data‑First ATS Optimization Platform”** – focus on **algorithmic match** rather than just design. |
| **Differentiator** | • **Real‑time ATS parsing simulation** (preview how recruiters’ systems read the resume). <br>• **Export‑ready, ATS‑compliant templates** (guaranteed pass through major ATS). <br>• **AI‑driven keyword recommendations** (integrated with Gemini). |
| **Target Audience** | Job seekers aiming for **tech & enterprise roles** where ATS parsing is a known hurdle; HR/recruiting consultants who need a **trusted audit tool**. |

---

### 7. Next 3 Development Sprints

#### Sprint 1 – Stability & Validation
- Implement **Validation Agent** (email, URL, date, required sections). 
- Hook autosave to run validation before persisting. 
- Clean dirty test data; add **seed JSON** (`example-resume.json`). 
- Unit tests for validation rules.

#### Sprint 2 – Example Template Engine
- Define **resume schema** (`resume-schema.json`). 
- Build **TemplateRenderer** and **registry** for at least **3 ATS‑safe layouts**. 
- Add UI control to switch templates live. 
- Write integration tests for rendering across templates.

#### Sprint 3 – Advanced ATS Engine
- Develop **keyword extraction** and **density analysis**.
- Add **section parsing** to simulate ATS extraction.
- Implement **weighted scoring** and UI heat‑map feedback.

---

*Prepared by Antigravity – Senior Technical Product Architect*
