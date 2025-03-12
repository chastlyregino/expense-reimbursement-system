const express = require(`express`)
const { logger } = require(`../util/logger.js`)
const userService = require(`../service/userService.js`)
const uuid = require(`uuid`)

const router = express.Router()

//POST registration
router.post(`/`, (req, res) => {
    const { username, password } = req.body

    if(!username || !password) {
        logger.info(`POST method failed! Missing info`)
        res.status(400).json({error: `Please provide a username and password`})
    } else {
        userService.getUserByUsername(username)
        .then(data => {
            if(data.user[0]) {
                logger.info(`Username exists! ${data.user[0].username}`)
                res.status(400).json({error: `Please provide a unique username`})
            } else {
                userService.createUser(uuid.v4(), username, password)
                .then(data => {
                    res.status(200).json({
                                            message: `User Added!`,
                                            data
                                        })
                    logger.info(`User Added! ${data.user.username}`)
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err))
    }
})

module.exports = router
