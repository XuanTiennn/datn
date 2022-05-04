const Products = require("../models/products");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString }; // queryString=req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const ProductsController = {
  getProducts: async (req, res) => {
    try {
      const allProduct = Products.find();
      let query1;
      let query2;
      if (req.query.category && req.query.category.includes(",")) {
        query1 = req.query.category.split(",");
      } else {
        query1 = req.query.category;
      }
      // if (req.query.color && req.query.color.includes(",")) {
      //   query2 = req.query.color.split(",");
      // } else if (req.query.color && req.query.color.length > 0) {
      //   query2 = [req.query.color];
      // } else {
      //   query2 = ["Trắng", "Xanh", "Đen", "Vàng", "Đỏ"];
      // }
      delete req.query.category;
      // req.query.color &&
      //   req.query.color.includes(",") &&
      //   delete req.query.color;
      const features = new APIfeatures(
        Products.find({
          category: { $in: query1 },
        }),
        // Products.find({
        //   $and: [{ category: { $in: query1 } }, { color: { $in: query2 } }],
        // }),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;

      res.json({
        status: "success",
        total: allProduct.length,
        products,
        query1,
        query2,
      });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  searchProducts: async (req, res) => {
    try {
      const allProduct = await Products.find({
        category: { $in: req.body.categories },
      });

      res.json({
        status: "success",
        allProduct,
      });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
        salePercen,
        color,
        service,
        status,
        views,
        remain,
      } = req.body;
      if (!images) return res.status(400).json({ mgs: "Không có ảnh upload" });

      const product = await Products.findOne({ product_id });
      if (product) return res.status(400).json({ msg: "Sản phẩm đã tồn tại." });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
        color,
        salePercen,
        service,
        status,
        views,
        remain,
      });

      await newProduct.save();
      res.json({ mgs: "Đã tạo một sản phẩm" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ mgs: "Đã xóa một sản phẩm" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  editProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        content,
        images,
        category,
        color,
        salePercen,
        service,
        status,
        views,
        remain,
      } = req.body;
      if (!images) return res.status(400).json({ mgs: "không ảnh upload" });
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
          color,
          salePercen,
          service,
          status,
          views,
          remain,
        }
      );
      res.json({ mgs: "Đã cập nhật một sản phẩm" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  editStatus: async (req, res) => {
    try {
      await Products.findOneAndUpdate(
        { _id: req.body.id },
        { status: req.body.status }
      );
      res.json({ mgs: "Đã cập nhật một sản phẩm" });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  getItem: async (req, res) => {
    const product = await Products.findById(req.params.id);
    res.json(product);
    res.json({ mgs: "get a item" });
  },
};

module.exports = ProductsController;
