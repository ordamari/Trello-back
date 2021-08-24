const express = require('express');
const { getBoards, getBoard, deleteBoard, updateBoard, addBoard } = require('./board.controller')
const router = express.Router()



router.get('/:id', getBoard)
router.get('/', getBoards)
router.put('/:id', updateBoard)
// router.delete('/:id', requireAuth, requireAdmin, deleteBoard)
router.delete('/:id', deleteBoard)
// router.post('/', requireAuth, requireAdmin, addBoard)
router.post('/', addBoard)

module.exports = router