"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from "next/link";
import CalendarToolbar from "@/components/CalendarToolbar";
import { View } from "react-big-calendar";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { ja },
});

interface Task {
  _id: string;
  title: string;
  date: string;
  status: "pending" | "completed" | "delayed";
  order: number;
}

interface Plan {
  _id: string;
  title: string;
  goal: string;
  status: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

const statusConfig = {
  pending: { label: "未完了", class: "border-border text-muted-foreground" },
  completed: { label: "完了", class: "border-green-500 text-green-500" },
  delayed: { label: "遅れ", class: "border-red-500 text-red-500" },
};

export default function PlanDetailPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const [rescheduling, setRescheduling] = useState(false);

  const handleReschedule = async () => {
  setRescheduling(true);
  const res = await fetch(`/api/plans/${id}/reschedule`, {
    method: "PATCH",
  });
  const data = await res.json();
  console.log(data);
  setRescheduling(false);
  setTasks(data.tasks);
};

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch(`/api/plans/${id}`);
      const data = await res.json();
      setPlan(data.plan);
      setTasks(data.tasks);
      setLoading(false);
    };
    if (id) fetchPlan();
  }, [id]);

  const handleStatusChange = async (taskId: string, status: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
  };

  const events: CalendarEvent[] = tasks.map((task) => ({
    id: task._id,
    title:
      task.status === "completed"
        ? `✅ ${task.title}`
        : task.status === "delayed"
          ? `⚠️ ${task.title}`
          : task.title,
    start: new Date(task.date),
    end: new Date(task.date),
    resource: task,
  }));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">読み込み中...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← ダッシュボードに戻る
        </Link>

<div className="mb-8 flex justify-between items-start">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">{plan?.title}</h1>
    <p className="text-sm text-muted-foreground mt-1">{plan?.goal}</p>
  </div>
  <button
    onClick={handleReschedule}
    disabled={rescheduling}
    className="text-sm border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
  >
    {rescheduling ? "再スケジュール中..." : "プランを修正する"}
  </button>
</div>

        <div className="border border-border rounded-xl mb-8">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="ja"
            style={{ height: 500 }}
            components={{ toolbar: CalendarToolbar }}
            view={view}
            date={date}
            onView={(v) => setView(v)}
            onNavigate={(d) => setDate(d)}
          />
        </div>

        <h2 className="text-lg font-semibold mb-4">タスク一覧</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="border border-border rounded-xl px-5 py-4 bg-muted flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(task.date).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className={`text-xs border px-2 py-1 rounded-full bg-background outline-none ${statusConfig[task.status].class}`}
              >
                <option value="pending">未完了</option>
                <option value="completed">完了</option>
                <option value="delayed">遅れ</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
