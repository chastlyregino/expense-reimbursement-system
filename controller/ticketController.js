const express = require(`express`)
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const { logger } = require(`../util/logger.js`)
const { authenticateToken } = require('../util/jwt')
const app = require('../util/jwt')
const ticketService = require(`../service/ticketService.js`)


const router = express.Router()

const secretKey = `your-secret-key`

//GET previous tickets (employee)
router.post(`/history`, authenticateToken, async (req, res) => {
    res.json({message: `Tickets available here!`, user: req.user})
})

module.exports = router