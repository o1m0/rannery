"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Plan {
  _id: string;
  title: string;
  goal: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (status === "authenticated") {
        const res = await fetch("/api/plans");
        const data = await res.json();
        setPlans(data.plans);
        setLoading(false);
      }
    };
    fetchPlans();
  }, [status]);

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">読み込み中...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">ダッシュボード</h1>
            <p className="text-sm text-muted-foreground mt-1">ようこそ、{session?.user?.name}さん</p>
          </div>
          <Link
            href="/dashboard/plans/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          >
            + 新しいプラン
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="border border-border rounded-xl p-8 text-center bg-muted">
            <p className="text-muted-foreground text-sm">まだプランがありません</p>
            <Link href="/dashboard/plans/new" className="text-sm underline mt-2 inline-block">
              最初のプランを作成する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <Link href={`/dashboard/plans/${plan._id}`} key={plan._id}>
                <div className="border border-border rounded-xl p-5 bg-muted hover:bg-background transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-medium">{plan.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{plan.goal}</p>
                    </div>
                    <span className="text-xs border border-border px-2 py-1 rounded-full">
                      {plan.status === "active" ? "進行中" : "完了"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}