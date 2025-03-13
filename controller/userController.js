const express = require(`express`)
//const { logger } = require(`../util/logger.js`)
const userService = require(`../service/userService.js`)

const router = express.Router()

const secretKey = "my-secret-key"

const validateUserRegistration = async (req, res, next) => {
    const user = req.body

    if(!userService.validateUserData(user)) {
        res.status(400).json({message: "Invalid username or password", data: user})
    } else {
        const data = await userService.validateUserCredentials(user)

        if(!data) {
            next()
        } else {
            res.status(400).json({message: "Invalid username", data: user})
        }
    }
    
}

const validateUserLogin = async (req, res, next) => {
    const user = req.body

    if(!userService.validateUserData(user)) {
        res.status(400).json({message: "Invalid username or password", data: user})
    } else {
        const data = await userService.validateUserCredentials(user)

        if(data) {
            next()
        } else {
            res.status(400).json({message: "Invalid Login!", data: user})
        }
    }
    
}

router.post(`/register`, validateUserRegistration, async (req, res) => {
    const data = await userService.createUser(req.body)

    if(data){
        res.status(201).json({message: `Created User ${JSON.stringify(req.body)}`})
    }else{
        res.status(400).json({message: "User not created", data: req.body})
    }
})

router.post(`/login`, validateUserLogin, async (req, res) => {
    // const data = await userService.createUser(req.body)
    const data = req.body
    if(data){
        res.status(201).json({message: `Login Successful ${JSON.stringify(req.body)}`})
    }else{
        res.status(400).json({message: "Invalid Login!", data: req.body})
    }
})

module.exports = router