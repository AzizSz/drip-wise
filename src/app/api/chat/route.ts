import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `أنت مساعد قهوة متخصص اسمك "مساعد قطرة".
تجيب باللغة التي يكتب بها المستخدم (عربي أو إنجليزي).
تخصصك الوحيد: V60، قهوة مقطرة، ريشيو، درجات حرارة، طرق تحضير، أنواع البن، استخلاص، طحنة، bloom، صبّات.
إجاباتك مباشرة ومفيدة (2-4 جمل).
لا تجيب على أي سؤال خارج عالم القهوة المقطرة — قل بلطف إنك متخصص بالقهوة فقط.`,
    });

    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);

    return NextResponse.json({ response: result.response.text() });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "حدث خطأ في الاتصال. حاول مرة ثانية." },
      { status: 500 }
    );
  }
}
