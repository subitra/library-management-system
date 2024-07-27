require("./config/db").connect();
const express = require("express");
const bodyParser = require("body-parser");
const bookRoute = require("./Routes/bookRoutes");
const authRoute = require("./Routes/authRoute");

const jwt = require("jsonwebtoken");
const User = require("./model/users");
const userRoute = require("./Routes/userRoutes");
const verifyToken = require("./middleware/auth");

const app = express();
console.log("started");

app.use(bodyParser.json());

/*app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const decoded = jwt.verify(accessToken, "secretKey");

      console.log(decoded);
      const userId = decoded.user_id;

      req.user = await User.findById(userId);

      console.log(req.user);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});*/


//app.use(verifyToken);
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", bookRoute);
app.listen(8080, () => console.log("App listening on port 8080"));
