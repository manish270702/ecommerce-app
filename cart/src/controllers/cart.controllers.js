const cartModel = require("../model/cart.model")

const getCartItems = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ message: 'unauthorized' })

        const items = await cartModel.find({ user: user.id })
        return res.status(200).json({ items })
    } catch (err) {
        return res.status(500).json({ message: 'something went wrong' })
    }
}

module.exports = { getCartItems }