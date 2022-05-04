const express = require("express");
const router = express.Router();

const ProductsController = require("../app/controllers/ProductsController");

router
  .route("/products")
  .get(ProductsController.getProducts)
  .post(ProductsController.createProduct)
  .patch(ProductsController.editStatus);
router
  .route("/products/:id")
  .delete(ProductsController.deleteProduct)
  .put(ProductsController.editProduct)
  .get(ProductsController.getItem);
router.route("/products/filter").post(ProductsController.searchProducts);

module.exports = router;
