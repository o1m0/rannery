"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPlanPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "applecation/json" },
      body: JSON.stringify({ title, goal }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 border rounded-lg">
        <h1 className="text-2xl font-bold">新しい学習プランを作成</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-blue-500">AIがプランを生成中...</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="学習タイトル（例：React習得）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="目標（例：3ヶ月でReactをマスターする）"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border p-2 rounded h-32"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            プランを生成する
          </button>
        </form>
      </div>
    </div>
  );
}
