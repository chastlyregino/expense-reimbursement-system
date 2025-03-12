const userDAO = require(`../repository/userDAO.js`)

const createUser= async (user_id, username, password) => {
    const user = new userDAO.User(user_id, username, password, false)

    const result = await userDAO.createUser(user)

    if(!result) {
        return {message: `Failed to create user`}
    } else {
        return {message: `Created user`, user: result}
    }
}

const getUser = async (user_id) => {
    const result = await userDAO.getUser(user_id)

    if(!result) {
        return {message: `Failed to get user`, user_id}
    } else {
        return {message: `Found user`, user_id, user: result}
    }
}

const getUserByUsername = async (username) => {
    const result = await userDAO.getUserByUsername(username)
    
    if(!result) {
        return {message: `Failed to get user`, username}
    } else {
        return {message: `Found user`, username, user: result}
    }
}

const getUsers = async () => {
    const result = await userDAO.getUsers()

    if(!result) {
        return {message: `Failed to get users`}
    } else {
        return {message: `Found users:`, result}
    }
}

const deleteUser = async (user_id) => {
    const result = await userDAO.deleteUser(user_id)

    if(!result) {
        return {message: `Failed to delete user`, user_id}
    } else {
        return {message: `Deleted user`, user_id}
    }
}

const updateUser = async (user_id) => {
    const result = await userDAO.updateUser(user_id)

    if(!result) {
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
}