"use client";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-center px-6 py-4">
      <button
        onClick={() => {
          window.location.href = "/";
        }}
        className="flex items-center gap-2 transition hover:opacity-80"
      >
        <span className="text-lg text-[color:var(--color-gold)]">☯</span>
        <span className="font-brand text-lg font-bold tracking-wide text-[color:var(--color-gold-light)]">
          천기누설
        </span>
      </button>
    </header>
  );
}
