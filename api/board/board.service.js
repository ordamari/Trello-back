const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
module.exports = {
    query,
    getById,
    remove,
    add,
    update,
}


async function query(filterBy = {}) {
    const criteria =  _buildCriteria(filterBy)
    const collection = await dbService.getCollection('board')
    try {
        const boards = await collection.find(criteria).toArray();
        return boards
    } catch (err) {
        console.log('ERROR: cannot find boards')
        throw err;
    }


}
async function getById(boardId) {
    const collection = await dbService.getCollection('board')
    try {
        const board = await collection.findOne({ "_id": ObjectId(boardId) })
        return board
    } catch (err) {
        console.log(`ERROR: while finding board ${boardId}`)
        throw err;
    }
}
async function remove(boardId) {
    const collection = await dbService.getCollection('board')
    try {
        await collection.deleteOne({ "_id": ObjectId(boardId) })
    } catch (err) {
        console.log(`ERROR: cannot remove user ${boardId}`)
        throw err;
    }
}
async function update(board) {
    const collection = await dbService.getCollection('board')
    board._id = ObjectId(board._id);

    try {
        await collection.replaceOne({ '_id': board._id }, board)
        return board
    } catch (err) {
        console.log(`ERROR: cannot update board ${board._id}`)
        throw err;
    }
}
async function add(board) {
    const collection = await dbService.getCollection('board')
    try {
        await collection.insertOne(board);
        return board;
    } catch (err) {
        console.log(`ERROR: cannot insert board: ${board}`)
        throw err;
    }
}
function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.title) {
        criteria.title = new RegExp(filterBy.title, 'ig')
    }

    return criteria;
}