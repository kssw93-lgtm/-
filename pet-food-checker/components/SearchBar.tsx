"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-3 shadow-sm">
      <div className="relative">
        <input
          type="text"
          inputMode="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="음식 이름을 검색하세요 (예: 초콜릿, 당근)"
          aria-label="음식 검색"
          className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="검색어 지우기"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
