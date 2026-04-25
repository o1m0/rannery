"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6 py-10">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← 戻る
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">新しい学習プラン</h1>
          <p className="text-sm text-muted-foreground mt-1">AIが最適な学習プランを生成します</p>
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="学習タイトル（例：React習得）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-border bg-muted px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <textarea
            placeholder="目標（例：3ヶ月でReactをマスターする）"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border border-border bg-muted px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary h-32 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? "AIがプランを生成中..." : "プランを生成する"}
          </button>
        </form>
      </div>
    </div>
  );
}