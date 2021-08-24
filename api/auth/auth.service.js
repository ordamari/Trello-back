const bcrypt = require('bcryptjs')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')

const saltRounds = 10

async function login(username, password) {
    // logger.debug(`auth.service - login with username: ${username}`)
    if (!username || !password) return Promise.reject('username and password are required!')
    const user = await userService.getByname(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        logger.warn('No match')
        return Promise.reject('Invalid username or password')
    }
    const userToReturn = {...user}
    delete userToReturn.password;
    return userToReturn;
}

async function signup(username, password, imgUrl,signupBy) {
    // logger.debug(`auth.service - signup with username: ${username}, password: ${password}, imgUrl: ${imgUrl}`)
    if (!username || !password) return Promise.reject('username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    const newUser = {
        signupBy,
        username,
        password:hash,
        profileImg: imgUrl,
        boards:['60e41ecca135ac1f2afcae46']
    }
    return userService.add(newUser)

}

async function signupSocial(username, password, imgUrl,signupBy) {
    // logger.debug(`auth.service - signup with username: ${username}, password: ${password}, imgUrl: ${imgUrl}`)
    if (!username || !password) return Promise.reject('username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    const user= await userService.checkIsAlreadySignup({username, password, imgUrl,signupBy});
    const newUser = {
        signupBy,
        username,
        password:hash,
        profileImg: imgUrl,
        boards:['60e41ecca135ac1f2afcae46']
    }
    
    if(user){

        return user
    } 

    return userService.add(newUser)

}

module.exports = {
    signup,
    login,
    signupSocial
}