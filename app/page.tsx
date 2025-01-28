import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="relative mx-auto container flex min-h-screen flex-col">
      <div className=" p-4 flex h-full items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <span className="font-bold">Fahd AI SEC Standard Assistant</span>
      </div>
      <div className="flex py-4">
        <div className="w-full h-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
