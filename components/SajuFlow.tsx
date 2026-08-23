"use client";

import { useEffect, useState } from "react";
import IntroScreen from "./IntroScreen";
import StyleSelectScreen from "./StyleSelectScreen";
import CategorySelect from "./CategorySelect";
import RelationshipStatusScreen from "./RelationshipStatusScreen";
import BirthInfoForm from "./BirthInfoForm";
import AdWatchScreen from "./AdWatchScreen";
import CalculatingLoader from "./CalculatingLoader";
import ResultScreen from "./ResultScreen";
import CompatibilityResultScreen from "./CompatibilityResultScreen";
import { computeSaju, type BirthInput, type SajuResult } from "@/lib/calc";
import {
  applyToneStyle,
  buildBirthKey,
  interpretSaju,
  introFor,
  type InterpretationResult,
} from "@/lib/interpretation";
import { computeCompatibility, type CompatibilityResult } from "@/lib/interpretation/compatibility";
import {
  DEFAULT_BIRTH_FORM,
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

  useEffect(() => {
    const saved = loadBirthForm();
    if (saved) setForm(saved);
    setToneStyle(loadToneStyle());
    // 방문할 때마다(새로고침 포함) 브랜드 인트로 화면을 항상 먼저 보여준다 —
    // 이전에는 localStorage에 방문 기록이 남으면 건너뛰었는데, 그러면 사용자가
    // "왜 첫 화면 없이 바로 넘어가냐"고 계속 헷갈려해서 그 분기를 제거했다.
  }, []);

  function handleSelectToneStyle(style: ToneStyleId) {
    setToneStyle(style);
    saveToneStyle(style);
  }

  function handleStart() {
    setScreen("style");
  }

  function handleConfirmStyle() {
    setScreen("s2");
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
    // 08번: 생년월일 등 정보가 이미 입력되어 있으면 S3를 건너뛰고 바로 광고 화면으로 이동한다.
    if (form.birthDate.trim().length > 0) {
      setScreen("ad");
    } else {
      setScreen("s3");
    }
  }

  function handleSelectRelationshipStatus(status: RelationshipStatus) {
    setRelationshipStatus(status);
    setErrorMessage(null);
    if (form.birthDate.trim().length > 0) {
      setScreen("ad");
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
    setScreen(flowMode === "compatibility" ? "compat-partner" : "ad");
  }

  function handleSubmitPartnerForm(nextPartnerForm: BirthFormState) {
    setPartnerForm(nextPartnerForm);
    setErrorMessage(null);
    setScreen("ad");
  }

  function handleAdWatched() {
    setScreen("s4");
  }

  function runCalculation() {
    try {
      if (flowMode === "compatibility") {
        const resultA = computeSaju(toBirthInput(form));
        const resultB = computeSaju(toBirthInput(partnerForm));
        const compat = computeCompatibility(resultA, resultB);
        setSaju(resultA);
        setSajuB(resultB);
        setCompatResult(compat);
        setErrorMessage(null);
        setScreen("compat-result");
        return;
      }

      if (!category) return;
      const result = computeSaju(toBirthInput(form));
      let interpreted = interpretSaju(result, category, relationshipStatus ?? undefined);
      const birthKey = buildBirthKey({
        year: result.input.year,
        month: result.input.month,
        day: result.input.day,
        hour: result.input.hour,
        minute: result.input.minute,
        calendarType: result.input.calendarType,
      });
      interpreted = applyToneStyle(interpreted, toneStyle, birthKey, category);
      setSaju(result);
      setInterpretation(interpreted);
      setErrorMessage(null);
      setScreen("s5");
    } catch (err) {
      // 내부 기술 메시지(데이터 파일 경로 등)는 사용자에게 그대로 노출하지 않는다.
      // 개발자가 원인을 알 수 있도록 콘솔에는 원본 오류를 남긴다.
      console.error("사주 계산 실패:", err);
      const message = err instanceof Error ? err.message : "";
      const isSupportedRangeMessage = message.startsWith("현재 서비스는") || message.includes("음력 날짜에 대한 검증된");
      setErrorMessage(
        isSupportedRangeMessage
          ? message
          : "이 생년월일시는 아직 정확히 계산할 수 없어요. 날짜나 시간을 조금 조정해서 다시 시도해 주세요."
      );
      setScreen(flowMode === "compatibility" ? "compat-partner" : "s3");
    }
  }

  function handleOtherFortune() {
    // 08번: 생년월일 등은 세션에 유지, 카테고리만 재선택 → S3 건너뛰고 S2로
    setFlowMode("solo");
    setScreen("s2");
  }

  const FALLBACK_INTRO: Record<Category, string> = {
    love: "연애 이야기를 해볼까요? 먼저 당신의 사주를 살펴볼게요.",
    career: "일과 관련된 이야기를 시작하기 전에, 당신의 타고난 기질부터 살펴볼게요.",
    wealth: "돈의 흐름이 궁금하신가요? 먼저 당신의 사주부터 살펴볼게요.",
    reunion: "다시 이어질 인연인지 궁금하시죠? 사주에 담긴 흐름을 살펴볼게요.",
    overall: "당신의 인생 전체를 관통하는 흐름을 살펴볼게요.",
  };
  const introText =
    flowMode === "compatibility"
      ? "먼저 당신의 정보를 입력해주세요. 다음 화면에서 상대방 정보를 입력받아요."
      : category && saju
        ? introFor(category, saju)
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

      {screen === "s1" && <IntroScreen onStart={handleStart} />}
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
          introText="이번엔 상대방 정보를 입력해주세요."
          initial={partnerForm}
          onSubmit={handleSubmitPartnerForm}
          onBack={() => setScreen("s2")}
        />
      )}
      {screen === "ad" && <AdWatchScreen onDone={handleAdWatched} />}
      {screen === "s4" && <CalculatingLoader onDone={runCalculation} />}
      {screen === "s5" && interpretation && saju && (
        <ResultScreen
          name={form.name}
          category={interpretation.category}
          toneStyle={toneStyle}
          saju={saju}
          sections={interpretation.sections}
          monthRhythm={interpretation.monthRhythm}
          daeunFlow={interpretation.daeunFlow}
          luckColor={interpretation.luckColor}
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
          workStyle={interpretation.workStyle}
          coreSummary={interpretation.coreSummary}
          incomeSource={interpretation.incomeSource}
          wealthMonthRanking={interpretation.wealthMonthRanking}
          gwiinDaeun={interpretation.gwiinDaeun}
          datingAdvice={interpretation.datingAdvice}
          resultText={interpretation.resultText}
          isHourExcluded={interpretation.isHourExcluded}
          onOtherFortune={handleOtherFortune}
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
        />
      )}
    </>
  );
}
