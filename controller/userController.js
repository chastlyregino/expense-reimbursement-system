const express = require(`express`)
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
//const { logger } = require(`../util/logger.js`)
const { authenticateToken } = require('../util/jwt')
const userService = require(`../service/userService.js`)

const router = express.Router()

const secretKey = "my-secret-key"


const validateUserRegistration = async (req, res, next) => {
    const user = req.body

    if(!userService.validateUserData(user)) {
        res.status(400).json({message: "Invalid username or password", data: user})
    } else {
        const data = await userService.getUserByUsername(user.username)

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
    const user = req.body
    if(user){
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username
            },
                secretKey,
            {
                expiresIn: "15m"
        })
        res.status(200).json({message: `Login Successful!`, token})
    }else{
        res.status(400).json({message: "Invalid Login!", data: req.body})
    }
})

module.exports = router