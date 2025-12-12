import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify ElevenLabs API configuration
 */
export async function GET(request: NextRequest) {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!ELEVENLABS_API_KEY,
    apiKeyPrefix: ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    testText: 'مرحباً',
  });
}

/**
 * Test POST endpoint to actually test TTS
 */
export async function POST(request: NextRequest) {
  try {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'API key not configured',
      }, { status: 500 });
    }

    const testText = 'مرحبا';
    const voiceId = 'pNInz6obpgDQGcFmaJgB';

    console.log('Testing ElevenLabs API...');
    console.log('Voice ID:', voiceId);
    console.log('Text:', testText);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: testText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    const responseHeaders = Object.fromEntries(response.headers.entries());

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: responseHeaders,
      }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return NextResponse.json({
      success: true,
      status: response.status,
      audioSize: audioBuffer.byteLength,
      headers: responseHeaders,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

