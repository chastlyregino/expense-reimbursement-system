require('dotenv').config()
const jwt = require(`jsonwebtoken`)
const { logger } = require(`../util/logger.js`)

const secretKey = process.env.secret_key

const authenticateToken = async (req, res, next) => {

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers[`authorization`];
    const token = authHeader && authHeader.split(` `)[1]

    if(!token) {
        res.status(403).json({message: `Forbidden Access`})
    } else {
        const user = await decodeJWT(token)
        res.locals.user = user // how to pass data
        next()
    }
}

const destroyToken = async (req, res, next) => {

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers[`authorization`];
    const token = authHeader && authHeader.split(` `)[1]

    if(!token) {
        res.status(403).json({message: `Forbidden Access`})
    } else {
        await destroyJWT(token)
        next()
    }
}

const decodeJWT = async (token) => {
    try {
        const user = await jwt.verify(token, secretKey)
        return user
    } catch(err) {
        logger.error(err)
    }
}

const destroyJWT = async (token) => {
    try {
        const user = await jwt.destroy(token, secretKey)
        return user
    } catch(err) {
        logger.error(err)
    }
}

module.exports = {
    authenticateToken,
    destroyToken
}