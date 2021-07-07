const User = require("../models/users");
const Payment = require("../models/payment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body; //from form
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ mgs: "Email đã tồn tại." });

      if (password.length < 6)
        return res.status(400).json({ mgs: "Mật khẩu phải lớn hơn 6 ký tự." });

      //password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      //create a user
      const newUser = new User({ name, email, password: passwordHash });
      await newUser.save();

      //create jsonwebtoken to authentication

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ mgs: "Tài khoản không tồn tại." });

      const matchPass = await bcrypt.compare(password, user.password);
      if (!matchPass) return res.status(400).json({ mgs: "Sai mật khẩu." });

      //Nếu đăng nhập thành công
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Đã đăng xuất." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Hãy đăng nhập hoặc đăng ký" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Hãy đăng nhập hoặc đăng ký" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ user, accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({ mgs: "Tài khoản không tồn tại." });
      res.json(user);
    } catch (error) {
      res.status(500).json({ mgs: error.message });
    }
  },
  addToCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(400).json({ mgs: "Tài khoản không tồn tại." });

      await User.findOneAndUpdate(
        { _id: req.user.id },
        { cart: req.body.cart }
      );

      return res.json({ mgs: "Đã thêm vào giỏ hàng." });
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const historyPayment = await Payment.find({ user_id: req.user.id });
      res.json(historyPayment);
    } catch (error) {
      return res.status(500).json({ mgs: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
module.exports = UserController;
