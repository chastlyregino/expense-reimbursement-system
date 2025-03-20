const express = require(`express`)
const { logger } = require(`./util/logger.js`)
const userController = require(`./controller/userController.js`)
const ticketController = require(`./controller/ticketController.js`)
const { authenticateToken } = require('./util/jwt')


const app = express()
const PORT = 3000

const loggerMiddleware = (req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`)
    next()
}

app.use(loggerMiddleware)
app.use(express.json())

app.use(`/users`, userController)
app.use(`/tickets`, authenticateToken, ticketController)

app.all(/(.*)/, (req, res) => {
    res.status(404).json({message: `Invalid Page!`})
})

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`)
})
