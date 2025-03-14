const express = require(`express`)
const { authenticateToken } = require('../util/jwt')
const ticketService = require(`../service/ticketService.js`)
const userService = require(`../service/userService.js`)

const router = express.Router()
// validateUserID, validateTicketData

const validateUserID = async (req, res, next) => {
    const user = res.locals.user.username

    const data = await ticketService.validateUserID(user)

    if(data) {
        res.locals.user.userData = data
        next()
    } else {
        res.status(400).json({message: `Invalid username`, data: res.locals.user.username})
    }
}

const validateTicketData = async (req, res, next) => {
    let ticket = req.body
    ticket.user_id = res.locals.user.userData.user_id

    if(!ticketService.validateTicketData(ticket)) {
        res.status(400).json({message: `Invalid ticket details`, data: ticket})
    } else {
        next()
    }
    
}

//POST ticket submission
router.post(`/create`, validateUserID, validateTicketData, async (req, res) => {
    //const ticket = req.body
    const data = await ticketService.createTicket(req.body)
    //res.locals.user
    if(data){
        res.status(201).json({message: `Created Ticket ${JSON.stringify(req.body)}`})
    }else{
        res.status(400).json({message: `Ticket not created`, data: req.body})
    }
})
//GET previous tickets (employee)
router.get(`/history`, validateUserID, async (req, res) => {
    const currentUser_id = res.locals.user.userData.user_id
    const data = await ticketService.getTicketsByUserID(currentUser_id)
    res.json({message: `Tickets available here!`, user: data})
})

//GET pending tickets (manager)

//PUT approve/deny ticket


module.exports = router