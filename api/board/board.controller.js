const boardService = require('./board.service')
const userService = require('../user/user.service')


module.exports = {
    getBoards,
    getBoard,
    deleteBoard,
    addBoard,
    updateBoard
}
async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        console.log('got err:', err);
        res.status(500).send({ error: 'cannot get boards..@@' })

    }

}
async function getBoard(req, res) {
    const board = await boardService.getById(req.params.id)
    res.send(board)
}

async function deleteBoard(req, res) {
    await boardService.remove(req.params.id)
    res.end()
}

async function updateBoard(req, res) {
    const board = req.body;
    await boardService.update(board)
    res.send(board)
}
async function addBoard(req, res) {
    var { board, userId } = req.body;
    board = await boardService.add(board);
    const user = await userService.addBoard(userId, board._id);
    req.session.user = user;
    res.send({board,user})
}