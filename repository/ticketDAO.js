const { DynamoDBClient } = require(`@aws-sdk/client-dynamodb`)
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, UpdateCommand, GetCommand } = require(`@aws-sdk/lib-dynamodb`)
const { logger } = require(`../util/logger.js`)
const client = new DynamoDBClient({region: `us-east-1`})

const documentClient = DynamoDBDocumentClient.from(client)


// class Ticket {
//     constructor(ticket_id, user_id, amount, description, status, creation_timestamp, update_timestamp) {
//         this.ticket_id = ticket_id,
//         this.user_id = user_id,
//         this.amount = amount,
//         this.description = description,
//         this.status = status,
//         this.creation_timestamp = creation_timestamp,
//         this.update_timestamp = update_timestamp
//     }
// }

const createTicket = async (ticket) => {
    const command = new PutCommand({
        TableName: `Tickets`,
        Item: ticket,
    })

    try {
        await documentClient.send(command)
        logger.info(`PUT command to database complete ${JSON.stringify(ticket)}`)
        return ticket
    } catch(err) {
        console.error(err)
        return null
    }
}

const getTicket = async (ticket_id) => {
    const command = new GetCommand({
        TableName: `Tickets`,
        Key: { ticket_id },
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

const getTickets = async () =>{
    const command = new ScanCommand({
        TableName: `Tickets`,
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

const getTicketsByUserID = async (user_id) => {
    const command = new ScanCommand({
        TableName: `Tickets`,
        FilterExpression: `user_id = :uid`,
        ExpressionAttributeValues: {
            ':uid': user_id
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

const getTicketsByStatus = async () => {
    const command = new ScanCommand({
        TableName: `Tickets`,
        FilterExpression: `status = :st`,
        ExpressionAttributeValues: {
            ':st': `pending`,
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

const updateTicketStatusByTicketID = async (ticket_id, status) => {
    const command = new UpdateCommand({
        TableName: `Tickets`,
        Key: {ticket_id},
        UpdateExpression: `set status = :st, update_timestamp = :ut`,
        ExpressionAttributeValues: {
            ':st': status,
            ':ut': Date.now(),
        },
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
    createTicket,
    getTicket,
    getTickets,
    getTicketsByUserID,
    getTicketsByStatus,
    updateTicketStatusByTicketID
}
