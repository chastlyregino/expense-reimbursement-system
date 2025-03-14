const { DynamoDBClient } = require(`@aws-sdk/client-dynamodb`)
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, UpdateCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const uuid = require(`uuid`)

const client = new DynamoDBClient({region: `us-east-1`})

const documentClient = DynamoDBDocumentClient.from(client)

const createUser = async (user) => {
    const command = new PutCommand({
        TableName: `Users`,
        Item: {
            user_id: uuid.v4(),
            username: user.username,
            password: user.password,
            is_manager: false
        },
    })

    try {
        await documentClient.send(command)
        return user
    } catch(err) {
        console.error(err)
        return null
    }
}

const getUser = async (user_id) => {
    const command = new GetCommand({
        TableName: `Users`,
        Key: { user_id },
    })

    try {
        const data = await documentClient.send(command);
        return data.Item
    } catch(err) {
        console.error(err)
        return null
    }
}

const getUserByUsername = async (username) => {
    const command = new ScanCommand({
        TableName: `Users`,
        FilterExpression: `username = :un`,
        ExpressionAttributeValues: {
            ':un': username
        }
    })

    try {
        const data = await documentClient.send(command)
        return data.Items
    } catch(err) {
        console.error(err)
        return null
    }
}

const getUsers = async () =>{
    const command = new ScanCommand({
        TableName: `Users`,
    })

    try {
        const data = await documentClient.send(command)
        return data.Items
    } catch(err) {
        console.error(err)
        return null
    }
}

const deleteUser = async (user_id) => {
    const command = new DeleteCommand({
        TableName: `Users`,
        Key: {user_id},
    })

    try {
        await documentClient.send(command);
        return user_id;
    } catch(err) {
        console.error(err);
        return null;
    }
}

const updateUser = async (user_id) => {
    const command = new UpdateCommand({
        TableName: `Users`,
        Key: {user_id},
        UpdateExpression: `set is_manager = :i_m`,
        ExpressionAttributeValues: {':i_m': true},
    })

    try {
        await documentClient.send(command)
        return user_id
    } catch(err) {
        console.error(err)
        return null
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