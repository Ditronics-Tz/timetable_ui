import { createContext, useContext, useState, useCallback, useMemo } from "react";

const LANG_KEY = "sacas_lang";

export const translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.timetable": "Timetable",
    "nav.preview": "Preview",
    "nav.coursePreview": "Course timetable",
    "nav.exams": "Exams",
    "nav.myExams": "My Exams",
    "nav.rooms": "Rooms",
    "nav.classes": "Classes",
    "nav.modules": "Modules",
    "nav.subjects": "Subjects",
    "nav.staff": "Staff",
    "nav.programs": "Programs",
    "nav.departments": "Departments",
    "nav.allocations": "Allocations",
    "nav.members": "Members",
    "nav.analytics": "Analytics",
    "nav.institutionSettings": "Institution Settings",
    "nav.superadmin": "Super admin",
    "nav.institutions": "Institutions",
    "nav.platformUsers": "Platform Users",
    "nav.platformStats": "Platform Stats",
    "nav.generationSettings": "Generation Settings",
    "nav.auditLog": "Audit Log",
    "nav.mySchedule": "My Schedule",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.expand": "Expand",
    "nav.collapse": "Collapse",
    "support.banner": "Support read-only view",
    "support.exit": "Exit institution view",
    "report.button": "Report a problem",
    "report.title": "Report a problem",
    "report.description": "Share what went wrong. Your current page, role, and last API error are attached automatically.",
    "report.submit": "Submit report",
    "report.close": "Close",
    "report.saved": "Problem report recorded for pilot support.",
    "dashboard.welcome": "Welcome",
    "dashboard.onboardingTitle": "Institution Setup Progress",
    "dashboard.onboardingSubtitle": "Complete these steps in order to generate your first conflict-free timetable.",
  },
  sw: {
    "nav.dashboard": "Dashibodi",
    "nav.timetable": "Ratiba",
    "nav.preview": "Hakiki Ratiba",
    "nav.coursePreview": "Ratiba ya Programu",
    "nav.exams": "Mitihani",
    "nav.myExams": "Mitihani Yangu",
    "nav.rooms": "Vyumba",
    "nav.classes": "Madarasa",
    "nav.modules": "Moduli",
    "nav.subjects": "Masomo",
    "nav.staff": "Wafanyakazi",
    "nav.programs": "Programu (Course)",
    "nav.departments": "Idara (Faculty)",
    "nav.allocations": "Mgawanyo wa Moduli",
    "nav.members": "Wanachama",
    "nav.analytics": "Takwimu",
    "nav.institutionSettings": "Mipangilio ya Taasisi",
    "nav.superadmin": "Msimamizi Mkuu",
    "nav.institutions": "Taasisi",
    "nav.platformUsers": "Watumiaji wa Mfumo",
    "nav.platformStats": "Takwimu za Mfumo",
    "nav.generationSettings": "Mipangilio ya Uzalishaji",
    "nav.auditLog": "Kumbukumbu za Ukaguzi",
    "nav.mySchedule": "My Schedule",
    "nav.settings": "Mipangilio",
    "nav.logout": "Ondoka",
    "nav.expand": "Panua",
    "nav.collapse": "Kunja",
    "support.banner": "Mwonekano wa Msaada (Soma tu)",
    "support.exit": "Toka kwenye taasisi",
    "report.button": "Ripoti tatizo",
    "report.title": "Ripoti tatizo",
    "report.description": "Eleza kilichotokea. Ukurasa huu, jukumu lako, na kosa la mwisho la API vimeambatanishwa.",
    "report.submit": "Tuma ripoti",
    "report.close": "Funga",
    "report.saved": "Ripoti ya tatizo imehifadhiwa.",
    "dashboard.welcome": "Karibu",
    "dashboard.onboardingTitle": "Hatua za Kuandaa Taasisi",
    "dashboard.onboardingSubtitle": "Kamilisha hatua hizi ili kutengeneza ratiba yako ya kwanza.",
  },
};

export function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "sw" ? "sw" : "en";
  } catch {
    return "en";
  }
}

export function setSavedLanguage(lang) {
  const next = lang === "sw" ? "sw" : "en";
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    // ignore storage errors
  }
  return next;
}

export function translate(key, fallback, lang = getSavedLanguage()) {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || fallback || key;
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => getSavedLanguage());

  const setLang = useCallback((nextLang) => {
    const normalized = setSavedLanguage(nextLang);
    setLangState(normalized);
  }, []);

  const t = useCallback(
    (key, fallback) => translate(key, fallback, lang),
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  const [fallbackLang, setFallbackLang] = useState(() => getSavedLanguage());

  if (context) return context;

  return {
    lang: fallbackLang,
    setLang: (next) => {
      const normalized = setSavedLanguage(next);
      setFallbackLang(normalized);
    },
    t: (key, fallback) => translate(key, fallback, fallbackLang),
  };
}
