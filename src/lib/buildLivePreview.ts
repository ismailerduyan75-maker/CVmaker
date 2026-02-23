import type { CVFormData } from "@/types/cv";

/** Form verisinden gerçek zamanlı önizleme metni üretir (API çağrısı yok). */
export function buildLivePreview(data: CVFormData): string {
  const lines: string[] = [];

  if (data.fullName?.trim()) {
    lines.push(data.fullName.trim());
    lines.push("");
  }

  const contact: string[] = [];
  if (data.email?.trim()) contact.push(data.email.trim());
  if (data.phone?.trim()) contact.push(data.phone.trim());
  if (data.city?.trim()) contact.push(data.city.trim());
  if (contact.length) {
    lines.push(contact.join(" · "));
    lines.push("");
  }

  if (data.linkedinUrl?.trim() || data.githubUrl?.trim()) {
    const links: string[] = [];
    if (data.linkedinUrl?.trim()) links.push(`LinkedIn: ${data.linkedinUrl.trim()}`);
    if (data.githubUrl?.trim()) links.push(`GitHub: ${data.githubUrl.trim()}`);
    lines.push(links.join(" | "));
    lines.push("");
  }

  if (data.about?.trim()) {
    lines.push("ÖZET");
    lines.push("─".repeat(40));
    lines.push(data.about.trim());
    lines.push("");
  }

  const work = data.workExperience?.filter(
    (e) => e.company?.trim() || e.position?.trim() || e.description?.trim()
  );
  if (work?.length) {
    lines.push("İŞ DENEYİMİ");
    lines.push("─".repeat(40));
    for (const e of work) {
      const title = [e.position?.trim(), e.company?.trim()].filter(Boolean).join(" – ");
      if (title) lines.push(title);
      if (e.date?.trim()) lines.push(e.date.trim());
      if (e.description?.trim()) lines.push(e.description.trim());
      lines.push("");
    }
  }

  const edu = data.education?.filter(
    (e) => e.school?.trim() || e.department?.trim()
  );
  if (edu?.length) {
    lines.push("EĞİTİM");
    lines.push("─".repeat(40));
    for (const e of edu) {
      const title = [e.department?.trim(), e.school?.trim()].filter(Boolean).join(", ");
      if (title) lines.push(title);
      if (e.graduationYear?.trim()) lines.push(e.graduationYear.trim());
      if (e.gpa?.trim()) lines.push(`GPA: ${e.gpa.trim()}`);
      lines.push("");
    }
  }

  if (data.skills?.length) {
    const skillList = data.skills
      .map((s) => (s.name?.trim() ? `${s.name} (${s.level})` : ""))
      .filter(Boolean);
    if (skillList.length) {
      lines.push("BECERİLER");
      lines.push("─".repeat(40));
      lines.push(skillList.join(", "));
      lines.push("");
    }
  }

  if (data.languages?.length) {
    const langList = data.languages
      .map((l) => (l.language?.trim() ? `${l.language}: ${l.level}` : ""))
      .filter(Boolean);
    if (langList.length) {
      lines.push("DİL BECERİLERİ");
      lines.push("─".repeat(40));
      lines.push(langList.join(", "));
      lines.push("");
    }
  }

  const certs = data.certifications?.filter(
    (c) => c.name?.trim() || c.institution?.trim()
  );
  if (certs?.length) {
    lines.push("SERTİFİKALAR");
    lines.push("─".repeat(40));
    for (const c of certs) {
      const line = [c.name?.trim(), c.institution?.trim(), c.date?.trim()]
        .filter(Boolean)
        .join(" – ");
      if (line) lines.push(line);
    }
  }

  return lines.join("\n").trim() || "Formu doldurdukça önizleme burada görünecek.";
}
