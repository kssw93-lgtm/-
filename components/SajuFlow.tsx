"use client";

import { useEffect, useState } from "react";
import IntroScreen from "./IntroScreen";
import StyleSelectScreen from "./StyleSelectScreen";
import CategorySelect from "./CategorySelect";
import RelationshipStatusScreen from "./RelationshipStatusScreen";
import BirthInfoForm from "./BirthInfoForm";
import ResultUnlockGate from "./ResultUnlockGate";
import ResultScreen from "./ResultScreen";
import CompatibilityResultScreen from "./CompatibilityResultScreen";
import DailyFortuneScreen from "./DailyFortuneScreen";
import { computeSaju, type BirthInput, type SajuResult } from "@/lib/calc";
import {
  applyToneStyle,
  buildBirthKey,
  interpretSaju,
  introFor,
  type InterpretationResult,
} from "@/lib/interpretation";
import { computeCompatibility, type CompatibilityResult } from "@/lib/interpretation/compatibility";
import { loadEnglishContent, localizeEnglishContent, localizeEnglishText } from "@/lib/i18n/english-content";
import { useSiteLocale } from "@/lib/i18n/site-locale";
import { t } from "@/lib/i18n/messages";
import { buildCompatResultKey, buildDailyResultKey, buildSoloResultKey, isResultUnlocked } from "@/lib/result-unlock";
import {
  DEFAULT_BIRTH_FORM,
  clearBirthForm,
  loadBirthForm,
  loadToneStyle,
  saveBirthForm,
  saveToneStyle,
  type BirthFormState,
  type Category,
  type RelationshipStatus,
  type Screen,
  type ToneStyleId,
} from "@/lib/session";

/** "오늘의 운세"가 날짜가 바뀌면 실제로 다른 결과가 되도록, 로컬 날짜 기준 키를 만든다.
 * computeDailyFortune도 동일하게 new Date()의 로컬 연/월/일을 기준으로 하루를 가른다. */
function todayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function toBirthInput(form: BirthFormState): BirthInput {
  const [year, month, day] = form.birthDate.split("-").map(Number);
  return {
    name: form.name,
    year,
    month,
    day,
    hour: form.timeUnknown ? null : form.hour,
    minute: form.timeUnknown ? 0 : form.minute,
    gender: form.gender,
    calendarType: form.calendarType,
    isLeapMonth: form.calendarType === "lunar" ? form.isLeapMonth : false,
  };
}

type FlowMode = "solo" | "compatibility";

