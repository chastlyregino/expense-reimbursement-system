const { DynamoDBClient } = require(`@aws-sdk/client-dynamodb`)
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, UpdateCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const { logger } = require(`../util/logger.js`)

const client = new DynamoDBClient({region: `us-east-1`})

const documentClient = DynamoDBDocumentClient.from(client)

const createUser = async (user) => {
    const command = new PutCommand({
        TableName: `Users`,
        Item: user,
    })

    try {
        await documentClient.send(command)
        logger.info(`PUT command to database complete ${JSON.stringify(user)}`)
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
        const data = await documentClient.send(command)
        logger.info(`GET command to database complete ${JSON.stringify(data.Item)}`)
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
        logger.info(`SCAN command to database complete ${JSON.stringify(data.Items)}`)
        return data.Items
    } catch(err) {
        console.error(err)
        return null
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
        logger.info(`UPDATE command to database complete ${JSON.stringify(user_id)}`)
        return user_id
    } catch(err) {
        console.error(err)
        return null
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    getUserByUsername,
}