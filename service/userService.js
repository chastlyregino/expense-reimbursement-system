const userDAO = require(`../repository/userDAO.js`)
const bcrypt = require("bcryptjs")


const validateUserData = (user) => {
    if(!user.username || !user.password) {
        return null
    } else {
        return user
    }
}

const validateUserCredentials = async (user) => {
    const existingUser = await getUserByUsername(user.username)

    if(existingUser && (await bcrypt.compare(user.password, existingUser.password))) {
        return existingUser
    } else {
        return null
    }
}

const createUser = async (user) => {
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password, saltRounds)

    const userCreated = await userDAO.createUser(user)
        
    if(!userCreated) {
        return null
    } else {
        return userCreated
    }
    
}

const getUser = async (user_id) => {
    if(username){
        const user = await userDAO.getUser(user_id)
        if(user){
            return user
        }else{
            return null
        }
    }{
        return null
    }
}

const getUserByUsername = async (username) => {
    if(username){
        const user = await userDAO.getUserByUsername(username)
        if(user){
            //console.log(user[0])
            return user[0]
        }else{
            return null
        }
    }{
        return null
    }
}

const getUsers = async () => {
    const user = await userDAO.getUsers()

    if(!user) {
        return {message: `Failed to get users`}
    } else {
        return user
    }
}

const deleteUser = async (user_id) => {
    const user = await userDAO.deleteUser(user_id)

    if(!user) {
        return {message: `Failed to delete user`, user_id}
    } else {
        return {message: `Deleted user`, user_id}
    }
}

const updateUser = async (user_id) => {
    const user = await userDAO.updateUser(user_id)

    if(!user) {
        return {message: `Failed to update user`, user_id}
    } else {
        return {message: `User updates`, result}
    }
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getUserByUsername,
    validateUserCredentials,
    validateUserData,
}