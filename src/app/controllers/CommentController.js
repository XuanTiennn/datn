const Comment = require("../models/comment");
// const News = require("../../app/models/products");

const comment = {
  getComment: async (req, res) => {
    const news = await Comment.findById(req.params.id);
    res.json(news);
    res.json({ mgs: "get a item" });
  },
  getComments: async (req, res) => {
    try {
      const comment = await Comment.find({ productId: req.params.id });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  createComment: async (req, res) => {
    try {
      //chỉ admin mới có thể thêm ,sửa ,xóa category
      const { content, userId, productId, likes = 0 } = req.body;
      const newComment = new Comment({ content, userId, productId, likes });
      await newComment.save();

      res.json({ mgs: "Thêm bình luận thành công." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.json({ mgs: "Đã xóa một bình luận." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  editComment: async (req, res) => {
    try {
      const { content, likes, userId, productId } = req.body;
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { content, likes, userId, productId }
      );
      res.json({ mgs: "Đã cập nhật một bình luận." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
};

module.exports = comment;
