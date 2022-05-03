const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    productId: {
      type: String,
      require: true,
    },
    userId: {
      type: Object,
      require: true,
    },
    likes: Number,
    rating: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", comment);
