const jwt = require('jsonwebtoken')

// Creates JSON Web Tokens (jwt) for authenticating users
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { // id = payload {OBJECT}, jwt secret key (reference), jwt expiration
        expiresIn: '1d'
    })
}

module.exports = generateToken