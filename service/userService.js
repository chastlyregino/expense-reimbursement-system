const userDAO = require('../repository/userDAO.js')

async function createUser(user_id, username, password){
    const user = new userDAO.User(user_id, username, password, false)

    const result = await userDAO.createItem(user);

    if(!result){
        return {message: 'Failed to create item'}
    }else{
        return {message: 'Created item', user: result}
    }
}

async function getUser(user_id){
    const result = await userDAO.getUser(user_id);

    if(!result){
        return {message: "Failed to get user", user_id};
    }else{
        return {message: "Found user",user_id, user: result}
    }
}

async function getUsers(){
    const result = await userDAO.getUsers()
    if(!result){
        return {message: 'Failed to get users'}
    }else{
        return {message: 'Found users:', result}
    }
}

async function deleteUser(user_id){
    const result = await userDAO.deleteUser(user_id)

    if(!result){
        return {message: 'Failed to delete user', user_id}
    }else{
        return {message: 'Deleted user', user_id}
    }
}

async function updateUser(user_id){
    const result = await userDAO.updateUser(user_id);

    if(!result){
        return {message: "Failed to update user", user_id};
    }else{
        return {message: "User updates", result}
    }
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser
}