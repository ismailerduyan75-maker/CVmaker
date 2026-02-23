"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { SavedCV } from "@/types/cv";
import type { CVFormData } from "@/types/cv";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  getCVsByUser,
  createCV,
  updateCVFirestore,
  deleteCVFirestore,
  generateSlug,
} from "@/lib/cvFirestore";

const STORAGE_CV_LIST = "cv-list";

interface CVListContextValue {
  cvs: SavedCV[];
  addCV: (
    payload: { title: string; formData: CVFormData; cvText: string },
    options?: { customSlug?: string }
  ) => Promise<SavedCV>;
  updateCV: (
    id: string,
    payload: {
      title?: string;
      formData?: CVFormData;
      cvText?: string;
      publicEnabled?: boolean;
      customSlug?: string;
    }
  ) => Promise<void>;
  deleteCV: (id: string) => Promise<void>;
  getCVById: (id: string) => SavedCV | undefined;
  duplicateCV: (id: string) => Promise<SavedCV | undefined>;
  refresh: () => Promise<void>;
  loading: boolean;
}

const CVListContext = createContext<CVListContextValue | null>(null);

function loadCVsFromStorage(): SavedCV[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CV_LIST);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCV[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCVsToStorage(cvs: SavedCV[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_CV_LIST, JSON.stringify(cvs));
  } catch {}
}

export function CVListProvider({ children }: { children: ReactNode }) {
  const { user, isPaidPlan } = useAuth();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const useFirestore = isFirebaseConfigured() && user.isLoggedIn && user.uid;

  const refresh = useCallback(async () => {
    if (useFirestore && user.uid) {
      setLoading(true);
      try {
        const list = await getCVsByUser(user.uid);
        setCvs(list);
      } catch {
        setCvs([]);
      } finally {
        setLoading(false);
      }
    } else {
      setCvs(loadCVsFromStorage());
      setLoading(false);
    }
  }, [useFirestore, user.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCV = useCallback(
    async (
      payload: { title: string; formData: CVFormData; cvText: string },
      options?: { customSlug?: string }
    ): Promise<SavedCV> => {
      if (useFirestore && user.uid) {
        const created = await createCV(user.uid, payload, {
          customSlug: isPaidPlan ? options?.customSlug : undefined,
        });
        await refresh();
        return created;
      }
      const now = new Date().toISOString();
      const newCV: SavedCV = {
        id: crypto.randomUUID(),
        title: payload.title,
        formData: payload.formData,
        cvText: payload.cvText,
        createdAt: now,
        updatedAt: now,
        slug: generateSlug(),
        publicEnabled: false,
        viewCount: 0,
      };
      setCvs((prev) => {
        const next = [...prev, newCV];
        saveCVsToStorage(next);
        return next;
      });
      return newCV;
    },
    [useFirestore, user.uid, isPaidPlan, refresh]
  );

  const updateCV = useCallback(
    async (
      id: string,
      payload: {
        title?: string;
        formData?: CVFormData;
        cvText?: string;
        publicEnabled?: boolean;
        customSlug?: string;
      }
    ) => {
      if (useFirestore && user.uid) {
        await updateCVFirestore(id, user.uid, payload);
        await refresh();
        return;
      }
      setCvs((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...(payload.title !== undefined && { title: payload.title }),
                ...(payload.formData !== undefined && { formData: payload.formData }),
                ...(payload.cvText !== undefined && { cvText: payload.cvText }),
                ...(payload.publicEnabled !== undefined && { publicEnabled: payload.publicEnabled }),
                updatedAt: new Date().toISOString(),
              }
            : c
        );
        saveCVsToStorage(next);
        return next;
      });
    },
    [useFirestore, user.uid, refresh]
  );

  const deleteCV = useCallback(
    async (id: string) => {
      if (useFirestore && user.uid) {
        await deleteCVFirestore(id, user.uid);
        await refresh();
        return;
      }
      setCvs((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveCVsToStorage(next);
        return next;
      });
    },
    [useFirestore, user.uid, refresh]
  );

  const getCVById = useCallback(
    (id: string) => cvs.find((c) => c.id === id),
    [cvs]
  );

  const duplicateCV = useCallback(
    async (id: string): Promise<SavedCV | undefined> => {
      const cv = cvs.find((c) => c.id === id);
      if (!cv) return undefined;
      return addCV({
        title: `${cv.title} (kopya)`,
        formData: cv.formData,
        cvText: cv.cvText,
      });
    },
    [cvs, addCV]
  );

  const value: CVListContextValue = {
    cvs,
    addCV,
    updateCV,
    deleteCV,
    getCVById,
    duplicateCV,
    refresh,
    loading,
  };

  return (
    <CVListContext.Provider value={value}>{children}</CVListContext.Provider>
  );
}

export function useCVList() {
  const ctx = useContext(CVListContext);
  if (!ctx) throw new Error("useCVList must be used within CVListProvider");
  return ctx;
}
