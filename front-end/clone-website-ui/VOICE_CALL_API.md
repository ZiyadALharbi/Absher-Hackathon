# 🔌 Voice Call Feature - API Documentation

## API Endpoints

### 1. Text-to-Speech (TTS) API

**Endpoint**: `POST /api/tts`

**Purpose**: Convert text to speech using ElevenLabs

**Request**:
```typescript
{
  text: string  // Text to convert to speech
}
```

**Request Example**:
```javascript
const response = await fetch('/api/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    text: 'مرحباً، كيف حالك؟' 
  }),
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

**Response**:
- **Content-Type**: `audio/mpeg`
- **Body**: Binary MP3 audio data

**Error Responses**:
```json
// 400 Bad Request
{
  "error": "Text is required"
}

// 500 Internal Server Error
{
  "error": "ElevenLabs API key not configured"
}
// or
{
  "error": "Failed to generate speech"
}
```

**ElevenLabs Configuration**:
```typescript
{
  voice_id: "3nav5pHC1EYvWOd5LmnA",
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    speed: 1.2
  }
}
```

---

### 2. Speech-to-Text (STT) API

**Endpoint**: `POST /api/voice`

**Purpose**: Transcribe audio to text using OpenAI Whisper

**Request**:
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `audio`: File (audio/webm blob)

**Request Example**:
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await fetch('/api/voice', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.text); // Transcribed text
```

**Response**:
```json
{
  "text": "مرحباً، أنا أريد المساعدة"
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "error": "Audio file is required"
}

// 500 Internal Server Error
{
  "error": "OpenAI API key not configured"
}
// or
{
  "error": "Failed to transcribe audio"
}
```

**OpenAI Whisper Configuration**:
```typescript
{
  model: "whisper-1",
  language: "ar"  // Arabic
}
```

---

## Utility Functions

### speak.ts

#### `speakArabic(text, onEnd?)`

Convert text to speech and play it.

**Parameters**:
- `text`: `string` - Text to speak
- `onEnd?`: `() => void` - Optional callback when audio finishes

**Returns**: `Promise<void>`

**Example**:
```typescript
import { speakArabic } from '@/utils/speak';

await speakArabic('مرحباً بك', () => {
  console.log('Speech finished');
});
```

**Features**:
- Automatically stops any currently playing audio
- Creates audio URL from blob
- Plays audio
- Cleans up resources after playback
- Calls callback when audio ends

---

#### `stopSpeaking()`

Stop the currently playing audio.

**Parameters**: None

**Returns**: `void`

**Example**:
```typescript
import { stopSpeaking } from '@/utils/speak';

stopSpeaking(); // Immediately stops current audio
```

---

#### `getVoiceInfo()`

Get current voice playback information.

**Parameters**: None

**Returns**: 
```typescript
{
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
}
```

**Example**:
```typescript
import { getVoiceInfo } from '@/utils/speak';

const { isPlaying, currentAudio } = getVoiceInfo();
if (isPlaying) {
  console.log('Audio is currently playing');
}
```

---

## Component APIs

### VoiceCallButton

A floating button that opens the voice call panel.

**Props**:
```typescript
interface VoiceCallButtonProps {
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}
```

**Usage**:
```tsx
import VoiceCallButton from '@/components/VoiceCallButton';

// Basic usage
<VoiceCallButton />

// With custom chat handler
<VoiceCallButton
  onSendMessage={async (userMessage) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    return data.reply;
  }}
/>

// With custom styling
<VoiceCallButton className="bottom-20 right-6" />
```

---

### VoiceCallPanel

The main voice call interface with recording, transcription, and playback.

**Props**:
```typescript
interface VoiceCallPanelProps {
  onClose: () => void;
  onSendMessage?: (message: string) => Promise<string>;
}
```

**Usage**:
```tsx
import VoiceCallPanel from '@/components/VoiceCallPanel';

const [isOpen, setIsOpen] = useState(false);

{isOpen && (
  <VoiceCallPanel
    onClose={() => setIsOpen(false)}
    onSendMessage={async (message) => {
      // Your chat logic
      return aiResponse;
    }}
  />
)}
```

