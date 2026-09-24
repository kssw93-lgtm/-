"use client";

import { useState } from "react";

export default function ClearSavedData() {
  const [message, setMessage] = useState("");
  function clear() {
    try {
      window.localStorage.removeItem("saju_birth_form_v1");
      window.sessionStorage.removeItem("saju_tone_style_v1");
      setMessage("이 브라우저의 출생 입력과 말투 저장값을 지웠어요.");
    } catch {
      setMessage("브라우저가 저장소 접근을 제한하고 있어요. 브라우저 설정에서 이 사이트의 데이터를 삭제해 주세요.");
    }
  }
  return <div className="space-y-2">
    <button type="button" onClick={clear} className="rounded-lg border border-white/30 px-4 py-3 text-sm">저장한 출생 정보와 말투 삭제</button>
    <p role="status" className="text-sm text-[color:var(--color-gold-light)]">{message}</p>
  </div>;
}
