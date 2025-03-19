const express = require(`express`)
const { authenticateToken } = require('../util/jwt')
const ticketService = require(`../service/ticketService.js`)
const userService = require(`../service/userService.js`)

const router = express.Router()
// validateUserID, validateTicketData

const validateUserID = async (req, res, next) => {
    if(res.locals.user) {
        const user = res.locals.user.username
        const data = await ticketService.validateUserID(user)

        if(data) {
            res.locals.user.userData = data
            next()
        } else {
            res.status(400).json({message: `Invalid username`, data: res.locals.user.username})
        }
    } else {
        res.status(403).json({message: `Forbidden Access`})
    }
    
}

const validateIfManager = async (req, res, next) => {
    if(res.locals.user.userData.is_manager) {
        next()
    } else {
        res.status(403).json({message: `Forbidden Access`})
    }
}

const validateTicket = async (req, res, next) => {
    const ticket = await ticketService.getTicket(req.body.ticket_id)
    if(ticket){
        if(ticket.user_id != res.locals.user.userData.user_id) {
            next()
        } else {
            res.status(403).json({message: `Can't update your own ticket`})
        } 
    } else {
        res.status(400).json({message: `Ticket unfound!`})
    }
}

const validateTicketData = async (req, res, next) => {
    let ticket = req.body
    ticket.user_id = res.locals.user.userData.user_id

    if(!ticketService.validateTicketData(ticket)) {
        res.status(400).json({message: `Invalid ticket details`, ticket: ticket})
    } else {
        next()
    }
    
}

router.post(`/create`, validateUserID, validateTicketData, async (req, res) => {
    //const ticket = req.body
    const data = await ticketService.createTicket(req.body)
    //res.locals.user
    if(data){
        res.status(201).json({message: `Created Ticket ${JSON.stringify(req.body)}`})
    }else{
        res.status(400).json({message: `Ticket not created`, ticket: req.body})
    }
})

router.get(`/history`, validateUserID, async (req, res) => {
    const currentUser_id = res.locals.user.userData.user_id
    const data = await ticketService.getTicketsByUserID(currentUser_id)
    if(data.length > 0) {
        res.status(200).json({message: `Tickets available here!`, ticket: data})
    } else {
        res.status(200).json({message: `No tickets found`})
    }
})

router.get(`/history/pending`, validateUserID, validateIfManager, async (req, res) => {
    const data = await ticketService.getTicketsByStatus()
    if(data.length > 0) {
        res.status(200).json({message: `Tickets available here!`, ticket: data})
    } else {
        res.status(200).json({message: `No tickets found`})
    }
})

router.put(`/history/pending/change-status`, validateUserID, validateIfManager, validateTicket, async (req, res) => {
    const ticket = req.body

    const data = await ticketService.updateTicketStatusByTicketID(ticket.ticket_id, ticket.ticket_status)
    if(data) {
        res.status(200).json({message: `Ticket updated!`, ticket: data})
    } else {
        res.status(400).json({message: `Ticket not updated`, ticket: req.body})
    }
    
})

module.exports = router
