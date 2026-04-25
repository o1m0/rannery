"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6 py-10 border border-border rounded-xl bg-muted space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ログイン</h1>
          <p className="text-sm text-muted-foreground mt-1">アカウントにサインインしてください</p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border bg-background px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-background px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          >
            ログイン
          </button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-foreground underline">新規登録</Link>
        </p>
      </div>
    </div>
  );
}