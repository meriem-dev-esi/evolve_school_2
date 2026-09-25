"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import type { NavLinkItem, Profile } from "./navbar/types";

let cachedProfile: Profile | null = null;
let cachedProfileLoaded = false;

export default function Navbar() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfileLoaded);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Scroll event listener */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* User profile loader */
  useEffect(() => {
    if (cachedProfileLoaded) {
      return;
    }

    const supabase = createClient();

    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          cachedProfileLoaded = true;
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        cachedProfile = data;
        cachedProfileLoaded = true;
        setProfile(data);
      } catch (err) {
        console.error("[Evolve] Navbar profile load error:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleLogout() {
    cachedProfile = null;
    cachedProfileLoaded = false;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  const displayName = profile?.full_name?.trim() || tNav("profile");

  const navLinks: NavLinkItem[] = [
    { href: "/", label: tNav("home") },
    { href: "/formations", label: tNav("formations") },
    { href: "/ateliers", label: tNav("ateliers") },
    { href: "/community", label: tNav("community") },
    { href: "/messages", label: tNav("messages") },
    { href: "/dashboard", label: tNav("dashboard") },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <DesktopNav
        scrolled={scrolled}
        navLinks={navLinks}
        isActive={isActive}
        langDropdownOpen={langDropdownOpen}
        setLangDropdownOpen={setLangDropdownOpen}
        locale={locale}
        pathname={pathname}
        profile={profile}
        loading={loading}
        displayName={displayName}
        handleLogout={handleLogout}
        tNav={tNav}
      />

      <MobileNav
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pathname={pathname}
        locale={locale}
        navLinks={navLinks}
        isActive={isActive}
        profile={profile}
        displayName={displayName}
        loading={loading}
        handleLogout={handleLogout}
        tNav={tNav}
      />
    </>
  );
}
