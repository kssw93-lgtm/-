/** 페이지가 자체 openGraph를 정의하면 레이아웃의 기본 이미지가 통째로 덮어써지므로,
 * 모든 페이지의 openGraph.images에 이 공용 이미지를 넣는다(카카오톡·SNS 공유 미리보기용). */
export const OG_IMAGES = [{ url: "/thumbnail.png", width: 1200, height: 630, alt: "사주달력 | 무료 사주팔자·만세력·타로" }];
