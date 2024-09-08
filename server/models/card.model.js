import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  suit: {
    type: String,
  },
  number: {
    type: Number,
  },
  image: {
    type: String,
  },
});

const Card = mongoose.model("Card", CardSchema);

export default Card;
