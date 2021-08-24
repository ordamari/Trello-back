const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcryptjs')



module.exports = {
    query,
    getById,
    getByname,
    // remove,
    update,
    add,
    checkIsAlreadySignup,
    addBoard,
    toggleBoard,
    removeBoardFromUser
}

async function checkIsAlreadySignup(userCheck) {
    const users = await query();
    const user = users.find((user) => user.signupBy === userCheck.signupBy && user.username === userCheck.username)
    if (!user) return null;
    const match = await bcrypt.compare(userCheck.password, user.password)
    return match ? user : null;
}


async function query(filterBy = {}) {
    // const criteria = (filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find({}).toArray();
        // users.forEach(user => delete user.password);

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}


async function getByname(username) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${username}`)
        throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${username}`)
        throw err;
    }
}

async function add(newUser) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(newUser)
        return newUser;
    } catch (err) {
        console.log(`ERROR while adding newUser: ${newUser}`);
        throw err;
    }
}

async function update(newUser) {
    const collection = await dbService.getCollection('user') 
    const beforeUser = await collection.findOne({ "_id": ObjectId(newUser._id) });
    newUser = {
        ...newUser,
        password: beforeUser.password,
        _id:ObjectId(newUser._id)
    }
    try {
        await collection.replaceOne({ "_id": newUser._id }, newUser)
        return newUser
    } catch (err) {
        console.log(`ERROR: cannot update user ${newUser._id}`)
        throw err;
    }
}

async function toggleBoard(userId,boardId) {
    const collection = await dbService.getCollection('user') 
    const beforeUser = await collection.findOne({ "_id": ObjectId(userId) });
    const userBoards = beforeUser.boards.some(userBoardId=>boardId===userBoardId)?(
        beforeUser.boards.filter(userBoardId=>boardId!==userBoardId)
    ):(
        [...beforeUser.boards,boardId]
    )
    var newUser = {
        ...beforeUser,
        boards: userBoards,
        password: beforeUser.password,
        _id:ObjectId(userId)
    }
    try {
        await collection.replaceOne({ "_id": newUser._id }, newUser)
        return newUser
    } catch (err) {
        console.log(`ERROR: cannot update user ${newUser._id}`)
        throw err;
    }
}

async function removeBoardFromUser(userId,boardId) {
    const collection = await dbService.getCollection('user') 
    const beforeUser = await collection.findOne({ "_id": ObjectId(userId) });
    const userBoards = beforeUser.boards.filter(userBoardId=>boardId!==userBoardId);

    var newUser = {
        ...beforeUser,
        boards: userBoards,
        password: beforeUser.password,
        _id:ObjectId(userId)
    }
    try {
        await collection.replaceOne({ "_id": newUser._id }, newUser)
        return newUser
    } catch (err) {
        console.log(`ERROR: cannot update user ${newUser._id}`)
        throw err;
    }
}

async function addBoard(userId,boardId) {
    var collection = await dbService.getCollection('user') 
    const user = await collection.findOne({ "_id": ObjectId(userId)});
    var newUser = {
        ...user,
        _id:ObjectId(user._id),
        boards:[...user.boards,`${boardId}`]
    }
    
    try {
        await collection.replaceOne({ "_id": ObjectId(userId) }, newUser)
        delete newUser.password
        return newUser
    } catch (err) {
        console.log(`ERROR: cannot update user ${newUser._id}`)
        throw err;
    }
}










