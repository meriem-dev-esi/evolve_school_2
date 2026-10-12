"use client";

import { useEffect } from "react";
import { initPreloader } from "@/lib/intro/preloader";

export default function IntroPreloader({ locale }: { locale?: string } = {}) {
  useEffect(() => {
    initPreloader(locale);
  }, [locale]);

  return null;
}
