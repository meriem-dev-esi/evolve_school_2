"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NavLinkItem, Profile } from "./types";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pathname: string;
  locale: string;
  navLinks: NavLinkItem[];
  isActive: (href: string) => boolean;
  profile: Profile | null;
  displayName: string;
  loading: boolean;
  handleLogout: () => void;
  tNav: (key: string) => string;
}

export default function MobileNav({
  mobileMenuOpen,
  setMobileMenuOpen,
  pathname,
  locale,
  navLinks,
  isActive,
  profile,
  displayName,
  loading,
  handleLogout,
  tNav,
}: MobileNavProps) {
  return (
    <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] -translate-x-1/2 lg:hidden">
      <div className="flex h-[60px] items-center justify-between rounded-full border border-white/[0.10] bg-canvas/80 px-3 shadow-lg backdrop-blur-2xl">
        {/* Mobile logo */}
        <Link href="/" className="px-3">
          <Image
            src="/logo.png"
            alt="Evolve"
            width={140}
            height={44}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Mobile Language & Menu Buttons */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
            {(
              [
                ["fr", "FR"],
                ["ar", "ع"],
                ["en", "EN"],
              ] as [string, string][]
            ).map(([code, label]) => (
              <Link
                key={code}
                href={pathname || "/"}
                locale={code}
                className={`rounded-full px-2 py-0.5 transition ${
                  locale === code
                    ? "bg-lime-400 font-bold text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.07] hover:text-lime-400"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="mt-2 overflow-hidden rounded-[28px] border border-white/10 bg-canvas/95 p-2 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? "bg-lime-400/[0.10] text-lime-400"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                  )}
                </Link>
              );
            })}

            {/* Mobile user profile / logout */}
            {profile ? (
              <div className="mt-2 flex items-center justify-between border-t border-white/10 px-4 pt-4">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4 text-lime-400" />
                  <span>{displayName}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void handleLogout();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{tNav("signOut")}</span>
                </button>
              </div>
            ) : (
              !loading && (
                <div className="mt-2 border-t border-white/10 px-4 pt-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-xs font-bold text-black"
                  >
                    <User className="h-4 w-4" />
                    <span>{tNav("signIn")}</span>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
