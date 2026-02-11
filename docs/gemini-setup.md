# Setting Up Gemini API Key

## Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key (starts with `AIza...`)

## Step 2: Add to Environment Variables

1. Open `.env.local` in your project root
2. Add the following line:

```bash
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

## Step 3: Restart Dev Server

After adding the environment variable, restart your development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Security Notes

⚠️ **NEVER** commit your `.env.local` file to git
⚠️ Make sure `.env.local` is in your `.gitignore`
✅ The free tier includes generous quotas suitable for MVP testing

## Firestore Setup

The AI usage tracking requires a Firestore collection called `userUsage`. This will be automatically created when a user makes their first AI improvement call.

**Collection structure:**
- Collection: `userUsage`
- Document ID: User's Firebase UID
- Fields:
  - `uid` (string): User's Firebase UID
  - `aiCallsUsed` (number): Count of AI calls made
  - `lastUpdated` (string): ISO timestamp of last update

No manual setup required - the SDK will handle collection creation automatically!
