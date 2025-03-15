const ticketDAO = require(`../repository/ticketDAO.js`)
const userDAO = require(`../repository/userDAO.js`)
const uuid = require(`uuid`)

const validateUserID = async (username) => {
    const existingUser = await userDAO.getUserByUsername(username)
    
    if(existingUser){
        return existingUser[0]
    } else {
        return null
    }
}

const validateTicketData = (ticket) => {
    if(ticket.user_id && ticket.amount && ticket.description) {
        return ticket //coverage
    } else {
        return null
    }
}

const createTicket = async (ticket) => {

    const userCreated = await ticketDAO.createTicket({
        ticket_id: uuid.v4(),
        user_id: ticket.user_id,
        amount: ticket.amount,
        description: ticket.description,
        ticket_status: `pending`, //creation hard coded
        creation_timestamp: Date.now()
    })
        
    if(!userCreated) {
        return null //coverage
    } else {
        return userCreated
    }
    
}

// const getTicket = async (ticket_id) => {
//     if(ticket_id){
//         const ticket = await ticketDAO.getTicket(ticket_id)

//         if(ticket) {
//             return ticket
//         } else {
//             return null
//         }
//     } else {
//         return null
//     }
// }

// const getTickets = async () => {
//     const user = await ticketDAO.getTickets()

//     if(!user) {
//         return null
//     } else {
//         return user
//     }
// }

const getTicketsByUserID = async (user_id) => {
    if(user_id) {
        const tickets = await ticketDAO.getTicketsByUserID(user_id)
        if(tickets){
            return tickets
        } else {
            return null //coverage
        }
    } else {
        return null //coverage
    }
}

const getTicketsByStatus = async () => {
    const tickets = await ticketDAO.getTicketsByStatus()
    if(tickets) {
        return tickets
    } else {
        return null //coverage
    }
}

const updateTicketStatusByTicketID = async (ticket_id, status) => {
    if(ticket_id && status){
        const ticket = await ticketDAO.updateTicketStatusByTicketID(ticket_id, status)
        if(ticket) {
            return ticket
        } else {
            return null //coverage
        }
    } else {
        return null //coverage
    }
}

module.exports = {
    validateTicketData,
    validateUserID,
    createTicket,
    // getTicket,
    // getTickets,
    getTicketsByUserID,
    getTicketsByStatus,
    updateTicketStatusByTicketID
}