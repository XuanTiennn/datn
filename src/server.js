const path = require("path");
const express = require("express");
const { urlencoded, json } = require("express");
const db = require("./config/db");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
//import routes
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/categories");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "/public")));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(json());
app.use(cors());
//routes
app.use("/api", productsRouter);
app.use("/user", usersRouter);
app.use("/api", categoryRouter);


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
db.connect();
