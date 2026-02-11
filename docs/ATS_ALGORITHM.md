# ATS Keyword Checker - Algorithm Documentation

## Overview
The ATS (Applicant Tracking System) Keyword Checker uses a simple Natural Language Processing (NLP) pipeline to extract, match, and score keywords from job descriptions against resume content.

## Keyword Extraction Algorithm

### Pipeline Steps

1. **Text Normalization**
   - Convert text to lowercase
   - Remove special characters (except spaces and hyphens)
   - Preserve hyphenated terms (e.g., "full-stack", "front-end")

2. **Tokenization**
   - Split text into words using whitespace
   - Filter out empty strings

3. **Multi-word Phrase Extraction**
   - Extract 2-word and 3-word phrases
   - Apply heuristics to identify technical terms:
     - Contains numbers (e.g., "Python3", "C++")
     - Contains dots (e.g., "React.js", "Node.js")
     - All caps (e.g., "SQL", "API")
     - Contains hyphens (e.g., "full-stack")
     - Common tech suffixes (e.g., "JavaScript", "database")

4. **Stopword Filtering**
   - Remove common English words (the, and, or, etc.)
   - Remove job-posting specific stopwords (job, position, required, etc.)
   - Filter words shorter than 3 characters

5. **Synonym Normalization**
   - Apply synonym dictionary to normalize variations:
     - "JS" → "javascript"
     - "React.js" → "react"
     - "SEO" → "seo"
   - Enables matching of different representations of the same skill

6. **Deduplication**
   - Remove duplicate keywords
   - Return unique set of keywords

### Example

**Input Job Description:**
```
Looking for a Full-Stack Developer with 3+ years of experience.
Required: React.js, Node.js, TypeScript, SQL
Preferred: AWS, Docker
```

**Extracted Keywords:**
```
["full-stack", "developer", "react", "node", "typescript", "sql", "aws", "docker"]
```

## Resume Text Extraction

Extract searchable text from all resume sections:
- Contact name
- Experience: company, role, bullets
- Education: school, degree
- Skills: all skill categories and skills
- Projects: name, description
- Custom sections: title, content

## Matching Algorithm

For each extracted job keyword:
1. Check if keyword appears in resume text (case-insensitive)
2. Check if any synonym of the keyword appears
3. Mark as "matched" if found, "missing" otherwise

## Scoring Formula

```
ATS Score = (Matched Keywords / Total Keywords) × 100
```

**Example:**
- Job has 10 keywords
- Resume matches 7 keywords
- Score = (7 / 10) × 100 = **70%**

## Score Interpretation

- **70-100%** (Green): Excellent match, high ATS compatibility
- **40-69%** (Yellow): Moderate match, consider adding missing keywords
- **0-39%** (Red): Poor match, significant optimization needed

## Warning Detection

### 1. Date Format Inconsistency
**Check:** Experience section dates use different formats
- Example: "2020-01" and "2022" mixed together
- **Impact:** ATS systems may struggle to parse dates
- **Recommendation:** Use consistent YYYY-MM format

### 2. Too Few Skills
**Check:** Less than 5 skills listed in Skills section
- **Impact:** Appears under-qualified to ATS
- **Recommendation:** Add 8-15 relevant skills

### 3. Keyword Stuffing
**Check:** Same keyword appears more than 5 times
- Example: "React" appears 8 times
- **Impact:** May be flagged as spam by ATS
- **Recommendation:** Remove excessive repetition

## Limitations & Future Enhancements

### Current Limitations
- Simple heuristic-based keyword extraction (no ML)
- Basic synonym dictionary (limited coverage)
- No context awareness (can't distinguish "Java" language vs "Java" coffee)
- No semantic similarity matching
- English-only support

### Potential Enhancements
- AI-powered keyword extraction using OpenAI/Gemini
- Industry-specific keyword databases
- Contextual analysis using NLP libraries
- Keyword density visualization
- Historical ATS score tracking
- Multi-language support
- Integration with job boards for automatic job description fetching

## Technical Stack

- **Language:** TypeScript
- **Libraries:** None (pure JavaScript implementation)
- **Dependencies:**
  - `@/types/resume-schema-v1` - Resume type definitions
  - Built-in JavaScript String and Array methods
