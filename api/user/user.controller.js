const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    const user = await userService.getById(req.params.id)
    res.send(user)
}

async function getUserByName(req, res) {
    try {
        const user = await userService.getByname(req.params.name)
        res.send(user)
    } catch (err) {
        res.send(null)
    }
}

async function getUsers(req, res) {
    const users = await userService.query(req.query)
    logger.debug(users);
    res.send(users)
}

async function deleteUser(req, res) {
    await userService.remove(req.params.id)
    res.end()
}

async function updateUser(req, res) {
    const template = req.body;
    const userId = req.url.substring(1)
    if (userId !== req.session.user._id) return;
    const newTemplates= req.session.user.templates.find(userTemplate=>userTemplate.name===template.name)? 
    [...req.session.user.templates.map(userTemplate=>userTemplate.name===template.name? template:userTemplate)]:
    [...req.session.user.templates, template];
    const newUser = {
        ...req.session.user,
        templates: newTemplates
    }
    const user = await userService.update(newUser);
    req.session.user=user;
    res.send(user);
}

async function toggleBoard(req, res) {
    const {boardId} = req.body;
    const userId = req.url.substring(1).split('/')[1];;
    const user = await userService.toggleBoard(userId,boardId);
    res.send(user);
}

async function removeBoardFromUser(req, res) {
    const {boardId} = req.body;
    const userId = req.url.substring(1).split('/')[1];;
    const user = await userService.removeBoardFromUser(userId,boardId);
    res.send(user);
}

async function deleteUserTemplate(req, res) {
    const templateName = req.body.pageName;
    const userId = req.url.substring(1).split('/')[1];
     if (userId !== req.session.user._id) return;
    const newTemplates= req.session.user.templates.filter(userTemplate=>userTemplate.name!==templateName); 
    const newUser = {
        ...req.session.user,
        templates: newTemplates
    }
    const user = await userService.update(newUser);
    req.session.user=user;
    res.send(user);
}



module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getUserByName,
    deleteUserTemplate,
    toggleBoard,
    removeBoardFromUser
}

