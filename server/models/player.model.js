import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
});

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
