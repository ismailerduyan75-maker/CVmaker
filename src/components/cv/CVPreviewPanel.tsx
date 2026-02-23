"use client";

import type { CVFormData, CVTemplateId } from "@/types/cv";

interface CVPreviewPanelProps {
  formData: CVFormData;
  cvText: string | null;
  template: CVTemplateId;
  className?: string;
}

/** Canlı önizleme: cvText varsa metin olarak, yoksa form verisinden CV layout. */
export function CVPreviewPanel({ formData, cvText, template, className = "" }: CVPreviewPanelProps) {
  const hasGeneratedText = cvText != null && cvText.trim().length > 0;

  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col ${className}`}
    >
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">Canlı önizleme</h3>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-5">
        <div
          className="mx-auto max-w-[210mm] rounded-lg bg-white text-slate-800 shadow-inner min-h-[400px]"
          style={{ fontFamily: "system-ui, sans-serif", fontSize: "11pt", lineHeight: 1.5 }}
        >
          {hasGeneratedText ? (
            <div className="p-6 space-y-2">
              {cvText.split("\n\n").map((para, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {para.trim() || "\u00A0"}
                </p>
              ))}
            </div>
          ) : (
            <TemplatePreview template={template} data={formData} />
          )}
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ template, data }: { template: CVTemplateId; data: CVFormData }) {
  switch (template) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "professional":
      return <ProfessionalTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "academic":
      return <AcademicTemplate data={data} />;
    case "technology":
      return <TechnologyTemplate data={data} />;
    case "designer":
      return <DesignerTemplate data={data} />;
    case "europe":
      return <EuropeTemplate data={data} />;
    case "internationalPro":
      return <InternationalProTemplate data={data} />;
    case "europeanEnglish":
      return <EuropeanEnglishTemplate data={data} />;
    case "classic":
    default:
      return <ClassicTemplate data={data} />;
  }
}

function ClassicTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="p-6">
      <FormDataPreview data={data} />
    </div>
  );
}

function FormDataPreview({ data }: { data: CVFormData }) {
  const hasPersonal =
    data.fullName || data.email || data.phone || data.city;
  const hasAbout = data.about?.trim();
  const hasWork = data.workExperience?.some(
    (e) => e.company || e.position || e.description
  );
  const hasEdu = data.education?.some(
    (e) => e.school || e.department
  );
  const hasSkills = data.skills?.length;
  const hasLangs = data.languages?.length;
  const hasCerts = data.certifications?.some(
    (c) => c.name || c.institution
  );
  const hasLinks = data.linkedinUrl || data.githubUrl;

  if (
    !hasPersonal &&
    !hasAbout &&
    !hasWork &&
    !hasEdu &&
    !hasSkills &&
    !hasLangs &&
    !hasCerts &&
    !hasLinks
  ) {
    return (
      <p className="text-slate-400 text-sm">
        Formu doldurdukça önizleme burada görünecek. &quot;CV Metnini Oluştur&quot; ile AI metni oluşturabilirsiniz.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {hasPersonal && (
        <div className="border-b border-slate-200 pb-2">
          {data.fullName && (
            <h1 className="text-lg font-bold text-slate-900">{data.fullName}</h1>
          )}
          <p className="text-xs text-slate-600 mt-0.5">
            [ {[data.email, data.phone, data.city].filter(Boolean).join(" · ")} ]
          </p>
        </div>
      )}

      {hasAbout && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Özet / Hakkımda
          </h2>
          <p className="text-slate-700 whitespace-pre-wrap text-sm">{data.about}</p>
        </section>
      )}

      {hasWork && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            İş deneyimi
          </h2>
          <ul className="space-y-2">
            {data.workExperience
              .filter((e) => e.company || e.position || e.description)
              .map((e) => (
                <li key={e.id}>
                  <p className="font-semibold text-slate-800 text-sm">
                    {e.position}
                    {e.company && ` · ${e.company}`}
                  </p>
                  {e.date && (
                    <p className="text-xs text-slate-500">{e.date}</p>
                  )}
                  {e.description && (
                    <p className="text-xs text-slate-600 mt-0.5 whitespace-pre-wrap">
                      {e.description}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}

      {hasEdu && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Eğitim
          </h2>
          <ul className="space-y-1">
            {data.education
              .filter((e) => e.school || e.department)
              .map((e) => (
                <li key={e.id}>
                  <p className="font-semibold text-slate-800 text-sm">
                    {e.department}
                    {e.school && ` · ${e.school}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {e.graduationYear}
                    {e.gpa && ` · GPA ${e.gpa}`}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      )}

      {hasSkills && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Beceriler
          </h2>
          <p className="text-sm text-slate-700">
            {data.skills.map((s) => `${s.name} (${s.level})`).join(", ")}
          </p>
        </section>
      )}

      {hasLangs && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Diller
          </h2>
          <p className="text-sm text-slate-700">
            {data.languages.map((l) => `${l.language} (${l.level})`).join(", ")}
          </p>
        </section>
      )}

      {hasCerts && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Sertifikalar
          </h2>
          <ul className="space-y-0.5">
            {data.certifications
              .filter((c) => c.name || c.institution)
              .map((c) => (
                <li key={c.id} className="text-sm text-slate-700">
                  {c.name}
                  {c.institution && ` · ${c.institution}`}
                  {c.date && ` (${c.date})`}
                </li>
              ))}
          </ul>
        </section>
      )}

      {hasLinks && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
            Linkler
          </h2>
          <p className="text-sm text-slate-700 break-all">
            {data.linkedinUrl && (
              <span>LinkedIn: {data.linkedinUrl}</span>
            )}
            {data.linkedinUrl && data.githubUrl && " · "}
            {data.githubUrl && (
              <span>GitHub: {data.githubUrl}</span>
            )}
          </p>
        </section>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: CVFormData }) {
  const hasAbout = data.about?.trim();

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          {data.fullName && (
            <h1 className="text-xl font-semibold leading-tight">{data.fullName}</h1>
          )}
          <p className="text-xs text-sky-100 mt-1">
            {[data.city, data.email, data.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
        {hasAbout && (
          <p className="text-xs max-w-md text-sky-100/90 line-clamp-3">
            {data.about}
          </p>
        )}
      </div>
      <div className="p-6 grid gap-4 md:grid-cols-[1.2fr,1.4fr]">
        <div className="space-y-4">
          {/* Özet, Beceriler, Diller */}
          <FormDataPreview
            data={{
              ...data,
              workExperience: [],
              education: [],
              certifications: [],
            }}
          />
        </div>
        <div className="space-y-4 border-l border-slate-200 pl-4">
          {/* İş, Eğitim, Sertifikalar */}
          <FormDataPreview
            data={{
              ...data,
              about: "",
              skills: [],
              languages: [],
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="p-8">
      <div className="border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
        <FormDataPreview data={data} />
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full flex">
      <aside className="w-2/5 max-w-[40%] bg-slate-900 text-slate-100 px-4 py-5 space-y-4 text-xs">
        <div>
          {data.fullName && (
            <h1 className="text-base font-semibold text-white mb-1">{data.fullName}</h1>
          )}
          <p className="text-[11px] text-slate-300">
            {[data.email, data.phone, data.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5 mb-1">
            Beceriler
          </h2>
          <p className="text-[11px] text-slate-100/90">
            {data.skills.length
              ? data.skills.map((s) => `${s.name} (${s.level})`).join(", ")
              : "Henüz eklenmedi"}
          </p>
        </div>
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5 mb-1">
            Diller
          </h2>
          <p className="text-[11px] text-slate-100/90">
            {data.languages.length
              ? data.languages.map((l) => `${l.language} (${l.level})`).join(", ")
              : "Henüz eklenmedi"}
          </p>
        </div>
        {(data.linkedinUrl || data.githubUrl) && (
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300 border-b border-cyan-400/40 pb-0.5 mb-1">
              Linkler
            </h2>
            <p className="text-[11px] text-slate-100/90 break-all">
              {data.linkedinUrl && <>LinkedIn: {data.linkedinUrl}</>}
              {data.linkedinUrl && data.githubUrl && <span> · </span>}
              {data.githubUrl && <>GitHub: {data.githubUrl}</>}
            </p>
          </div>
        )}
      </aside>
      <main className="flex-1 bg-white px-6 py-5 text-sm">
        <FormDataPreview data={data} />
      </main>
    </div>
  );
}

function CreativeTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5">
      <div className="border-l-4 border-sky-500 rounded-lg bg-white/90 shadow-md px-6 py-5">
        <FormDataPreview data={data} />
      </div>
    </div>
  );
}

// 6. Executive - gold line, photo top right, dark navy headers
const NAVY = "#0f172a";
function ExecutiveTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-0.5 w-full shrink-0 bg-amber-500" />
      <div className="flex-1 flex p-5 gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              {data.fullName && (
                <h1 className="text-xl font-semibold text-slate-900" style={{ color: NAVY }}>
                  {data.fullName}
                </h1>
              )}
              <p className="text-xs text-slate-600 mt-1">
                {[data.email, data.phone, data.city].filter(Boolean).join(" · ")}
              </p>
            </div>
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="" className="w-16 h-20 object-cover rounded border border-slate-200" />
            ) : (
              <div className="w-16 h-20 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                Fotoğraf
              </div>
            )}
          </div>
          <div className="pt-3 space-y-3 text-sm">
            <SectionNavy title="Özet" content={data.about} />
            <SectionNavy title="İş deneyimi">
              {data.workExperience
                ?.filter((e) => e.company || e.position || e.description)
                .map((e) => (
                  <div key={e.id} className="mb-2">
                    <p className="font-semibold text-slate-800">{e.position} · {e.company}</p>
                    <p className="text-xs text-slate-500">{e.date}</p>
                    {e.description && <p className="text-xs text-slate-600 mt-0.5 whitespace-pre-wrap">{e.description}</p>}
                  </div>
                ))}
            </SectionNavy>
            <SectionNavy title="Eğitim">
              {data.education
                ?.filter((e) => e.school || e.department)
                .map((e) => (
                  <p key={e.id} className="text-xs text-slate-700">{e.department}, {e.school} ({e.graduationYear})</p>
                ))}
            </SectionNavy>
            <SectionNavy title="Beceriler">
              <p className="text-xs text-slate-700">{data.skills?.map((s) => `${s.name} (${s.level})`).join(", ")}</p>
            </SectionNavy>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionNavy({
  title,
  children,
  content,
}: { title: string; children?: React.ReactNode; content?: string }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide pb-0.5 mb-1 border-b border-slate-200" style={{ color: NAVY }}>
        {title}
      </h2>
      {content != null && <p className="text-xs text-slate-700 whitespace-pre-wrap">{content}</p>}
      {children}
    </section>
  );
}

