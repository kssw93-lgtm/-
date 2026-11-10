"use client";

import { useEffect } from "react";

/** Keep the document language accurate when navigating between the Korean and English routes. */
export default function EnglishDocumentLocale() {
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = "en";
    return () => {
      document.documentElement.lang = previousLanguage || "ko";
    };
  }, []);

  return null;
}
