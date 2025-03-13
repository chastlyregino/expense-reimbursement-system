const jwt = require(`jsonwebtoken`)
const { logger } = require(`../util/logger.js`)

const secretKey = `your-secret-key`

const authenticateToken = async (req, res, next) => {

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers[`authorization`];
    const token = authHeader && authHeader.split(` `)[1]

    if(!token) {
        res.status(403).json({message: `Forbidden Access`})
    } else {
        const user = await decodeJWT(token)
        req.user = user // how to pass data
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

module.exports = {
    authenticateToken
}