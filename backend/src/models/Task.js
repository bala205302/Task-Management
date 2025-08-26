import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    totalTask: { type: Number, default: 1, min: 0 },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo", index: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);


