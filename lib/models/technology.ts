import { Schema, model, models, type Document } from "mongoose";

export interface TechnologyDocument extends Document {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "AI Tooling";
  iconUrl?: string;
  officialUrl?: string;
}

const TechnologySchema = new Schema<TechnologyDocument>({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "Database", "DevOps", "AI Tooling"],
    required: true,
  },
  iconUrl: String,
  officialUrl: String,
});

// Same delete-guard note as SkillModel — check ProjectModel.exists({
// "techStack.technologyId": id }) before allowing delete.
export const TechnologyModel =
  models.Technology || model<TechnologyDocument>("Technology", TechnologySchema);
