"use client";

import { ToolbarProps } from "react-big-calendar";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<CalendarEvent>) {
  return (
    <div className="flex justify-between items-center p-3 border-b border-border">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          className="text-sm px-3 py-1 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="text-sm px-3 py-1 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          今日
        </button>
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          className="text-sm px-3 py-1 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          →
        </button>
      </div>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-2">
        {(["month", "week", "day", "agenda"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onView(v)}
            className={`text-sm px-3 py-1 border rounded-lg transition-colors ${
              view === v
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted"
            }`}
          >
            {v === "month"
              ? "月"
              : v === "week"
                ? "週"
                : v === "day"
                  ? "日"
                  : "一覧"}
          </button>
        ))}
      </div>
    </div>
  );
}
