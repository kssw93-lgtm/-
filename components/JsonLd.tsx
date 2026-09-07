/**
 * JSON-LD 구조화 데이터를 <script type="application/ld+json">로 삽입하는 공용 컴포넌트.
 * data는 항상 정적/계산된 값만 넣고, 사용자 입력을 그대로 넣지 않는다(XSS 방지).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
