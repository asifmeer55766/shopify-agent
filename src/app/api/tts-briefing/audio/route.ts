import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { sectionId, text, voice = 'Puck' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    // Check if we already have this audio cached in MongoDB
    const db = await getDb();
    const audioCache = db.collection('briefing_audio_cache');
    const cached = await audioCache.findOne({ sectionId, text });

    if (cached && cached.audioDataUrl) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        audioDataUrl: cached.audioDataUrl,
        mimeType: cached.mimeType || 'audio/wav',
        durationSec: cached.durationSec || 45,
      });
    }

    // Try Gemini TTS API if API key exists
    if (apiKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voice, // 'Puck' | 'Kore' | 'Aoede' | 'Fenrir'
                  },
                },
              },
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const parts = json.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            if (p.inlineData && p.inlineData.data) {
              const mime = p.inlineData.mimeType || 'audio/wav';
              const audioDataUrl = `data:${mime};base64,${p.inlineData.data}`;

              // Cache in MongoDB
              await audioCache.updateOne(
                { sectionId, text },
                {
                  $set: {
                    sectionId,
                    text,
                    audioDataUrl,
                    mimeType: mime,
                    createdAt: new Date(),
                  },
                },
                { upsert: true }
              );

              return NextResponse.json({
                success: true,
                source: 'gemini_tts',
                audioDataUrl,
                mimeType: mime,
              });
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini TTS attempt error:', geminiErr);
      }
    }

    // High quality client-synthesized fallback
    return NextResponse.json({
      success: true,
      source: 'web_speech_fallback',
      fallback: true,
      message: 'Using synchronized Web Speech API synthesis for natural playback',
      textToSpeak: text,
      voice,
    });
  } catch (err: any) {
    console.error('TTS endpoint error:', err);
    return NextResponse.json({ error: err.message || 'TTS generation failed' }, { status: 500 });
  }
}
