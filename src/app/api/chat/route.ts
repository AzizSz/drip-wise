import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const messages = [
      {
        role: "system" as const,
        content: `أنت مساعد قهوة متخصص اسمك "مساعد قطرة".
تجيب باللغة التي يكتب بها المستخدم (عربي أو إنجليزي).
تخصصك الوحيد: V60، قهوة مقطرة، ريشيو، درجات حرارة، طرق تحضير، أنواع البن، استخلاص، طحنة، bloom، صبّات.
إجاباتك مباشرة ومفيدة (2-4 جمل فقط).
لا تجيب على أي سؤال خارج عالم القهوة المقطرة — قل بلطف إنك متخصص بالقهوة فقط.`,
      },
      ...(history || []),
      { role: "user" as const, content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages,
    });

    const text = response.choices[0]?.message?.content || "";
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "حدث خطأ في الاتصال" }, { status: 500 });
  }
}
