const express = require('express')
const task = require('../controllers/task')
const author = require('../middlewares/authorization')
const auth = require('../middlewares/authentication')
const router = express.Router()

router.post('/assign', auth, author.authAdmin, task.sendTask)
router.put('/unassign/:id', auth, author.authAdmin, task.updateTask)
router.delete('/:id', auth, author.authAdmin, task.deleteTask)
router.get('/:id', auth, author.authAdmin, task.getOneTask)
router.get('/', auth, author.authAdmin, task.getAllTask)

module.exports = router
