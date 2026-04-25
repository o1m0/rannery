import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from "@/lib/mongoose";
import Plan from "@/models/Plan";
import Task from "@/models/Task";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
console.log("APIキー:", process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { title, goal } = await req.json();
    if (!title || !goal) {
      return NextResponse.json({ error: "タイトルと目標を入力してください" }, { status: 400 });
    }

    // Gemini APIでプランを生成
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
あなたは学習プランの専門家です。以下の情報をもとに、具体的な学習プランをJSON形式で作成してください。

学習タイトル: ${title}
目標: ${goal}

以下のJSON形式で返してください。他のテキストは不要です：
{
  "tasks": [
    { "title": "タスク名", "date": "YYYY-MM-DD", "order": 1 },
    { "title": "タスク名", "date": "YYYY-MM-DD", "order": 2 }
  ]
}

今日の日付: ${new Date().toISOString().split("T")[0]}
タスクは7〜14個、今日から始まる日程で作成してください。
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const { tasks } = JSON.parse(clean);

    // DBに保存
    await connectToDatabase();
    const plan = await Plan.create({
      userId: session.user.id,
      title,
      goal,
      status: "active",
    });

    const taskDocs = await Task.insertMany(
      tasks.map((t: { title: string; date: string; order: number }) => ({
        planId: plan._id,
        title: t.title,
        date: new Date(t.date),
        status: "pending",
        order: t.order,
      }))
    );

    return NextResponse.json({ plan, tasks: taskDocs }, { status: 201 });
  } catch (error) {
    console.error('エラー詳細', error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}