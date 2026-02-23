export type SkillLevel = "Başlangıç" | "Orta" | "İleri";
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// CV önizleme şablonları
export type CVTemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "professional"
  | "creative"
  | "executive"
  | "academic"
  | "technology"
  | "designer"
  | "europe"
  | "internationalPro"
  | "europeanEnglish";

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  date: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  department: string;
  graduationYear: string;
  gpa: string;
}

export interface SkillTag {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface LanguageSkill {
  id: string;
  language: string;
  level: LanguageLevel;
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  date: string;
}

export type SectionId =
  | "personal"
  | "about"
  | "work"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "links"
  | "photo";

export interface CVFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  about: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillTag[];
  languages: LanguageSkill[];
  certifications: Certificate[];
  linkedinUrl: string;
  githubUrl: string;
  photoUrl: string;
  sectionOrder: SectionId[];
}

export const SKILL_LEVELS: SkillLevel[] = ["Başlangıç", "Orta", "İleri"];
export const LANGUAGE_LEVELS: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "personal",
  "about",
  "work",
  "education",
  "skills",
  "languages",
  "certifications",
  "links",
  "photo",
];

function genId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getDefaultCVFormData(): CVFormData {
  return {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    about: "",
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    linkedinUrl: "",
    githubUrl: "",
    photoUrl: "",
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  };
}

export function createEmptyWorkExperience(): WorkExperience {
  return { id: genId(), company: "", position: "", date: "", description: "" };
}
export function createEmptyEducation(): Education {
  return { id: genId(), school: "", department: "", graduationYear: "", gpa: "" };
}
export function createEmptySkillTag(): SkillTag {
  return { id: genId(), name: "", level: "Orta" };
}
export function createEmptyLanguageSkill(): LanguageSkill {
  return { id: genId(), language: "", level: "B2" };
}
export function createEmptyCertificate(): Certificate {
  return { id: genId(), name: "", institution: "", date: "" };
}

/** Dashboard'da listelenen kayıtlı CV */
export interface SavedCV {
  id: string;
  title: string;
  formData: CVFormData;
  cvText: string;
  createdAt: string; // ISO
  updatedAt: string;
  /** Public URL slug (nanoid veya Pro'da özel slug) */
  slug?: string;
  /** Link aktif mi */
  publicEnabled?: boolean;
  /** Görüntülenme sayısı (Firestore'dan) */
  viewCount?: number;
  /** Pro: kullanıcı özel slug seçti mi */
  customSlug?: boolean;
}
