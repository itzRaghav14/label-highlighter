"use client";

import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Home() {
  const {
    storedValue: text,
    setValue: setText,
    isLoaded,
  } = useLocalStorage("my-notes", "");
  const { storedValue: count, setValue: setCount } = useLocalStorage(
    "my-counter",
    0
  );

  // Prevent Hydration mismatch (wait until we load from browser storage)
  if (!isLoaded) {
    return <div className="p-10">Loading saved data...</div>;
  }

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Offline Next.js App</h1>

      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl mb-2">1. Counter Test</h2>
        <p className="mb-2">
          Count: <strong>{count}</strong>
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded active:bg-blue-700"
        >
          Increment
        </button>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">2. Text Test</h2>
        <textarea
          className="w-full border p-2"
          rows={5}
          placeholder="Type something here, close the tab, and come back..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Status: If you turn off Wi-Fi and refresh, this page should still load.
      </p>
    </main>
  );
}
