const express = require('express')
const router = express.Router()
const admin = require('../controllers/users')
const auth = require('../middlewares/authentication')
const author = require('../middlewares/authorization')

router.post("/register", admin.register) 
router.post("/login", admin.login)  
router.get("/:id", auth, author.authAdmin, admin.getOneUser) 
router.get("/", auth, author.authAdmin, admin.getAllUsers)
router.put("/:id", auth, author.authAdmin, admin.updateDataUsers) 
router.delete("/:id", auth, author.authAdmin, admin.deleteUsers)

module.exports = router