const User = require("../models/users");
const Payment = require("../models/payment");
const Products = require("../models/products");

const PaymentController = {
  getPayment: async (req, res) => {
    try {
      const payments = await Payment.find();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name email");
      if (!user)
        return res.status(400).json({ mgs: "Tài khoản không tồn tại." });

      const { cart, paymentID, address } = req.body;

      const { _id, name, email } = user;

      const newPayment = new Payment({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();

      res.json({ mgs: "Thanh toán thành công." });
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate({ _id: id }, { sold: quantity + oldSold });
};

module.exports = PaymentController;
