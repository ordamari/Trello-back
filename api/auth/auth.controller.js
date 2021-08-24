const authService = require('./auth.service')
const logger = require('../../services/logger.service')
module.exports = {
    login,
    signup,
    logout
}
async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}

//:
async function signup(req, res) {
    try {
        var { username, password, imgUrl, signupBy } = req.body
        if (!imgUrl) imgUrl = 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'
        // logger.debug(username + ", " + password + ', ' + imgUrl)
        let account=null;
        if (signupBy === 'wixer') account = await authService.signup(username, password, imgUrl, signupBy)
        else account = await authService.signupSocial(username, password, imgUrl, signupBy)
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)

    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}