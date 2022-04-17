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
    images: {
      type: Object,
      require: true,
    },
    views:Number
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("news", news);
