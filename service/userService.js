const userDAO = require(`../repository/userDAO.js`)
const bcrypt = require(`bcryptjs`)
const uuid = require(`uuid`)


const validateUserData = (user) => {
    if(user.username && user.password) {
        return user //coverage
    } else {
        return null
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

    const userCreated = await userDAO.createUser({
        user_id: uuid.v4(),
        username: user.username,
        password: user.password,
        is_manager: false
    })
        
    if(!userCreated) {
        return null //coverage
    } else {
        return userCreated
    }
    
}

const getUser = async (user_id) => {
    if(user_id){
        const user = await userDAO.getUser(user_id)
        if(user){
            return user
        }else{
            return null
        }
    } else {
        return null
    }
} // to test

const getUserByUsername = async (username) => {
    if(username){
        const user = await userDAO.getUserByUsername(username)
        if(user){
            //console.log(user[0])
            return user[0]
        }else{
            return null //coverage
        }
    } else {
        return null //coverage
    }
}

const getUsers = async () => {
    const user = await userDAO.getUsers()

    if(!user) {
        return null
    } else {
        return user
    }
} // to test

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
} // to test

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