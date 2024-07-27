//Authentication control file which allows register, login, resets password, authenticates user and userrole
const userModel = require("../model/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Register initial user and later using this function while adding user but authorized access only
const register = async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    if (!(username && password && userType))
      res.status(400).send("All input is required");

    const userExists = await userModel.findOne({ username: username });
    if (userExists) res.send("User already exists!");

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      password: encryptedPassword,
      userType,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

//login functionality
const login = async (req, res) => {
  try {
    console.log("Loggin");
    const { username, password } = req.body;
    if (!(username && password)) res.send("Enter both the fields");

    const user = await userModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id }, "secretKey", {
        expiresIn: "2h",
      });

      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

//Reset password functionality when a user forgets the password, need to pass both username and the password that needs to be reset in body
const resetPassword = async function (req, res) {
  const { username } = req.params;
  await userModel
    .findOne(username)
    .then(res.status(400).send("User doesnt exists"))
    .catch((err) => {
      console.log(err);
    });
  encryptedPassword = await bcrypt.hash(req.body.password, 10);
  const updatePassword = await userModel.findOneAndUpdate(
    { username: username },
    { password: encryptedPassword }
  );

  if (updatePassword) res.status(200).send("Password Updated Successfully");
};

function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to sign in");
  }

  next();
}

function authRole(role) {
  return (req, res, next) => {
    console.log(req.user);
    console.log(req.user.userType);
    if (!role.includes(req.user.userType)) {
      res.status(401);
      return res.send("Not allowed");
    }
    next();
  };
}

module.exports = {
  register,
  login,
  resetPassword,
  authUser,
  authRole,
};
