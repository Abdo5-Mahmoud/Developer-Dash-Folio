import { Schema, model, models, type Document } from "mongoose";

export interface SkillDocument extends Document {
  name: string;
  category: "Language" | "Framework" | "Concept" | "Soft skill";
  proficiency?: "Familiar" | "Proficient" | "Expert";
}

const SkillSchema = new Schema<SkillDocument>({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ["Language", "Framework", "Concept", "Soft skill"],
    required: true,
  },
  proficiency: { type: String, enum: ["Familiar", "Proficient", "Expert"] },
});

// Guard against deleting a Skill still referenced by a Project — enforce in
// the API route (check ProjectModel.exists({ skillIds: id })) before delete,
// per PRD 6.5 "guard against deleting a referenced entity."
export const SkillModel = models.Skill || model<SkillDocument>("Skill", SkillSchema);
