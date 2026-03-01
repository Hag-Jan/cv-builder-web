# ResumeATS Agent Context

## Project Goal
Build ResumeATS — AI Resume Optimizer SaaS built with 
Next.js 14, TypeScript, Tailwind CSS, Firebase, Puppeteer, 
Gemini API, and Stripe.

## Architecture
- Frontend: Next.js App Router (src/app/)
- Resume types: @/types/resume-schema-v1
- PDF export: Puppeteer via src/app/api/pdf/render/route.ts
- PDF service: src/lib/pdf/pdf-service.ts
- AI rewrites: POST /api/ai/improve (Gemini API)
- Auth + usage tracking: Firebase / Firestore (collection: userUsage)
- Payments: Stripe paywall

## ALWAYS Read These Before Coding
1. docs/fix-history.md — past bugs and fix patterns (CRITICAL)
2. docs/ATS_ALGORITHM.md — ATS scoring logic
3. docs/ai-mock-response-example.md — AI API contract

## MVP Priority (do not build beyond this unless asked)
1. Resume editor with live preview ✅
2. Template rendering system ← CURRENT TASK
3. PDF export via Puppeteer ✅ (see fix-history for known issues)
4. AI bullet rewriting + job match scoring ✅
5. Stripe paywall

## Critical Rules
- NEVER use tables, SVGs, CSS columns, or floats for 
  resume content — ATS parsers cannot read them
- NEVER put text inside images or SVG elements
- ALWAYS use real selectable HTML text nodes
- Section headings must use exact strings: 
  "Experience", "Education", "Skills", "Summary"
- For PDF: use @page { margin: 0 } and internal CSS padding
- Use whitelist-based HTML tag stripping (not aggressive regex)
- Filter singleton sections to prevent duplicates

## Environment Variables
- GEMINI_API_KEY — Gemini AI
- Firebase config — see env.example
- Stripe keys — see env.example
