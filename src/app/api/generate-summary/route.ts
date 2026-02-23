import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { CVFormData } from "@/types/cv";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `Sen profesyonel bir CV yazarısın. Verilen kişi bilgilerine göre, iş başvurularında kullanılabilecek kısa, etkileyici ve profesyonel bir Türkçe "Profil Özeti / Hakkımda" paragrafı yaz (2-4 cümle). 
- Fiil odaklı, güçlü ifadeler kullan.
- Sadece düz metin döndür, başlık veya markdown kullanma.`;

function buildContext(data: Partial<CVFormData>): string {
  const parts: string[] = [
    `Ad: ${data.fullName || "-"}`,
    `Şehir: ${data.city || "-"}`,
    `İş deneyimi: ${(data.workExperience?.length || 0) > 0 ? data.workExperience?.map((e) => `${e.position} (${e.company})`).join("; ") : "-"}`,
    `Eğitim: ${(data.education?.length || 0) > 0 ? data.education?.map((e) => `${e.department}, ${e.school}`).join("; ") : "-"}`,
    `Beceriler: ${(data.skills?.length || 0) > 0 ? data.skills?.map((s) => `${s.name} (${s.level})`).join(", ") : "-"}`,
    `Diller: ${(data.languages?.length || 0) > 0 ? data.languages?.map((l) => `${l.language} ${l.level}`).join(", ") : "-"}`,
  ];
  return parts.join("\n");
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY tanımlı değil." },
      { status: 500 }
    );
  }
  try {
    const data: Partial<CVFormData> = await request.json();
    const context = buildContext(data);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: context },
      ],
      temperature: 0.6,
      max_tokens: 400,
    });
    const text = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ summary: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
