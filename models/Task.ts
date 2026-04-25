import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  planId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  status: "pending" | "completed" | "delayed";
  order: number;
}

const TaskSchema = new Schema<ITask>({
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "completed", "delayed"], default: "pending" },
  order: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);