// 7. Academic - emblem area top left, publications section
function AcademicTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full flex bg-white">
      <div className="w-14 shrink-0 border-r border-slate-200 flex flex-col items-center pt-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 text-[10px]">
          Amblem
        </div>
      </div>
      <div className="flex-1 min-w-0 p-5">
        <div className="border-b border-slate-200 pb-2 mb-3">
          {data.fullName && <h1 className="text-lg font-bold text-slate-900">{data.fullName}</h1>}
          <p className="text-xs text-slate-600">{[data.email, data.phone, data.city].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="space-y-3 text-sm">
          <AcademicSection title="Özet / Araştırma alanları" content={data.about} />
          <AcademicSection title="Eğitim">
            {data.education?.filter((e) => e.school || e.department).map((e) => (
              <p key={e.id} className="text-xs">{e.department}, {e.school} — {e.graduationYear}{e.gpa ? ` (GPA: ${e.gpa})` : ""}</p>
            ))}
          </AcademicSection>
          <AcademicSection title="İş deneyimi">
            {data.workExperience?.filter((e) => e.company || e.position).map((e) => (
              <div key={e.id} className="mb-1">
                <p className="text-xs font-medium">{e.position}, {e.company} ({e.date})</p>
                {e.description && <p className="text-xs text-slate-600">{e.description}</p>}
              </div>
            ))}
          </AcademicSection>
          <AcademicSection title="Yayınlar ve araştırmalar">
            {data.certifications?.filter((c) => c.name || c.institution).map((c) => (
              <p key={c.id} className="text-xs">{c.name}. {c.institution}{c.date ? `, ${c.date}` : ""}</p>
            ))}
            {(!data.certifications?.length || data.certifications.every((c) => !c.name && !c.institution)) && (
              <p className="text-xs text-slate-400">Yayın / proje ekleyebilirsiniz.</p>
            )}
          </AcademicSection>
          <AcademicSection title="Beceriler ve diller">
            <p className="text-xs">{data.skills?.map((s) => s.name).join(", ")} · {data.languages?.map((l) => `${l.language} (${l.level})`).join(", ")}</p>
          </AcademicSection>
        </div>
      </div>
    </div>
  );
}

