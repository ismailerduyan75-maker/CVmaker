import { z } from "zod";

const phoneRegex = /^(\+90|0)?[0-9]{10}$/;

export const cvFormSchema = z.object({
  fullName: z.string().min(1, "Ad Soyad zorunludur"),
  email: z
    .string()
    .min(1, "E-posta zorunludur")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Geçerli bir e-posta adresi girin"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v.replace(/\s/g, "")), "Geçerli bir telefon numarası girin (örn: 05XX XXX XX XX)"),
  city: z.string().optional(),
  about: z.string().optional(),
  linkedinUrl: z.union([z.string().url("Geçerli bir URL girin"), z.literal("")]).optional(),
  githubUrl: z.union([z.string().url("Geçerli bir URL girin"), z.literal("")]).optional(),
});

export type CVFormSchema = z.infer<typeof cvFormSchema>;
