import { NextRequest, NextResponse } from 'next/server';

/**
 * Simplified TTS endpoint with minimal configuration
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Use the most reliable voice (Rachel - English)
    const voiceId = '21m00Tcm4TlvDq8ikWAM';
    
    console.log('=== SIMPLE TTS REQUEST ===');
    console.log('Text:', text);
    console.log('Voice:', voiceId);
    console.log('API Key starts with:', ELEVENLABS_API_KEY.substring(0, 8));

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
          text: text,
          model_id: 'eleven_monolingual_v1',
        }),
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { error: errorText, status: response.status },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('Audio size:', audioBuffer.byteLength);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Fatal error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

