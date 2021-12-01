const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const auth = require('../middlewares/authentication')
const author = require('../middlewares/authorization')

router.post("/register", author.authAdmin, users.register)
router.post("/login", users.login)  
router.get("/:id", auth, users.getOneUser)
router.put("/:id", auth, author.authUser, users.updateDataUsers)
router.delete("/:id", auth, author.authUser, users.deleteUsers)

module.exports = router