import { Book } from "@/components/Book";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-900">
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <Book />
      </main>
    </div>
  );
}