**Features**:
- Auto-greeting on mount
- Voice Activity Detection (VAD)
- Auto-stop on silence
- Real-time audio level visualization
- Message history
- Auto-loop conversation

---

## Configuration Constants

### VAD Configuration

```typescript
const VAD_CONFIG = {
  fftSize: 2048,                    // FFT size for frequency analysis
  smoothingTimeConstant: 0.8,       // Smoothing constant
  voiceThreshold: 5,                // Voice detection threshold
  silenceDuration: 1000,            // Silence duration (ms)
  maxRecordingTime: 6000            // Max recording time (ms)
};
```

### MediaRecorder Configuration

```typescript
const MEDIA_RECORDER_CONFIG = {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000,
};

const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};
```

---

## Integration Examples

### Example 1: Basic Integration

```tsx
import VoiceCallButton from '@/components/VoiceCallButton';

export default function MyApp() {
  return (
    <div>
      {/* Your app content */}
      <VoiceCallButton />
    </div>
  );
}
```

### Example 2: With Backend Chat API

```tsx
import VoiceCallButton from '@/components/VoiceCallButton';

export default function MyApp() {
  const handleChat = async (userMessage: string) => {
    const response = await fetch('http://localhost:8000/api/agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userMessage,
        session_id: sessionId,
      }),
    });
    
    const data = await response.json();
    return data.response;
  };

  return (
    <div>
      <VoiceCallButton onSendMessage={handleChat} />
    </div>
  );
}
```

### Example 3: Custom Greeting

```tsx
import { useState, useEffect } from 'react';
import VoiceCallPanel from '@/components/VoiceCallPanel';
import { speakArabic } from '@/utils/speak';

export default function CustomVoiceCall() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      speakArabic('مرحباً! هذا تحية مخصصة', () => {
        console.log('Custom greeting finished');
      });
    }
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Start Voice Call
      </button>
      
      {isOpen && (
        <VoiceCallPanel
          onClose={() => setIsOpen(false)}
          onSendMessage={async (msg) => {
            // Your logic
            return 'AI response';
          }}
        />
      )}
    </>
  );
}
```

---

## Testing APIs

### Test TTS API

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحباً"}' \
  --output test-audio.mp3
```

### Test STT API

```bash
curl -X POST http://localhost:3000/api/voice \
  -F "audio=@recording.webm"
```

---

## Error Handling

### Frontend Error Handling

```typescript
try {
  await speakArabic(text);
} catch (error) {
  console.error('TTS error:', error);
  // Show user-friendly error message
}
```

### Backend Error Handling

Both API routes include comprehensive error handling:
- Input validation
- API key verification
- External API error catching
- Proper HTTP status codes
- Detailed error logging

---

## Rate Limits

### ElevenLabs
- Free tier: 10,000 characters/month
- Concurrent requests: 2 (free tier)
- Consider implementing request queuing for production

### OpenAI Whisper
- Rate limit: 50 requests/minute (standard)
- Max file size: 25 MB
- Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, webm

---

## Best Practices

1. **Always handle errors gracefully**
   ```typescript
   try {
     await speakArabic(text);
   } catch (error) {
     // Fallback or user notification
   }
   ```

2. **Clean up resources**
   ```typescript
   useEffect(() => {
     return () => {
       stopSpeaking();
       // Clean up other resources
     };
   }, []);
   ```

3. **Validate input before API calls**
   ```typescript
   if (!text || text.trim() === '') {
     return; // Don't call API
   }
   ```

4. **Implement retry logic for transient failures**
   ```typescript
   const retryRequest = async (fn, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(r => setTimeout(r, 1000 * (i + 1)));
       }
     }
   };
   ```

---

## Security Considerations

1. **API Keys**: Never expose in client-side code
2. **CORS**: Configure properly for production
3. **Rate Limiting**: Implement on backend
4. **Input Validation**: Sanitize all user inputs
5. **File Size Limits**: Enforce maximum audio file sizes

---

**API Version**: 1.0.0  
**Last Updated**: December 12, 2025

