"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>読み込み中...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <p>ようこそ、{session?.user?.name}さん！</p>
    </div>
  );
}