import { Book } from "@/components/Book";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="header-bar">
        <h1 className="header-title">making GREATNESS magazine</h1>
        <h3 className="header-email">mgmmfg@gmail.com</h3>
      </header>
      <main className="flex min-h-screen w-full items-center justify-center p-4 pt-24">
        <Book />
      </main>
    </div>
  );
}
