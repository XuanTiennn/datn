const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/quenmatkhau", (req, res) => {
  const { receiEmail } = req.body;

  const user = "xtienclone2@gmail.com";
  const pass = "tien2000";
  const subject = "Yêu cầu đặt lại mật khẩu cho Shop Cart - E-Commerce ";

  // create transport
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // create mail option
  const mailOptions = {
    to: receiEmail,
    subject: subject + Date.now(),
    html: `Xin chào ${receiEmail}!

    Ai đó đã yêu cầu mật khẩu mới cho tài khoản sau trên Shop Cart - Ecommerce:
    
    Tên người dùng: ${receiEmail}
    
    Nếu bạn không đưa ra yêu cầu này, chỉ cần bỏ qua email này. Nếu bạn muốn tiếp tục:
    
    
    <a href="http://localhost:3000/user/resetPassword/${receiEmail}">Nhấn vào đây để đặt lại mật khẩu của bạn</a>
    
    Cảm ơn vì đã đọc`,
  };

  // perform send mail
  transport.sendMail(mailOptions, function callback(error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        message: "Có lỗi xảy ra!",
      });
    } else {
      console.log("Send mail successfully!");
      res.status(200).send({
        message: "Vui lòng kiểm tra email ,thư rác!",
      });
    }
  });
});

module.exports = router;
