const jwt = require("jsonwebtoken");


const authCheck = (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization
        const token = authHeaders.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: 'plese provided token'
            })
        }
        const verify = jwt.verify(token, "passcode");
        req.userId = verify.id
        console.log(verify)
        if (!verify) {
            res.status(401).json({
                message: "not verify token"
            })
        }
        next()
    } catch (error) {
        res.status(201).json({
            message: error.message
        })

    }

}
module.exports = authCheck;