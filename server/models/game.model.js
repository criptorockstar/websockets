import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  prize: {
    type: Number,
    default: 10,
  },
  room: {
    type: String,
    required: true,
  },
});

const Game = mongoose.model("Game", GameSchema);

export default Game;
