const express = require('express')
const { logger } = require('./util/logger.js')
const userService = require('./service/userService.js')


const app = express()
const PORT = 3000

//let user = userService.getUsers()
//logger.info(`this is how to use logger`)

app.use(express.json())

//POST registration

//POST login

//POST ticket submission

//GET previous tickets (employee)

//GET pending tickets (manager)

//PUT approve/deny ticket
