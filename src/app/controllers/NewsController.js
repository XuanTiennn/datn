const News = require("../models/news");
// const News = require("../../app/models/products");

const news = {
  getItem: async (req, res) => {
    const news = await News.findById(req.params.id);
    res.json(news);
    res.json({ mgs: "get a item" });
  },
  getNews: async (req, res) => {
    try {
      const news = await News.find();
      res.json(news);
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  createNew: async (req, res) => {
    try {
      //chỉ admin mới có thể thêm ,sửa ,xóa category
      const { title, content, status,images,views=0 } = req.body;
      const newNew = new News({ title, content, status,images,views });
      await newNew.save();

      res.json({ mgs: "Thêm bài viết thành công." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  deleteNew: async (req, res) => {
    try {
      await News.findByIdAndDelete(req.params.id);
      res.json({ mgs: "Đã xóa một bài viết." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  editNew: async (req, res) => {
    try {
      const { title, content, status,images,views } = req.body;
      await News.findOneAndUpdate(
        { _id: req.params.id },
        { title, content, status,images,views }
      );
      res.json({ mgs: "Đã cập nhật một bài viết." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
};

module.exports = news;
