import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import violationsData from '@/data/violations.json';
import documentsData from '@/data/documents.json';
import vehiclesData from '@/data/vehicles.json';
import servicesData from '@/data/services.json';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: GROQ_API_KEY,
    });

    // Build context with user data
    const context = `أنت عون، المساعد الذكي للخدمات الحكومية في المملكة العربية السعودية.

بيانات المستخدم الحالية:
${JSON.stringify({
  violations: violationsData,
  documents: documentsData,
  vehicles: vehiclesData,
  services: servicesData,
}, null, 2)}

مهمتك:
1. ساعد المستخدم في الاستفسار عن الخدمات الحكومية
2. إذا سأل عن المخالفات، اعرض له مخالفاته من البيانات أعلاه
3. إذا سأل عن الهوية أو الوثائق، اعطه المعلومات من البيانات
4. كن ودوداً ومحترفاً
5. رد باللغة العربية دائماً
6. إذا أراد سداد مخالفة، أخبره أن الخدمة متاحة

تذكر: أنت تتحدث مع مواطن سعودي، كن محترماً ومفيداً.`;

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: context,
      },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: message,
      },
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك.';

    // Check if response mentions violations
    let data = null;
    if (message.includes('مخالف') || message.includes('غرام') || response.includes('مخالفة')) {
      const pendingViolations = violationsData.filter(v => v.status === 'pending');
      if (pendingViolations.length > 0) {
        data = pendingViolations;
      }
    }

    return NextResponse.json({
      response,
      data,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

