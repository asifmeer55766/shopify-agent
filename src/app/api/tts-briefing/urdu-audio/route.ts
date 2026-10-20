import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const db = await getDb();

    let userName = 'آصف';
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    // Check MongoDB audio cache
    const cacheKey = `urdu_briefing_${userName.toLowerCase()}`;
    const audioCache = db.collection('briefing_audio_cache');
    const cached = await audioCache.findOne({ key: cacheKey });

    if (cached && cached.audioBuffer) {
      const buf = Buffer.from(cached.audioBuffer.buffer || cached.audioBuffer);
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buf.length.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Split narrative into clear Urdu spoken sentences (under 200 chars for optimal natural TTS cadence)
    const sentences = [
      `صبح بخیر ${userName} صاحب! سٹور پائلٹ اے آئی ڈیلی بریفنگ میں خوش آمدید۔`,
      'آئیے آج کی اہم کاروباری تفصیلات کا جائزہ لیتے ہیں۔',
      'آپ کے سٹور کی نیٹ سیلز بارہ اعشاریہ آٹھ فیصد اضافے کے ساتھ اڑتالیس ہزار دو سو نوے روپے تک پہنچ گئی ہیں۔',
      'کل بارہ سو اڑتالیس آرڈرز کامیابی سے مکمل کیے گئے ہیں۔',
      'سب سے زیادہ فروخت ہونے والی پراڈکٹس سمر لنن ڈریس اور کلاسک کاٹن ٹی شرٹ رہی ہیں۔',
      'آپ کا مجموعی منافع سولہ ہزار چار سو بیس روپے ہے، جو چونتیس فیصد منافع بنتا ہے۔',
      'کورئیر کنسولیڈیشن کی بدولت تین ہزار چار سو بیس روپے کی اضافی بچت حاصل ہوئی۔',
      'انوینٹری میں اہم الرٹ ہے: ڈینم جیکٹ اور رننگ شوز کا سٹاک صرف چار دن کا باقی ہے۔',
      'چودہ ہزار دو سو روپے کے ممکنہ نقصان سے بچنے کے لیے نیا پرچیز آرڈر فوری منظور فرمائیں۔',
      'تین سو اسی ادھورے کارٹس سے آٹھ ہزار چار سو پچاس روپے کی ریکوری متوقع ہے۔',
      'آپ کا بہت شکریہ، اور آپ کا دن شاندار اور منافع بخش گزرے۔'
    ];

    const audioBuffers: Buffer[] = [];

    for (const sentence of sentences) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=ur&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuf));
      }
    }

    if (audioBuffers.length === 0) {
      throw new Error('Failed to generate audio stream');
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    // Save in MongoDB for fast replay
    try {
      await audioCache.updateOne(
        { key: cacheKey },
        {
          $set: {
            key: cacheKey,
            audioBuffer: combinedBuffer,
            mimeType: 'audio/mpeg',
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn('Audio caching note:', dbErr);
    }

    return new NextResponse(combinedBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combinedBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Urdu audio error:', err);
    return NextResponse.json({ error: err.message || 'Audio generation failed' }, { status: 500 });
  }
}
