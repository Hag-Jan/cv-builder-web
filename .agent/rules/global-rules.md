---
trigger: always_on
---

# Global Rules – cv-builder-web

## Authority Order
1. Lead Architect owns the data schema and API contracts.
2. Full-Stack Developer implements the schema exactly as defined.
3. AI/ATS Specialist reads schema, never assumes structure.
4. QA & Browser Agent validates outputs, never edits code.
5. Security & DevOps Agent enforces safety and compliance.

## Non-Negotiable Rules
- No agent may modify the data schema except the Lead Architect.
- All resume data must follow the Resume schema.
- All AI outputs must be structured (JSON), never free text.
- PDF export must preserve selectable text (ATS-safe).
- No inline styles; Tailwind CSS only.
- GitHub is the source of truth. Commit after each agent task.

## MVP Scope Guardrail
- One resume template only.
- One-column ATS-safe layout.
- No job matching.
- No multi-language support.
- No design animations in MVP.

Breaking these rules is considered a failure.
- Schema changes require a version bump and migration note.
