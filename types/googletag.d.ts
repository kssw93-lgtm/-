// Google Publisher Tag(GPT)는 공식 TypeScript 타입을 제공하지 않아서
// astronomia.d.ts와 같은 방식으로, 이 프로젝트가 실제로 쓰는 보상형(rewarded)
// 광고 최소 API 표면만 직접 선언한다. 전체 GPT API 문서:
// https://developers.google.com/publisher-tag/reference
//
// 파일 전체를 declare global 안에 두는 이유: 이 파일은 export {}가 있어 모듈로
// 취급되는데, 모듈 밖(전역)에서 GoogletagSlot 등의 이름을 그냥 쓰려면(다른 .ts
// 파일에서 import 없이 타입만 참조) 전역 선언이어야 한다.
declare global {
  interface GoogletagSlot {
    getSlotElementId(): string;
  }

  interface GoogletagRewardedSlotReadyEvent {
    slot: GoogletagSlot;
    makeRewardedVisible(): void;
  }

  interface GoogletagRewardedSlotGrantedEvent {
    slot: GoogletagSlot;
    payload: { name: string; type: string } | null;
  }

  interface GoogletagRewardedSlotClosedEvent {
    slot: GoogletagSlot;
  }

  interface GoogletagSlotRenderEndedEvent {
    slot: GoogletagSlot;
    isEmpty: boolean;
  }

  type GoogletagEventMap = {
    rewardedSlotReady: GoogletagRewardedSlotReadyEvent;
    rewardedSlotGranted: GoogletagRewardedSlotGrantedEvent;
    rewardedSlotClosed: GoogletagRewardedSlotClosedEvent;
    slotRenderEnded: GoogletagSlotRenderEndedEvent;
  };

  interface GoogletagPubAdsService {
    addEventListener<K extends keyof GoogletagEventMap>(
      type: K,
      listener: (event: GoogletagEventMap[K]) => void
    ): GoogletagPubAdsService;
    removeEventListener<K extends keyof GoogletagEventMap>(
      type: K,
      listener: (event: GoogletagEventMap[K]) => void
    ): GoogletagPubAdsService;
  }

  interface Googletag {
    cmd: Array<() => void>;
    enums: {
      OutOfPageFormat: { REWARDED: unknown };
    };
    defineOutOfPageSlot(adUnitPath: string, format: unknown): GoogletagSlot | null;
    pubads(): GoogletagPubAdsService;
    enableServices(): void;
    display(slot: GoogletagSlot | string): void;
    destroySlots(slots?: GoogletagSlot[]): boolean;
  }

  interface Window {
    googletag?: Googletag;
  }
}

export {};
