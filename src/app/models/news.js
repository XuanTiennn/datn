const mongoose = require("mongoose");

const news = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    content: String,
    status: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("news", news);
