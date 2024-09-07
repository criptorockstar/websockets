import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "usuario no disponible"],
      required: [true, "Se requiere un usuario"],
    },
    email: {
      type: String,
      unique: [true, "Ya existe una cuenta"],
      required: [true, "Se requiere un correo"],
    },
    password: {
      type: String,
      required: [true, "Se requiere una contraseña"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