export default function SajuFlow() {
  const locale = useSiteLocale();
  const isEnglish = locale === "en";
  const [englishCatalogState, setEnglishCatalogState] = useState<"loading" | "ready" | "error">("loading");
  const [screen, setScreen] = useState<Screen>("s1");
  const [flowMode, setFlowMode] = useState<FlowMode>("solo");
  const [form, setForm] = useState<BirthFormState>(DEFAULT_BIRTH_FORM);
  const [partnerForm, setPartnerForm] = useState<BirthFormState>({ ...DEFAULT_BIRTH_FORM, gender: "male" });
  const [category, setCategory] = useState<Category | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(null);
  const [toneStyle, setToneStyle] = useState<ToneStyleId>("standard");
  const [saju, setSaju] = useState<SajuResult | null>(null);
  const [sajuB, setSajuB] = useState<SajuResult | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null);
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** 첫 화면에서 운세를 직접 고른 경우, 말투 선택 뒤 해당 주제로 바로 이어간다. */
  const [introSelection, setIntroSelection] = useState<Category | "compatibility" | null>(null);
  /** 지금 게이트(ResultUnlockGate)가 다루고 있는 결과를 가리키는 고유 키.
   * 이 결과가 이미 이번 세션에 해제됐으면 게이트를 아예 거치지 않고 바로 결과 화면으로 간다. */
  const [unlockKey, setUnlockKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (isEnglish) {
      setEnglishCatalogState("loading");
      void loadEnglishContent().then(
        () => { if (active) setEnglishCatalogState("ready"); },
        (error) => {
          console.error("English reading catalogue failed to load:", error);
          if (active) setEnglishCatalogState("error");
        },
      );
    } else {
      setEnglishCatalogState("ready");
    }
    const saved = loadBirthForm();
    if (saved) setForm(saved);
    setToneStyle(loadToneStyle());
    // 방문할 때마다(새로고침 포함) 브랜드 인트로 화면을 항상 먼저 보여준다 —
    // 이전에는 localStorage에 방문 기록이 남으면 건너뛰었는데, 그러면 사용자가
    // "왜 첫 화면 없이 바로 넘어가냐"고 계속 헷갈려해서 그 분기를 제거했다.
    return () => { active = false; };
  }, [isEnglish]);

  async function ensureEnglishCatalog(): Promise<boolean> {
    if (!isEnglish) return true;
    if (englishCatalogState === "ready") return true;
    setEnglishCatalogState("loading");
    try {
      await loadEnglishContent();
      setEnglishCatalogState("ready");
      return true;
    } catch (error) {
      console.error("English reading catalogue failed to load:", error);
      setEnglishCatalogState("error");
      setErrorMessage("We couldn't load the English reading content. Please check your connection and try again.");
      return false;
    }
  }

  function handleSelectToneStyle(style: ToneStyleId) {
    setToneStyle(style);
    saveToneStyle(style);
  }

  function handleStart() {
    setIntroSelection(null);
    setScreen(isEnglish ? "s2" : "style");
  }

  function handleConfirmStyle() {
    const selected = introSelection;
    setIntroSelection(null);
    if (selected === "compatibility") {
      handleSelectCompatibility();
      return;
    }
    if (selected) {
      handleSelectCategory(selected);
      return;
    }
    setScreen("s2");
  }

  function handleStartCategory(selected: Category) {
    setIntroSelection(selected);
    if (isEnglish) {
      setIntroSelection(null);
      handleSelectCategory(selected);
    } else {
      setScreen("style");
    }
  }

  function handleStartCompatibility() {
    setIntroSelection("compatibility");
    if (isEnglish) {
      setIntroSelection(null);
      handleSelectCompatibility();
    } else {
      setScreen("style");
    }
  }

  function handleSelectCategory(selected: Category) {
    setFlowMode("solo");
    setCategory(selected);
    setErrorMessage(null);
    // 연애운은 "지금 연애 중인지"부터 먼저 물어본다 — 상태에 따라 보여줄 내용이 달라지기 때문에
    // 생년월일이 이미 입력돼 있어도 이 질문만은 건너뛰지 않는다.
    if (selected === "love") {
      setScreen("love-status");
      return;
    }
    // 08번: 생년월일 등 정보가 이미 입력되어 있으면 S3를 건너뛰고 바로 결과 준비로 이동한다.
    if (form.birthDate.trim().length > 0) {
      proceedSolo(form, selected, null);
    } else {
      setScreen("s3");
    }
  }

  function handleSelectRelationshipStatus(status: RelationshipStatus) {
    setRelationshipStatus(status);
    setErrorMessage(null);
    if (form.birthDate.trim().length > 0) {
      proceedSolo(form, "love", status);
    } else {
      setScreen("s3");
    }
  }

  function handleSelectCompatibility() {
    setFlowMode("compatibility");
    setCategory(null);
    setErrorMessage(null);
    setScreen(form.birthDate.trim().length > 0 ? "compat-partner" : "s3");
  }

  function handleSubmitForm(nextForm: BirthFormState) {
    setForm(nextForm);
    saveBirthForm(nextForm);
    setErrorMessage(null);
    if (flowMode === "compatibility") {
      setScreen("compat-partner");
      return;
    }
    if (category) {
      proceedSolo(nextForm, category, category === "love" ? relationshipStatus : null);
    }
  }

  /**
   * 계산은 여기서 바로(동기적으로) 끝내고 결과를 state에 저장해둔다 — 광고를 볼지 말지와
   * 무관하게 "결과 준비"는 미리 끝내서, 광고 시청이 끝나는 즉시 결과로 넘어가게 한다.
   * 이미 이번 세션에 같은 결과를 해제한 적 있으면(새로고침·뒤로가기 등) 게이트 자체를
   * 건너뛰고 바로 결과 화면으로 간다.
   */
  async function proceedSolo(targetForm: BirthFormState, targetCategory: Category, targetRelationshipStatus: RelationshipStatus | null) {
    try {
      if (!(await ensureEnglishCatalog())) return;
      const result = computeSaju(toBirthInput(targetForm));
      let interpreted = interpretSaju(result, targetCategory, targetRelationshipStatus ?? undefined);
      if (isEnglish) interpreted = localizeEnglishContent(interpreted);
      const birthKey = buildBirthKey({
        year: result.input.year,
        month: result.input.month,
        day: result.input.day,
        hour: result.input.hour,
        minute: result.input.minute,
        calendarType: result.input.calendarType,
      });
      if (!isEnglish) interpreted = applyToneStyle(interpreted, toneStyle, birthKey, targetCategory);
      setSaju(result);
      setInterpretation(interpreted);
      setErrorMessage(null);

      const key = buildSoloResultKey(targetForm, targetCategory, targetRelationshipStatus);
      if (isResultUnlocked(key)) {
        setScreen("s5");
      } else {
        setUnlockKey(key);
        setScreen("ad");
      }
    } catch (err) {
      handleCalculationError(err);
      setScreen("s3");
    }
  }

  async function handleSubmitPartnerForm(nextPartnerForm: BirthFormState) {
    setPartnerForm(nextPartnerForm);
    setErrorMessage(null);
    try {
      if (!(await ensureEnglishCatalog())) return;
      const resultA = computeSaju(toBirthInput(form));
      const resultB = computeSaju(toBirthInput(nextPartnerForm));
      const calculatedCompat = computeCompatibility(resultA, resultB);
      const compat = isEnglish ? localizeEnglishContent(calculatedCompat) : calculatedCompat;
      setSaju(resultA);
      setSajuB(resultB);
      setCompatResult(compat);
      setErrorMessage(null);

      const key = buildCompatResultKey(form, nextPartnerForm);
      if (isResultUnlocked(key)) {
        setScreen("compat-result");
      } else {
        setUnlockKey(key);
        setScreen("ad");
      }
    } catch (err) {
      handleCalculationError(err);
      setScreen("compat-partner");
    }
  }

  /** 내부 기술 메시지(데이터 파일 경로 등)는 사용자에게 그대로 노출하지 않는다.
   * 개발자가 원인을 알 수 있도록 콘솔에는 원본 오류를 남긴다. */
  function handleCalculationError(err: unknown) {
    console.error("사주 계산 실패:", err);
    const message = err instanceof Error ? err.message : "";
    const isSupportedRangeMessage = message.startsWith("현재 서비스는") || message.includes("음력 날짜에 대한 검증된");
    setErrorMessage(
      isSupportedRangeMessage
        ? isEnglish ? localizeEnglishText(message) : message
        : isEnglish
          ? "We can't calculate this birth date and time accurately yet. Please check the date and time and try again."
          : "이 생년월일시는 아직 정확히 계산할 수 없어요. 날짜나 시간을 조금 조정해서 다시 시도해 주세요."
    );
  }

  /** "오늘의 운세" 빠른 진입 — 저장된 정보로 말투/카테고리/생년월일 입력을 전부 건너뛴다. */
  async function handleQuickDaily() {
    try {
      if (!(await ensureEnglishCatalog())) return;
      const result = computeSaju(toBirthInput(form));
      setSaju(result);
      setErrorMessage(null);

      const key = buildDailyResultKey(form, todayDateKey());
      if (isResultUnlocked(key)) {
        setScreen("daily-result");
      } else {
        setUnlockKey(key);
        setScreen("daily-ad");
      }
    } catch (err) {
      console.error("오늘의 운세 계산 실패:", err);
      setErrorMessage(isEnglish ? "We couldn't use the saved birth details. Please enter them again." : "저장된 정보로 계산할 수 없어요. 정보를 다시 입력해 주세요.");
      setScreen("s3");
    }
  }

  function handleSeeFullResult() {
    setScreen("s2");
  }

  function handleOtherFortune() {
    // 08번: 생년월일 등은 세션에 유지, 카테고리만 재선택 → S3 건너뛰고 S2로
    setFlowMode("solo");
    setScreen("s2");
  }

  /** "다른 사람 정보로 보기" — 저장된 생년월일을 지우고 완전히 새로 입력받는다. */
  function handleResetPerson() {
    clearBirthForm();
    setForm(DEFAULT_BIRTH_FORM);
    setPartnerForm({ ...DEFAULT_BIRTH_FORM, gender: "male" });
    setCategory(null);
    setRelationshipStatus(null);
    setFlowMode("solo");
    setSaju(null);
    setSajuB(null);
    setInterpretation(null);
    setCompatResult(null);
    setErrorMessage(null);
    setScreen("s2");
  }

  function retryEnglishCatalog() {
    setErrorMessage(null);
    setEnglishCatalogState("loading");
    void loadEnglishContent().then(
      () => setEnglishCatalogState("ready"),
      (error) => {
        console.error("English reading catalogue failed to load:", error);
        setEnglishCatalogState("error");
        setErrorMessage("We couldn't load the English reading content. Please check your connection and try again.");
      },
    );
  }

  const FALLBACK_INTRO: Record<Category, string> = {
    love: t(locale, "연애 이야기를 해볼까요? 먼저 당신의 사주를 살펴볼게요."),
    career: t(locale, "일과 관련된 이야기를 시작하기 전에, 당신의 타고난 기질부터 살펴볼게요."),
    wealth: t(locale, "돈의 흐름이 궁금하신가요? 먼저 당신의 사주부터 살펴볼게요."),
    reunion: t(locale, "다시 이어질 인연인지 궁금하시죠? 사주에 담긴 흐름을 살펴볼게요."),
    overall: t(locale, "당신의 인생 전체를 관통하는 흐름을 살펴볼게요."),
  };
  const introText =
    flowMode === "compatibility"
      ? t(locale, "먼저 당신의 정보를 입력해주세요. 다음 화면에서 상대방 정보를 입력받아요.")
      : category && saju
        ? (isEnglish ? localizeEnglishText(introFor(category, saju)) : introFor(category, saju))
        : category
          ? FALLBACK_INTRO[category]
          : "";

  return (
    <>
      {errorMessage && (
          <div className="mx-6 mt-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
      {isEnglish && englishCatalogState === "error" && (
        <button onClick={retryEnglishCatalog} className="mx-6 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70">
          Retry loading English content
        </button>
      )}

      {screen === "s1" && (
        <IntroScreen
          onStart={handleStart}
          onSelectCategory={handleStartCategory}
          onSelectCompatibility={handleStartCompatibility}
          savedName={form.birthDate.trim().length > 0 ? form.name : null}
          onQuickDaily={handleQuickDaily}
        />
      )}
      {screen === "style" && (
        <StyleSelectScreen toneStyle={toneStyle} onSelectToneStyle={handleSelectToneStyle} onNext={handleConfirmStyle} />
      )}
      {screen === "s2" && (
        <CategorySelect onSelect={handleSelectCategory} onSelectCompatibility={handleSelectCompatibility} />
      )}
      {screen === "love-status" && (
        <RelationshipStatusScreen onSelect={handleSelectRelationshipStatus} onBack={() => setScreen("s2")} />
      )}
      {screen === "s3" && (
        <BirthInfoForm
          introText={introText}
          initial={form}
          onSubmit={handleSubmitForm}
          onBack={() => setScreen("s2")}
        />
      )}
      {screen === "compat-partner" && (
        <BirthInfoForm
          introText={t(locale, "이번엔 상대방 정보를 입력해주세요.")}
          initial={partnerForm}
          onSubmit={handleSubmitPartnerForm}
          onBack={() => setScreen("s2")}
        />
      )}
      {screen === "ad" && unlockKey && (
        <ResultUnlockGate
          resultKey={unlockKey}
          onUnlocked={() => setScreen(flowMode === "compatibility" ? "compat-result" : "s5")}
          onCancel={() => setScreen("s2")}
        />
      )}
      {screen === "s5" && interpretation && saju && (
        <ResultScreen
          name={form.name}
          category={interpretation.category}
          toneStyle={isEnglish ? "standard" : toneStyle}
          saju={saju}
          sections={interpretation.sections}
          monthRhythm={interpretation.monthRhythm}
          daeunFlow={interpretation.daeunFlow}
          luckColor={interpretation.luckColor}
          todayLuck={interpretation.todayLuck}
          starSign={interpretation.starSign}
          zodiacAnimal={interpretation.zodiacAnimal}
          gyeokguk={interpretation.gyeokguk}
          sinsal={interpretation.sinsal}
          dailyFortune={interpretation.dailyFortune}
          pastLife={interpretation.pastLife}
          lifeGrades={interpretation.lifeGrades}
          johu={interpretation.johu}
          lifeStages={interpretation.lifeStages}
          meetingTiming={interpretation.meetingTiming}
          meetingChannel={interpretation.meetingChannel}
          weeklyMeetingSuggestion={interpretation.weeklyMeetingSuggestion}
          workStyle={interpretation.workStyle}
          gyeokgukCareerFit={interpretation.gyeokgukCareerFit}
          gyeokgukWealthStyle={interpretation.gyeokgukWealthStyle}
          coreSummary={interpretation.coreSummary}
          incomeSource={interpretation.incomeSource}
          wealthMonthRanking={interpretation.wealthMonthRanking}
          gwiinDaeun={interpretation.gwiinDaeun}
          zodiacCompat={interpretation.zodiacCompat}
          zodiacCareer={interpretation.zodiacCareer}
          workRelationships={interpretation.workRelationships}
          loveDeepDive={interpretation.loveDeepDive}
          datingAdvice={interpretation.datingAdvice}
          categorySummary={interpretation.categorySummary}
          resultText={interpretation.resultText}
          isHourExcluded={interpretation.isHourExcluded}
          onOtherFortune={handleOtherFortune}
          onResetPerson={handleResetPerson}
        />
      )}
      {screen === "compat-result" && saju && sajuB && compatResult && (
        <CompatibilityResultScreen
          nameA={form.name}
          nameB={partnerForm.name}
          sajuA={saju}
          sajuB={sajuB}
          result={compatResult}
          onRestart={handleOtherFortune}
          onResetPerson={handleResetPerson}
        />
      )}
      {screen === "daily-ad" && unlockKey && (
        <ResultUnlockGate
          resultKey={unlockKey}
          onUnlocked={() => setScreen("daily-result")}
          onCancel={() => setScreen("s1")}
        />
      )}
      {screen === "daily-result" && saju && (
        <DailyFortuneScreen
          displayName={form.name.trim() || (isEnglish ? "You" : "당신")}
          saju={saju}
          onSeeFullResult={handleSeeFullResult}
          onResetPerson={handleResetPerson}
        />
      )}
    </>
  );
}
