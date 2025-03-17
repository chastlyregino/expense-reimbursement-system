const userDAO = require(`../repository/userDAO.js`)
const bcrypt = require(`bcryptjs`)
const uuid = require(`uuid`)


const validateUserData = (user) => {
    if(user.username && user.password) {
        return user
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
        return null
    } else {
        return userCreated
    }
    
}

const getUser = async (user_id) => {
    if(user_id){
        const user = await userDAO.getUser(user_id)

        if(user) {
            return user
        } else {
            return null
        }
    } else {
        return null
    }
}

const getUserByUsername = async (username) => {
    if(username){
        const user = await userDAO.getUserByUsername(username)
        if(user){
            return user[0]
        }else{
            return null
        }
    } else {
        return null
    }
}

const updateUser = async (user_id) => {
    const existingUser = await getUser(user_id)
    
    if(existingUser) {
        const user = await userDAO.updateUser(existingUser.user_id, !existingUser.is_manager)

        if(!user) {
            return null
        } else {
            return user
        }
    } else {
        return null
    }
}

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUserByUsername,
    validateUserCredentials,
    validateUserData,
}
