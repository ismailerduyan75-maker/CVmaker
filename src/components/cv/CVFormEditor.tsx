"use client";

import type { CVFormData, WorkExperience, Education, SkillTag, LanguageSkill, Certificate } from "@/types/cv";
import {
  SKILL_LEVELS,
  LANGUAGE_LEVELS,
  createEmptyWorkExperience,
  createEmptyEducation,
  createEmptySkillTag,
  createEmptyLanguageSkill,
  createEmptyCertificate,
} from "@/types/cv";
import { Button } from "@/components/ui/Button";

interface CVFormEditorProps {
  data: CVFormData;
  onChange: (data: CVFormData) => void;
  onGenerateSummary: () => void;
  generateSummaryLoading?: boolean;
}

export function CVFormEditor({
  data,
  onChange,
  onGenerateSummary,
  generateSummaryLoading = false,
}: CVFormEditorProps) {
  const update = (partial: Partial<CVFormData>) => {
    onChange({ ...data, ...partial });
  };

  const setWork = (list: WorkExperience[]) => update({ workExperience: list });
  const setEducation = (list: Education[]) => update({ education: list });
  const setSkills = (list: SkillTag[]) => update({ skills: list });
  const setLanguages = (list: LanguageSkill[]) => update({ languages: list });
  const setCerts = (list: Certificate[]) => update({ certifications: list });

  const addWork = () => setWork([...data.workExperience, createEmptyWorkExperience()]);
  const removeWork = (id: string) => setWork(data.workExperience.filter((e) => e.id !== id));
  const updateWork = (id: string, partial: Partial<WorkExperience>) => {
    setWork(
      data.workExperience.map((e) => (e.id === id ? { ...e, ...partial } : e))
    );
  };

  const addEdu = () => setEducation([...data.education, createEmptyEducation()]);
  const removeEdu = (id: string) => setEducation(data.education.filter((e) => e.id !== id));
  const updateEdu = (id: string, partial: Partial<Education>) => {
    setEducation(
      data.education.map((e) => (e.id === id ? { ...e, ...partial } : e))
    );
  };

  const addSkill = () => setSkills([...data.skills, createEmptySkillTag()]);
  const removeSkill = (id: string) => setSkills(data.skills.filter((s) => s.id !== id));
  const updateSkill = (id: string, partial: Partial<SkillTag>) => {
    setSkills(data.skills.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  };

  const addLang = () => setLanguages([...data.languages, createEmptyLanguageSkill()]);
  const removeLang = (id: string) => setLanguages(data.languages.filter((l) => l.id !== id));
  const updateLang = (id: string, partial: Partial<LanguageSkill>) => {
    setLanguages(
      data.languages.map((l) => (l.id === id ? { ...l, ...partial } : l))
    );
  };

  const addCert = () => setCerts([...data.certifications, createEmptyCertificate()]);
  const removeCert = (id: string) => setCerts(data.certifications.filter((c) => c.id !== id));
  const updateCert = (id: string, partial: Partial<Certificate>) => {
    setCerts(
      data.certifications.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
  };

  const sectionClass = "rounded-xl border border-[var(--border)] bg-[var(--card)] p-4";
  const labelClass = "block text-sm font-medium text-[var(--text-muted)] mb-1";
  const inputClass = "input-base";

  return (
    <div className="space-y-6">
      {/* Kişisel bilgiler */}
      <section className={sectionClass}>
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">Kişisel bilgiler</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Ad Soyad</label>
            <input
              type="text"
              className={inputClass}
              value={data.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className={labelClass}>E-posta</label>
            <input
              type="email"
              className={inputClass}
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className={labelClass}>Telefon</label>
            <input
              type="tel"
              className={inputClass}
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="0532 000 00 00"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Şehir</label>
            <input
              type="text"
              className={inputClass}
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="İstanbul"
            />
          </div>
        </div>
      </section>

      {/* Hakkımda / Profil */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Hakkımda / Profil özeti</h2>
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={onGenerateSummary}
            disabled={generateSummaryLoading}
            loading={generateSummaryLoading}
          >
            AI ile oluştur
          </Button>
        </div>
        <textarea
          className={`${inputClass} min-h-[100px] resize-y`}
          value={data.about}
          onChange={(e) => update({ about: e.target.value })}
          placeholder="Kısa bir özet yazın veya AI ile oluşturun."
          rows={4}
        />
      </section>

      {/* İş deneyimi */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">İş deneyimi</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addWork}>
            + Deneyim ekle
          </Button>
        </div>
        <div className="space-y-4">
          {data.workExperience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 space-y-2"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeWork(exp.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
                >
                  Kaldır
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Şirket</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={exp.company}
                    onChange={(e) => updateWork(exp.id, { company: e.target.value })}
                    placeholder="Şirket adı"
                  />
                </div>
                <div>
                  <label className={labelClass}>Pozisyon</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={exp.position}
                    onChange={(e) => updateWork(exp.id, { position: e.target.value })}
                    placeholder="Pozisyon"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Tarih</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={exp.date}
                    onChange={(e) => updateWork(exp.id, { date: e.target.value })}
                    placeholder="2020 – 2023"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Açıklama</label>
                  <textarea
                    className={`${inputClass} min-h-[80px] resize-y`}
                    value={exp.description}
                    onChange={(e) => updateWork(exp.id, { description: e.target.value })}
                    placeholder="Görevler ve başarılar..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Eğitim */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Eğitim</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addEdu}>
            + Eğitim ekle
          </Button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 space-y-2"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeEdu(edu.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
                >
                  Kaldır
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Okul / Üniversite</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.school}
                    onChange={(e) => updateEdu(edu.id, { school: e.target.value })}
                    placeholder="Üniversite adı"
                  />
                </div>
                <div>
                  <label className={labelClass}>Bölüm</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.department}
                    onChange={(e) => updateEdu(edu.id, { department: e.target.value })}
                    placeholder="Bölüm"
                  />
                </div>
                <div>
                  <label className={labelClass}>Mezuniyet yılı</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.graduationYear}
                    onChange={(e) => updateEdu(edu.id, { graduationYear: e.target.value })}
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className={labelClass}>GPA (opsiyonel)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={edu.gpa}
                    onChange={(e) => updateEdu(edu.id, { gpa: e.target.value })}
                    placeholder="3.5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beceriler */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Beceriler</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addSkill}>
            + Beceri ekle
          </Button>
        </div>
        <div className="space-y-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className={`${inputClass} flex-1 min-w-[120px]`}
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                placeholder="Beceri adı"
              />
              <select
                className={inputClass}
                value={skill.level}
                onChange={(e) =>
                  updateSkill(skill.id, { level: e.target.value as SkillTag["level"] })
                }
                style={{ width: "130px" }}
              >
                {SKILL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dil becerileri */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Dil becerileri</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addLang}>
            + Dil ekle
          </Button>
        </div>
        <div className="space-y-3">
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className={`${inputClass} flex-1 min-w-[100px]`}
                value={lang.language}
                onChange={(e) => updateLang(lang.id, { language: e.target.value })}
                placeholder="Dil"
              />
              <select
                className={inputClass}
                value={lang.level}
                onChange={(e) =>
                  updateLang(lang.id, { level: e.target.value as LanguageSkill["level"] })
                }
                style={{ width: "90px" }}
              >
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeLang(lang.id)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sertifikalar */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Sertifikalar</h2>
          <Button type="button" variant="secondary" className="text-xs" onClick={addCert}>
            + Sertifika ekle
          </Button>
        </div>
        <div className="space-y-4">
          {data.certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 space-y-2"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
                >
                  Kaldır
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Sertifika adı</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={cert.name}
                    onChange={(e) => updateCert(cert.id, { name: e.target.value })}
                    placeholder="Sertifika"
                  />
                </div>
                <div>
                  <label className={labelClass}>Kurum</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={cert.institution}
                    onChange={(e) => updateCert(cert.id, { institution: e.target.value })}
                    placeholder="Kurum"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tarih</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={cert.date}
                    onChange={(e) => updateCert(cert.id, { date: e.target.value })}
                    placeholder="2023"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Linkler */}
      <section className={sectionClass}>
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">Linkler</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              type="url"
              className={inputClass}
              value={data.linkedinUrl}
              onChange={(e) => update({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input
              type="url"
              className={inputClass}
              value={data.githubUrl}
              onChange={(e) => update({ githubUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </section>

      {/* Fotoğraf URL (opsiyonel) */}
      <section className={sectionClass}>
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">Fotoğraf</h2>
        <div>
          <label className={labelClass}>Fotoğraf URL (opsiyonel)</label>
          <input
            type="url"
            className={inputClass}
            value={data.photoUrl}
            onChange={(e) => update({ photoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </section>
    </div>
  );
}
