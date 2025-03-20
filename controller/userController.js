require('dotenv').config()
const express = require(`express`)
const { authenticateToken } = require('../util/jwt')
const jwt = require('jsonwebtoken')
const userService = require(`../service/userService.js`)

const router = express.Router()

const secretKey = process.env.secret_key

const validateUserRegistration = async (req, res, next) => {
    const user = req.body
    const data = await userService.getUserByUsername(user.username)

    if(!data) {
        next()
    } else {
        res.status(400).json({message: `Invalid username`, data: user})
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

const validateUserInfo = async (req, res, next) => {
    const user = res.locals.user.username
    const data = await userService.getUserByUsername(user)

    if(!data) {
        res.status(400).json({message: `User not Found`, data: user})
    } else {
        res.locals.user.userData = data
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

    if(data) {
        res.status(201).json({message: `Created User ${JSON.stringify(req.body)}`})
    } else {
        res.status(400).json({message: `User not created`, data: req.body})
    }
})

router.post(`/login`, validateUserData, validateUserLogin, async (req, res) => {
    const user = req.body
    
    if(user) {
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
    } else {
        res.status(400).json({message: `Invalid Login!`, data: req.body})
    }
})

router.put(`/change-role`, authenticateToken, validateUserInfo, async (req, res) => {
    const user = req.body

    if(user && user.user_id != res.locals.user.userData.user_id){
        const data = await userService.updateUser(user.user_id)
        
        if(data) {
            res.status(200).json({message: `User updated!`, data})
        } else {
            res.status(400).json({message: `User role not changed`, data: req.body})
        }
    } else {
        res.status(403).json({message: `Can't change own role`, data: req.body})
    }
})

router.all(/(.*)/, (req, res) => {
    res.status(404).json({message: `Invalid Page!`})
})

module.exports = router
