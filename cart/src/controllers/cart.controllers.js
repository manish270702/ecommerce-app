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

const createCart = async (req, res) => {
    try {
        const user = req.user;
        console.log(user.id)
        const { productid, quantity, price } = req.body;

        if (!user) {
            return res.status(401).json({ message: 'unauthorized' });
        }

        let cart = await cartModel.findOne({ user: user.id });
        console.log(cart)

        if (cart && cart.items.length>0) {
            // 2. Check if the product already exists inside the user's cart array
            const itemIndex = cart.items.findIndex(item => item.productid == productid);

            if (itemIndex > -1) {
                // Product exists: increment the quantity
                cart.items[itemIndex].quantity = Number(quantity);
            } else {
                // Product doesn't exist: push the new item into the array
                cart.items.push({ productid, quantity, price });
            }

            await cart.save();
            return res.status(200).json({ message: "Cart updated successfully", item: cart });

        } else {
            const newCart = await cartModel.create({
                user: user.id,
                items: [{ productid, quantity, price }]
            });

            return res.status(201).json({ message: "Cart created successfully", item: newCart });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'something went wrong' });
    }
};


// delete product from cart

const removeproduct = async (req, res) => {
    const { id } = req.params
    const user = req.user

    if (!id) return res.status(403).json({ message: "Invalid id" })

    if (!user) return res.status(401).json({ message: "Unauthorize access" })

    const cart =await cartModel.findOne({ user: user.id })
    const itemindex = cart.items.findIndex(item => item.productid == id)
    console.log(itemindex)
    cart.items.splice(itemindex, 1)

    await cart.save();



    return res.status(200).json({ message: "item deleted successsfully" })

}


// delete whole cart

const deleteCart = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'unauthorized' });
        }

        let cart = await cartModel.findOneAndDelete({ user: user.id });

        return res.status(200).json({ message: "Cart deleted successfully" })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'something went wrong' });
    }
};

module.exports = { getCartItems, createCart, deleteCart, removeproduct }