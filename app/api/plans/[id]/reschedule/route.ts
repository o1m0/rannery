import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from "@/lib/mongoose";
import Plan from "@/models/Plan";
import Task from "@/models/Task";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const plan = await Plan.findOne({ _id: id, userId: session.user.id });
    if (!plan) {
      return NextResponse.json({ error: "プランが見つかりません" }, { status: 404 });
    }

    const tasks = await Task.find({ planId: id }).sort({ order: 1 });

    const completedTasks = tasks.filter((t) => t.status === "completed");
    const delayedTasks = tasks.filter((t) => t.status === "delayed");
    const pendingTasks = tasks.filter((t) => t.status === "pending");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
あなたは学習プランの専門家です。以下の学習プランを再スケジュールしてください。

プランタイトル: ${plan.title}
目標: ${plan.goal}

完了済みタスク: ${completedTasks.map((t) => t.title).join(", ")}
遅れているタスク: ${delayedTasks.map((t) => t.title).join(", ")}
未完了タスク: ${pendingTasks.map((t) => t.title).join(", ")}

遅れているタスクと未完了タスクを今日以降で再スケジュールしてください。
以下のJSON形式で返してください。他のテキストは不要です：
{
  "tasks": [
    { "title": "タスク名", "date": "YYYY-MM-DD", "order": 1 },
    { "title": "タスク名", "date": "YYYY-MM-DD", "order": 2 }
  ]
}

今日の日付: ${new Date().toISOString().split("T")[0]}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const { tasks: newTasks } = JSON.parse(clean);

    await Task.deleteMany({
      planId: id,
      status: { $in: ["pending", "delayed"] },
    });

    const taskDocs = await Task.insertMany(
      newTasks.map((t: { title: string; date: string; order: number }) => ({
        planId: id,
        title: t.title,
        date: new Date(t.date),
        status: "pending",
        order: t.order,
      }))
    );

    return NextResponse.json({ tasks: taskDocs }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}