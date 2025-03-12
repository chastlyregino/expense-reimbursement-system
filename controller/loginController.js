const express = require("express")
const { logger } = require('../util/logger.js')
const userService = require('../service/userService.js')

const router = express.Router()

//POST login

router.post("/", (req, res) => {

    const { username, password } = req.body

    if(!username || !password) {
        logger.info(`POST method failed! Missing info`)
        res.status(400).json({error: `Please provide a username and password`})
    } else {
        userService.getUserByUsername(username)
        .then(data => {
            if(data.user[0]) {
                if(data.user[0].password === password) {
                    res.status(200).json({
                        message: `Login Successful!`,
                        data
                    })
                    logger.info(`Login Successful! ${data.user.username}`)
                } else {
                    logger.info(`Mismatch password ${username}`)
                    res.status(400).json({error: `Login failed!`})
                }
            } else {
                logger.info(`User does not exist ${username}`)
                res.status(400).json({error: `Login failed!`})
            }
        })
        .catch(err => console.error(err))
    }
})

module.exports = router