const router = require("express").Router();
const deleteUser = require("../controller/usersController");
const { register, authRole } = require("../controller/authControl");

router.post("/addUser", authRole("admin"), register);

router.delete("/deleteUser/:username", authRole("admin"), deleteUser);

module.exports = router;
