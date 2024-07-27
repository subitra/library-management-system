const userModel = require("../model/users");

// Delete user functionality when a user needs to be deleted by the admin
const deleteUser = async function (req, res) {
  const { username } = req.params;
  const userExists = await userModel.findOne({ username });

  if (!userExists) res.status(400).send("User doesn't exists");
  else {
    const userDelete = await userModel.findOneAndDelete({ username });
    if (userDelete) res.status(200).send("User deleted");
  }
};

module.exports = deleteUser;
