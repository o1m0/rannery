import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Plan from "@/models/Plan";
import Task from "@/models/Task";

export async function GET(
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

    return NextResponse.json({ plan, tasks }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}