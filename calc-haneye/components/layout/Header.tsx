"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { siteName } from "@/lib/constants/site";

const navItems = [
  { label: "금융", href: "/finance" },
  { label: "세금·부동산", href: "/property-tax" },
  { label: "계산 가이드", href: "/guides" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-md text-lg font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {siteName}
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:hidden"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="h-6 w-6" />
          ) : (
            <Menu aria-hidden="true" className="h-6 w-6" />
          )}
        </button>
      </Container>

      {isMenuOpen ? (
        <div
          id="mobile-nav-panel"
          className="border-t border-hairline bg-white sm:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink-soft hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
