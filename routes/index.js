const express = require("express");
const router = express.Router();
const admin = require("./adminRoutes");
const user = require("./userRoutes");
const task = require("./task");

router.use("/admin", admin);
router.use("/user", user);
router.use("/task", task);

module.exports = router;
