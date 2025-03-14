require('dotenv').config()
const express = require(`express`)
const jwt = require('jsonwebtoken')
const userService = require(`../service/userService.js`)
const { destroyToken } = require("../util/jwt")

const router = express.Router()

const secretKey = process.env.secret_key

const validateUserRegistration = async (req, res, next) => {
    const user = req.body

    if(!userService.validateUserData(user)) {
        res.status(400).json({message: `Invalid username or password`, data: user})
    } else {
        const data = await userService.getUserByUsername(user.username)

        if(!data) {
            next()
        } else {
            res.status(400).json({message: `Invalid username`, data: user})
        }
    }
    
}

const validateUserData = async (req, res, next) => {
    const user = req.body

    if(!userService.validateUserData(user)) {
        res.status(400).json({message: `Invalid username or password`, data: user})
    } else {
        next()
    }
    
}

const validateUserLogin = async (req, res, next) => {
    const user = await userService.validateUserCredentials(req.body)
    if(user) {
        next()
    } else {
            res.status(400).json({message: `Invalid Login!`, data: user})
    }
    
}

router.post(`/register`, validateUserData, validateUserRegistration, async (req, res) => {
    const data = await userService.createUser(req.body)

    if(data){
        res.status(201).json({message: `Created User ${JSON.stringify(req.body)}`})
    }else{
        res.status(400).json({message: `User not created`, data: req.body})
    }
})

router.post(`/login`, validateUserData, validateUserLogin, async (req, res) => {
    const user = req.body
    
    if(user){
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username
            },
                secretKey,
            {
                expiresIn: `15m`
        })
        res.status(200).json({message: `Login Successful!`, token})
    }else{
        res.status(400).json({message: `Invalid Login!`, data: req.body})
    }
})

router.get("/logout", destroyToken, (req, res) => {
    if(!res.locals.user){
        res.status(200).json({message: `Logout Successful!`})
    }else{
        res.status(400).json({message: `Invalid Logout!`, data: res.locals.user})
    }
})

module.exports = router