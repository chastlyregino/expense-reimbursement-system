const express = require('express')
const { logger } = require('./util/logger.js')
const userService = require('./service/userService.js')
const userDAO = require('./repository/userDAO.js')
const uuid = require('uuid')


const app = express()
const PORT = 3000

//let user = userService.getUsers()
//logger.info(`this is how to use logger`)

app.use(express.json())

//POST registration
app.post('/register', (req, res) => {
    const { username, password } = req.body

    if(!username || !password) {
        logger.info(`POST method failed! Missing info`)
        res.status(400).send(JSON.stringify({error: 'Please provide a username and password'}))
    } else {
        userService.getUserByUsername(username)
        .then(data => {
            if(data.user) {
                logger.info(`Username exists!`)
                res.status(400).send(JSON.stringify({error: 'Please provide a unique username'}))
            } else {
                userService.createUser(uuid.v4(), username, password)
                .then(data => {
                    res.statusCode = 200
                    res.send(JSON.stringify({
                                message: 'User Added!',
                                data
                                })
                    )
                    logger.info(`User Added! ${username}`)
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err))
    }
})

//POST login

//POST ticket submission

//GET previous tickets (employee)

//GET pending tickets (manager)

//PUT approve/deny ticket

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`)
})
