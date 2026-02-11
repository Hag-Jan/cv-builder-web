# AI Bullet Point Rewriter - Mock Response Example

## Example Request

**Endpoint:** `POST /api/ai/improve`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "x-user-id": "user123"
}
```

**Body:**
```json
{
  "text": "Worked on website development",
  "jobDescription": "We are looking for a Senior Frontend Developer with experience in React, TypeScript, and performance optimization. The ideal candidate will have worked on large-scale applications and demonstrated measurable improvements in user experience and application performance.",
  "missingKeywords": ["React", "TypeScript", "performance optimization", "user experience"]
}
```

## Example Response

**Status:** 200 OK

**Body:**
```json
{
  "suggestions": [
    "Developed React-based web application using TypeScript, improving load time by 35% through performance optimization techniques",
    "Led frontend development of enterprise React application, enhancing user experience and achieving 40% reduction in page render time",
    "Architected TypeScript React solution for high-traffic platform, implementing performance optimization strategies that boosted user experience metrics by 50%"
  ],
  "remainingCalls": 2
}
```

## Key Features Demonstrated

✅ **STAR Method:** Each suggestion includes Situation/Task (context), Action (what was done), and Result (metrics)

✅ **Measurable Impact:** All suggestions include specific percentages or numbers

✅ **Keyword Integration:** Missing keywords (React, TypeScript, performance optimization, user experience) are naturally incorporated

✅ **Action Verbs:** Strong verbs like "Developed," "Led," "Architected"

✅ **Word Limit:** All under 25 words

✅ **Variety:** Each suggestion takes a different angle while maintaining quality

## Error Responses

### Quota Exceeded (403)
```json
{
  "error": "Free usage limit reached (3 calls). Upgrade to premium for unlimited access."
}
```

### Missing Auth (401)
```json
{
  "error": "Authentication required"
}
```

### Missing Fields (400)
```json
{
  "error": "Missing required fields: text and jobDescription"
}
```

### AI API Error (500)
```json
{
  "error": "Failed to generate valid suggestions. Please try again."
}
```
