import mongoose, { Schema, Document } from 'mongoose'

export interface IPlan extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    goal: string;
    status: 'active' | 'completed';
}

const PlanSchema = new Schema<IPlan>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type:String, required: true },
    goal: { type:String, required: true },
    status: { type:String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);