"use client";

import { Globe, LogOut, User } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NavLinkItem, Profile } from "./types";

interface DesktopNavProps {
  scrolled: boolean;
  navLinks: NavLinkItem[];
  isActive: (href: string) => boolean;
  langDropdownOpen: boolean;
  setLangDropdownOpen: (open: boolean) => void;
  locale: string;
  pathname: string;
  profile: Profile | null;
  loading: boolean;
  displayName: string;
  handleLogout: () => void;
  tNav: (key: string) => string;
}

export default function DesktopNav({
  scrolled,
  navLinks,
  isActive,
  langDropdownOpen,
  setLangDropdownOpen,
  locale,
  pathname,
  profile,
  loading,
  displayName,
  handleLogout,
  tNav,
}: DesktopNavProps) {
  return (
    <nav className="fixed left-1/2 top-5 z-50 hidden w-[calc(100%-32px)] max-w-[1280px] -translate-x-1/2 lg:block transition-all duration-300">
      <div
        className={`flex h-[68px] items-center rounded-full border border-white/[0.10] bg-canvas/75 px-3 backdrop-blur-2xl transition-all duration-300 ${
          scrolled ? "bg-canvas/90 border-white/[0.14] shadow-2xl" : "shadow-lg"
        }`}
      >
        {/* LOGO */}
        <Link
          href="/"
          prefetch={true}
          className="group flex shrink-0 items-center rounded-full px-4"
        >
          <Image
            src="/logo.png"
            alt="Evolve"
            width={140}
            height={44}
            priority
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Vertical divider */}
        <div className="mx-1 h-7 w-px bg-white/[0.08]" />

        {/* CENTER NAVIGATION */}
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`relative rounded-full px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? "bg-lime-400/[0.10] text-lime-400"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {link.label}

                  {active && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-lime-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: LANGUAGE & AUTH */}
        <div className="flex shrink-0 items-center gap-1">
          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold uppercase tracking-wider text-white/55 transition hover:bg-white/[0.06] hover:text-white"
              aria-label={tNav("changeLanguage")}
            >
              <Globe className="h-3.5 w-3.5 text-lime-400" />
              <span>{locale}</span>
              <span className="text-xs opacity-40">▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute end-0 top-12 z-50 w-32 overflow-hidden rounded-2xl border border-white/10 bg-canvas/95 p-1.5 shadow-2xl backdrop-blur-xl">
                {(
                  [
                    ["fr", "Français"],
                    ["ar", "العربية"],
                    ["en", "English"],
                  ] as [string, string][]
                ).map(([code, label]) => (
                  <Link
                    key={code}
                    href={pathname || "/"}
                    locale={code}
                    onClick={() => setLangDropdownOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                      locale === code
                        ? "bg-lime-400/[0.10] font-bold text-lime-400"
                        : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{label}</span>
                    {locale === code && (
                      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* LOGGED-IN USER */}
          {!loading && profile && (
            <div className="ms-1 flex items-center gap-1">
              <Link
                href="/profile"
                className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] p-1 pe-3 transition hover:border-lime-400/30 hover:bg-lime-400/[0.07]"
              >
                <div className="relative">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="h-7 w-7 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="absolute bottom-0 end-0 h-2 w-2 rounded-full border border-canvas bg-lime-400" />
                </div>

                <span className="hidden max-w-24 truncate text-xs font-semibold text-white/70 transition group-hover:text-lime-400 xl:block">
                  {displayName}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  void handleLogout();
                }}
                title={tNav("signOut")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition hover:bg-red-400/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* GUEST USER */}
          {!profile && !loading && (
            <Link
              href="/sign-in"
              className="ms-1 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold text-black transition-all duration-200 hover:bg-lime-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <User className="h-3.5 w-3.5" />
              <span>{tNav("signIn")}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