function AcademicSection({ title, children, content }: { title: string; children?: React.ReactNode; content?: string }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 border-b border-slate-200 pb-0.5 mb-1">
        {title}
      </h2>
      {content != null && <p className="text-xs text-slate-700 whitespace-pre-wrap">{content}</p>}
      {children}
    </section>
  );
}

// 8. Technology - terminal aesthetic, dark theme, skill badges, GitHub/LinkedIn
function TechnologyTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full bg-[#0d1117] text-slate-200 p-4 font-mono text-xs">
      <div className="text-emerald-400 mb-3">$ cat cv.txt</div>
      <div className="space-y-3">
        <div>
          <span className="text-slate-500"># </span>
          {data.fullName && <span className="text-white font-semibold">{data.fullName}</span>}
          <p className="text-slate-400 mt-0.5 pl-4">
            {[data.email, data.phone, data.city].filter(Boolean).join(" | ")}
          </p>
          <div className="flex gap-2 mt-1 pl-4">
            {data.linkedinUrl && (
              <a href={data.linkedinUrl} className="text-emerald-400 hover:underline" rel="noreferrer" target="_blank">
                [LinkedIn]
              </a>
            )}
            {data.githubUrl && (
              <a href={data.githubUrl} className="text-emerald-400 hover:underline" rel="noreferrer" target="_blank">
                [GitHub]
              </a>
            )}
          </div>
        </div>
        {data.about && (
          <div>
            <span className="text-slate-500"># about</span>
            <p className="text-slate-300 pl-4 mt-0.5 whitespace-pre-wrap">{data.about}</p>
          </div>
        )}
        <div>
          <span className="text-slate-500"># experience</span>
          <div className="pl-4 mt-0.5 space-y-1">
            {data.workExperience?.filter((e) => e.company || e.position).map((e) => (
              <div key={e.id}>
                <span className="text-white">{e.position}</span>
                <span className="text-slate-500"> @ </span>
                <span className="text-emerald-300">{e.company}</span>
                <span className="text-slate-500"> ({e.date})</span>
                {e.description && <p className="text-slate-400 mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-slate-500"># education</span>
          <div className="pl-4 mt-0.5">
            {data.education?.filter((e) => e.school || e.department).map((e) => (
              <p key={e.id}><span className="text-emerald-300">{e.department}</span>, {e.school} — {e.graduationYear}</p>
            ))}
          </div>
        </div>
        <div>
          <span className="text-slate-500"># skills</span>
          <div className="pl-4 mt-1 flex flex-wrap gap-1">
            {data.skills?.map((s) => (
              <span key={s.id} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-slate-500"># languages</span>
          <p className="text-slate-400 pl-4 mt-0.5">{data.languages?.map((l) => `${l.language}: ${l.level}`).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}

// 9. Designer - asymmetric layout, bold typography, colored strip left, portfolio prominent
function DesignerTemplate({ data }: { data: CVFormData }) {
  const portfolioUrl = data.githubUrl || data.linkedinUrl;
  return (
    <div className="h-full flex bg-white">
      <div className="w-2 shrink-0 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-rose-500" />
      <div className="flex-1 min-w-0 p-5">
        <div className="mb-4">
          {data.fullName && (
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.fullName}</h1>
          )}
          <p className="text-xs text-slate-500 mt-1">{[data.email, data.phone, data.city].filter(Boolean).join(" · ")}</p>
          {portfolioUrl && (
            <a href={portfolioUrl} className="inline-block mt-2 text-sm font-bold text-violet-600 hover:underline">
              Portfolio / Link →
            </a>
          )}
        </div>
        {data.about && (
          <p className="text-sm text-slate-700 mb-4 leading-relaxed border-l-2 border-violet-300 pl-3">{data.about}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">Deneyim</h2>
            {data.workExperience?.filter((e) => e.company || e.position).map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-bold text-slate-800 text-sm">{e.position}</p>
                <p className="text-xs text-slate-500">{e.company} · {e.date}</p>
                {e.description && <p className="text-xs text-slate-600 mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">Eğitim</h2>
            {data.education?.filter((e) => e.school || e.department).map((e) => (
              <p key={e.id} className="text-sm font-semibold text-slate-800">{e.department}, {e.school}</p>
            ))}
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mt-3 mb-1">Beceriler</h2>
            <p className="text-xs text-slate-600">{data.skills?.map((s) => s.name).join(" · ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. Europe (Europass) - EU flag colors, standard European format
const EU_BLUE = "#003399";
const EU_GOLD = "#FFCC00";

function EuropassEmblem() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={32}
        height={20}
        viewBox="0 0 32 20"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="9" fill={EU_BLUE} />
        <g fill={EU_GOLD}>
          {/* 12 küçük yıldız noktası */}
          <circle cx="10" cy="3" r="0.7" />
          <circle cx="13.5" cy="4" r="0.7" />
          <circle cx="16" cy="6.5" r="0.7" />
          <circle cx="17" cy="10" r="0.7" />
          <circle cx="16" cy="13.5" r="0.7" />
          <circle cx="13.5" cy="16" r="0.7" />
          <circle cx="10" cy="17" r="0.7" />
          <circle cx="6.5" cy="16" r="0.7" />
          <circle cx="4" cy="13.5" r="0.7" />
          <circle cx="3" cy="10" r="0.7" />
          <circle cx="4" cy="6.5" r="0.7" />
          <circle cx="6.5" cy="4" r="0.7" />
        </g>
      </svg>
      <span
        className="text-[10px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: EU_BLUE }}
      >
        Europass
      </span>
    </div>
  );
}

function EuropeTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full bg-white">
      <div className="h-2 flex">
        <div className="flex-1" style={{ backgroundColor: EU_BLUE }} />
        <div className="w-8" style={{ backgroundColor: EU_GOLD }} />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <EuropassEmblem />
        </div>
        <div className="border-b-2 border-slate-200 pb-3 mb-3">
          <h1 className="text-lg font-bold text-slate-900">{data.fullName || "Ad Soyad"}</h1>
          <p className="text-xs text-slate-600 mt-1">
            {[data.email, data.phone, data.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <EuroSection title="Kişisel bilgiler / Özet" content={data.about} />
          <EuroSection title="İş deneyimi">
            {data.workExperience?.filter((e) => e.company || e.position).map((e) => (
              <div key={e.id} className="mb-2">
                <p className="font-semibold text-slate-800">{e.position} — {e.company}</p>
                <p className="text-xs text-slate-500">{e.date}</p>
                {e.description && <p className="text-xs text-slate-600">{e.description}</p>}
              </div>
            ))}
          </EuroSection>
          <EuroSection title="Eğitim ve öğretim">
            {data.education?.filter((e) => e.school || e.department).map((e) => (
              <p key={e.id} className="text-xs">{e.department}, {e.school} ({e.graduationYear})</p>
            ))}
          </EuroSection>
          <EuroSection title="Beceriler">
            <p className="text-xs">{data.skills?.map((s) => `${s.name} (${s.level})`).join(", ")}</p>
          </EuroSection>
          <EuroSection title="Dil becerileri">
            <p className="text-xs">{data.languages?.map((l) => `${l.language} — ${l.level}`).join(", ")}</p>
          </EuroSection>
          {(data.linkedinUrl || data.githubUrl) && (
            <EuroSection title="Ek bilgiler">
              <p className="text-xs break-all">LinkedIn: {data.linkedinUrl} · GitHub: {data.githubUrl}</p>
            </EuroSection>
          )}
        </div>
      </div>
    </div>
  );
}

function EuroSection({ title, children, content }: { title: string; children?: React.ReactNode; content?: string }) {
  return (
    <section>
      <h2
        className="text-xs font-semibold uppercase tracking-wide pb-0.5 mb-1 border-b-2"
        style={{ borderColor: EU_BLUE, color: EU_BLUE }}
      >
        {title}
      </h2>
      {content != null && <p className="text-xs text-slate-700 whitespace-pre-wrap">{content}</p>}
      {children}
    </section>
  );
}

// 11. International Pro – English, ATS-friendly, single column
function InternationalProTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full bg-white text-slate-900 p-6 text-sm">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold">{data.fullName || "Full Name"}</h1>
          <p className="text-xs text-slate-600 mt-1">
            {[data.email, data.phone, data.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-col items-end text-xs text-slate-500 gap-1">
          <div className="flex gap-2">
            {data.linkedinUrl && <span className="px-1 py-0.5 rounded border border-slate-300">in</span>}
            {data.githubUrl && <span className="px-1 py-0.5 rounded border border-slate-300">{"</>"}</span>}
          </div>
          {data.linkedinUrl && <span className="break-all max-w-[140px]">{data.linkedinUrl}</span>}
          {data.githubUrl && <span className="break-all max-w-[140px]">{data.githubUrl}</span>}
        </div>
      </header>
      <div className="space-y-3">
        {data.about && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Summary
            </h2>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{data.about}</p>
          </section>
        )}
        {data.workExperience?.some((e) => e.company || e.position || e.description) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Work Experience
            </h2>
            <ul className="space-y-2">
              {data.workExperience
                .filter((e) => e.company || e.position || e.description)
                .map((e) => (
                  <li key={e.id}>
                    <p className="font-semibold text-slate-900 text-sm">
                      {e.position} {e.company && `· ${e.company}`}
                    </p>
                    {e.date && <p className="text-xs text-slate-500">{e.date}</p>}
                    {e.description && (
                      <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap">{e.description}</p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}
        {data.education?.some((e) => e.school || e.department) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Education
            </h2>
            <ul className="space-y-1">
              {data.education
                .filter((e) => e.school || e.department)
                .map((e) => (
                  <li key={e.id}>
                    <p className="font-semibold text-slate-900 text-sm">
                      {e.department}
                      {e.school && ` · ${e.school}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {e.graduationYear}
                      {e.gpa && ` · GPA ${e.gpa}`}
                    </p>
                  </li>
                ))}
            </ul>
          </section>
        )}
        {data.skills?.length ? (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Skills
            </h2>
            <p className="text-xs text-slate-800">
              {data.skills.map((s) => `${s.name} (${s.level})`).join(", ")}
            </p>
          </section>
        ) : null}
        {data.languages?.length ? (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Languages
            </h2>
            <p className="text-xs text-slate-800">
              {data.languages.map((l) => `${l.language} (${l.level})`).join(", ")}
            </p>
          </section>
        ) : null}
        {data.certifications?.some((c) => c.name || c.institution) && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
              Certifications
            </h2>
            <ul className="space-y-0.5 text-xs">
              {data.certifications
                .filter((c) => c.name || c.institution)
                .map((c) => (
                  <li key={c.id}>
                    {c.name}
                    {c.institution && ` · ${c.institution}`}
                    {c.date && ` (${c.date})`}
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// 12. European English – English Europass-like layout
function EuropeanEnglishTemplate({ data }: { data: CVFormData }) {
  return (
    <div className="h-full bg-white text-slate-900">
      <div className="h-2 bg-[#003399]" />
      <div className="flex">
        <aside className="w-32 shrink-0 border-r border-slate-200 p-4 flex flex-col items-center gap-3">
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="" className="w-16 h-20 object-cover rounded border border-slate-300" />
          ) : (
            <div className="w-16 h-20 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
              Photo
            </div>
          )}
        </aside>
        <main className="flex-1 p-5 text-sm">
          <div className="border-b border-slate-200 pb-3 mb-3">
            <div className="mb-2">
              <EuropassEmblem />
            </div>
            <h1 className="text-lg font-bold">{data.fullName || "Full Name"}</h1>
          </div>
          <div className="space-y-3">
            <EuroEnSection title="Personal Information">
              <p className="text-xs">
                {[data.email, data.phone, data.city].filter(Boolean).join(" · ")}
              </p>
            </EuroEnSection>
            <EuroEnSection title="Work Experience">
              {data.workExperience?.filter((e) => e.company || e.position).map((e) => (
                <div key={e.id} className="mb-1">
                  <p className="text-xs font-semibold">
                    {e.position} — {e.company}
                  </p>
                  <p className="text-[11px] text-slate-500">{e.date}</p>
                  {e.description && <p className="text-[11px] text-slate-700">{e.description}</p>}
                </div>
              ))}
            </EuroEnSection>
            <EuroEnSection title="Education and Training">
              {data.education?.filter((e) => e.school || e.department).map((e) => (
                <p key={e.id} className="text-xs">
                  {e.department}, {e.school} ({e.graduationYear})
                </p>
              ))}
            </EuroEnSection>
            <EuroEnSection title="Language Skills">
              <p className="text-xs">
                {data.languages?.map((l) => `${l.language}: ${l.level}`).join(", ")}
              </p>
            </EuroEnSection>
            <EuroEnSection title="Digital Skills">
              <p className="text-xs">
                {data.skills?.map((s) => s.name).join(", ")}
              </p>
            </EuroEnSection>
          </div>
        </main>
      </div>
    </div>
  );
}

function EuroEnSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#003399] border-b border-[#003399]/40 pb-0.5 mb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}
