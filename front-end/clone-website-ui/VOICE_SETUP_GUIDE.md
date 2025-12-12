# 🚀 Voice Call Feature - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Get API Keys (2 minutes)

#### ElevenLabs API Key
1. Visit: https://elevenlabs.io/
2. Click "Get Started" or "Sign In"
3. Go to your Profile → API Keys
4. Copy your API key (starts with `sk_`)

#### OpenAI API Key
1. Visit: https://platform.openai.com/
2. Sign in to your account
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

### Step 2: Configure Environment Variables (1 minute)

Create `.env.local` file in `front-end/clone-website-ui/`:

```bash
cd front-end/clone-website-ui
cp .env.template .env.local
```

Edit `.env.local`:

```env
ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_key_here
OPENAI_API_KEY=sk-your_actual_openai_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important**: Replace the placeholder keys with your actual API keys!

### Step 3: Restart Development Server (1 minute)

If the server is already running, restart it to load the new environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

Or if starting fresh:

```bash
cd front-end/clone-website-ui
npm install  # If not already done
npm run dev
```

### Step 4: Test the Feature (1 minute)

1. Open http://localhost:3000 in your browser
2. Look for the **green floating phone button** at the bottom-left corner
3. Click it to open the voice call panel
4. Allow microphone access when prompted
5. The AI will greet you in Arabic
6. Start speaking after the greeting ends!

## ✅ Verification Checklist

- [ ] ElevenLabs API key added to `.env.local`
- [ ] OpenAI API key added to `.env.local`
- [ ] Development server restarted
- [ ] Browser can access microphone (permission granted)
- [ ] Green phone button visible at bottom-left
- [ ] Clicking button opens voice call panel
- [ ] AI greeting plays automatically
- [ ] Microphone activates after greeting
- [ ] Can record and transcribe voice

## 🎯 Testing the Full Flow

1. **Click** the green phone button
2. **Listen** to the AI greeting ("مرحباً، أنا عون...")
3. **Wait** for the mic to activate (green mic icon)
4. **Speak** a question in Arabic (or English)
5. **Watch** the recording indicator (red pulsing mic)
6. **Stop** speaking for 1 second (auto-stops)
7. **See** your transcribed text appear
8. **Listen** to the AI response
9. **Repeat** - mic auto-activates for next question!

## 🔧 Troubleshooting

### No green phone button?
```bash
# Check if the component is imported
# Verify app/page.tsx has:
import VoiceCallButton from "@/components/VoiceCallButton"
```

### "Failed to generate speech" error?
- Check your `ELEVENLABS_API_KEY` in `.env.local`
- Verify you have credits on https://elevenlabs.io/
- Restart the dev server after adding the key

### "Failed to transcribe audio" error?
- Check your `OPENAI_API_KEY` in `.env.local`
- Verify API access at https://platform.openai.com/
- Restart the dev server after adding the key

### Microphone not working?
- Click the 🔒 (lock icon) in browser address bar
- Ensure microphone permission is allowed
- Try a different browser (Chrome recommended)
- Ensure you're on localhost or HTTPS

### Recording stops too quickly?
- Speak louder or closer to microphone
- Check microphone input level in system settings
- Reduce background noise

### No audio playback?
- Check system volume
- Ensure speakers/headphones are connected
- Try a different audio output device
- Check browser audio settings

## 💰 API Costs (Approximate)

### ElevenLabs
- Free tier: 10,000 characters/month
- Cost: ~$0.03 per 1,000 characters
- A typical response: 50-100 characters

### OpenAI Whisper
- Cost: $0.006 per minute of audio
- Typical recording: 2-5 seconds = ~$0.0002

**Example**: 100 voice interactions ≈ $0.30 - $0.50

## 📱 Browser Requirements

- ✅ Chrome 80+ (Recommended)
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

## 🔐 Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- API keys are server-side only (not exposed to browser)
- Keep your API keys private
- Regenerate keys if accidentally exposed

## 📞 Support

If you encounter issues:

1. Check browser console for error messages (F12)
2. Verify API keys are correct and active
3. Ensure dev server was restarted after adding keys
4. Try in incognito/private browsing mode
5. Check the detailed documentation: `VOICE_CALL_FEATURE.md`

## 🎉 Success!

If everything works:
- You should see the green phone button
- Clicking it opens a voice call panel
- The AI greets you in Arabic
- You can speak and get responses
- The conversation continues automatically

**Enjoy your AI voice assistant! 🎤**

---

Last Updated: December 12, 2025

