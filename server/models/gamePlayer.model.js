import mongoose from "mongoose";

const GamePlayerSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  isWinner: {
    type: Boolean,
    default: false,
  },
});

const GamePlayer = mongoose.model("GamePlayer", GamePlayerSchema);

export default GamePlayer;
