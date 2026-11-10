import EnglishDocumentLocale from "./EnglishDocumentLocale";

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <EnglishDocumentLocale />
      {children}
    </>
  );
}
