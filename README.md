This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Features

### ATS Keyword Checker

Optimize your resume for Applicant Tracking Systems (ATS) by analyzing keyword matches against job descriptions.

**How to use:**
1. Navigate to the `/editor` page
2. Click the **"Optimize for Job"** button (purple button in the top toolbar)
3. Paste a job description in the sidebar textarea
4. Click **"Analyze Resume"**
5. Review your ATS score, matched keywords, and missing keywords
6. Add missing keywords to your resume sections (Skills, Experience, etc.)
7. Click **"Re-analyze"** to see your updated score

**Features:**
- **ATS Score:** Percentage match between your resume and job description
- **Matched Keywords:** Skills and terms found in both (green badges)
- **Missing Keywords:** Important terms to add (red badges)
- **Warnings:** ATS compatibility issues (date formats, too few skills, keyword stuffing)

**Algorithm Details:**
See [docs/ATS_ALGORITHM.md](./docs/ATS_ALGORITHM.md) for technical details on the keyword extraction and matching algorithm.
