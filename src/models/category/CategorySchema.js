import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("strictQuery", false);
export default mongoose.model("Category", categorySchema);
