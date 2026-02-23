import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { CVFormData } from "@/types/cv";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `Sen profesyonel bir insan kaynakları danışmanı ve CV yazarısın. Verilen ham bilgilerden, iş başvurularında kullanılabilecek, akıcı ve profesyonel bir Türkçe CV metni üret. 
- Başlıkları net kullan (Özet, İş Deneyimi, Eğitim, Beceriler, Diller, Sertifikalar).
- Cümleleri kısa, etkili ve fiil odaklı yaz.
- Tarih ve şirket/okul isimlerini olduğu gibi kullan.
- Beceri seviyelerini (Başlangıç/Orta/İleri) ve dil seviyelerini (A1-C2) metne yansıt.
- Sadece düz metin döndür, markdown veya HTML kullanma. Paragraflar arasında boş satır bırak.`;

function buildUserMessage(data: CVFormData): string {
  const parts: string[] = [
    `Ad Soyad: ${data.fullName}`,
    `E-posta: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Şehir: ${data.city}`,
    data.linkedinUrl ? `LinkedIn: ${data.linkedinUrl}` : "",
    data.githubUrl ? `GitHub: ${data.githubUrl}` : "",
    "",
    "--- Profil Özeti / Hakkımda ---",
    data.about || "(belirtilmedi)",
    "",
    "--- İş Deneyimi ---",
    ...(data.workExperience || [])
      .filter((e) => e.company || e.position || e.description)
      .map(
        (e) =>
          `Şirket: ${e.company}, Pozisyon: ${e.position}, Tarih: ${e.date}\nAçıklama: ${e.description}`
      ),
    "",
    "--- Eğitim ---",
    ...(data.education || [])
      .filter((e) => e.school || e.department)
      .map(
        (e) =>
          `Okul: ${e.school}, Bölüm: ${e.department}, Mezuniyet: ${e.graduationYear}${e.gpa ? `, GPA: ${e.gpa}` : ""}`
      ),
    "",
    "--- Beceriler ---",
    (data.skills?.length
      ? data.skills.map((s) => `${s.name} (${s.level})`).join(", ")
      : "(belirtilmedi)"),
    "",
    "--- Dil Becerileri ---",
    (data.languages?.length
      ? data.languages.map((l) => `${l.language}: ${l.level}`).join(", ")
      : "(belirtilmedi)"),
    "",
    "--- Sertifikalar ---",
    (data.certifications?.length
      ? data.certifications
          .map((c) => `${c.name} - ${c.institution} (${c.date})`)
          .join("\n")
      : "(belirtilmedi)"),
  ];
  return parts.filter(Boolean).join("\n");
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
  }

  try {
    const data: CVFormData = await request.json();
    const userMessage = buildUserMessage(data);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const text =
      completion.choices[0]?.message?.content?.trim() ||
      "CV metni oluşturulamadı.";

    return NextResponse.json({ cvText: text });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen hata oluştu.";
    console.error("OpenAI API hatası:", err);
    return NextResponse.json(
      { error: `CV oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
