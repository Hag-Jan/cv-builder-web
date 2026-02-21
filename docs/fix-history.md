# Bug Fix History

This file tracks significant bug fixes, their root causes, and fix patterns to prevent regressions and improve future implementations.

---
## [2026-02-21] PDF Export: Text Corruption and Duplication

- **Root Cause**: 
    1. Over-aggressive regex `/<[^>]*>?/gm` in the render route stripped any text between `<` and `>`, mangling input like `Age < 30`.
    2. Lack of singleton section filtering allowed duplicate `contact` or `summary` sections to be rendered.
    3. Inconsistent multi-page layout due to interaction between `@page` and browser default margins.
- **Fix Pattern**: 
    1. Use a safer white-list based tag stripping regex or target specific forbidden tags.
    2. Explicitly filter for singleton section types in the render data processing layer.
    3. Use internal CSS padding for margins and set `@page { margin: 0; }` for reliable print output.
- **Related Files**: `src/app/api/pdf/render/route.ts`, `src/lib/pdf/pdf-service.ts`
