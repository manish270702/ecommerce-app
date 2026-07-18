const ratelimit = require("express-rate-limit")

const limiter = ratelimit({
    windowMs : 1*60*1000,
    max:20,
    message:"you have reached your limit . Try again after 1 minute"
})

module.exports = limiter