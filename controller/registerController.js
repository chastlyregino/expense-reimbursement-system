const express = require(`express`)
const { logger } = require(`../util/logger.js`)
const userService = require(`../service/userService.js`)
const uuid = require(`uuid`)

const validateUserMiddleware = (req, res, next) => {
    const { username, password } = req.body

    if(!username || !password) {
        logger.info(`POST method failed! Missing info`)
        res.status(400).json({error: `Please provide a valid username and password`})
    } else {
        userService.getUserByUsername(username)
        .then(data => {
            if(data.user[0]) {
                logger.info(`Username exists! ${data.user[0].username}`)
                res.status(400).json({error: `Username already in use! Choose a different username.`})
            } else {
                userService.createUser(uuid.v4(), username, password)
                .then(data => {
                    logger.info(`User Added! ${data.user.username}`)
                    res.locals.data = { key: data }
                    next()
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err))
    }
}

const router = express.Router()

//POST registration
router.post(`/`, validateUserMiddleware, (req, res) => {
    const data = res.locals.data
    res.status(200).json({
        message: `User Added!`,
        data
    })
})

module.exports = router
