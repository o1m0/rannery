import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";

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
    const { status } = await req.json();

    if (!["pending", "completed", "delayed"].includes(status)) {
      return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
    }

    await connectToDatabase();

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "タスクが見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}