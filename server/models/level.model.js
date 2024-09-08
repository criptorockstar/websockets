import mongoose from "mongoose";

// Define the Level schema
const LevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Se requiere un nombre para el nivel"],
  },
  badge: {
    type: String,
    required: [true, "Se requiere un distintivo para el nivel"],
  },
  min_bet: {
    type: Number,
    required: [true, "Se requiere una apuesta mínima para el nivel"],
  },
  free_claims: {
    type: Number,
    required: [
      true,
      "Se requiere la cantidad de reclamaciones gratuitas para el nivel",
    ],
  },
});

// Create and export the Level model
const Level = mongoose.model("Level", LevelSchema);

export default Level;
