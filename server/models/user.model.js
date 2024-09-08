import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: "http://localhost:3001/avatar/default.png" },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
