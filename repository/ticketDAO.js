const { DynamoDBClient } = require(`@aws-sdk/client-dynamodb`)
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, UpdateCommand, GetCommand } = require(`@aws-sdk/lib-dynamodb`)

const client = new DynamoDBClient({region: `us-east-1`})

const documentClient = DynamoDBDocumentClient.from(client)


class Ticket {
    constructor(ticket_id, user_id, amount, description, status, creation_timestamp, update_timestamp) {
        this.ticket_id = ticket_id,
        this.user_id = user_id,
        this.amount = amount,
        this.description = description,
        this.status = status,
        this.creation_timestamp = creation_timestamp,
        this.update_timestamp = update_timestamp
    }
}

module.exports = {
    Ticket,
}