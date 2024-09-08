import mongoose from "mongoose";
import Level from "./level.model.js";

const PlayerSchema = new mongoose.Schema({
  credits: {
    type: Number,
    default: 10,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
  gamesLost: {
    type: Number,
    default: 0,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  exp: {
    type: Number,
    default: 0,
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level",
    default: null,
  },
});

// Asignar el nivel predeterminado después de crear el documento
PlayerSchema.pre("save", async function (next) {
  if (this.isNew && !this.level) {
    const level = await Level.findOne().sort({ _id: 1 }); // Obtener el primer nivel
    this.level = level._id;
  }
  next();
});

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
