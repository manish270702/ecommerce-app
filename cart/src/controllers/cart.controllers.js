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
        const { productid, quantity, price, stock } = req.body;

        if (!user) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        console.log("User ID:", user.id);

        const cart = await cartModel.findOne({ user: user.id });

        console.log("Existing Cart:", cart);

        if (cart) {
            const itemIndex = cart.items.findIndex(
                item => item.productid.toString() === productid.toString()
            );

            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity = Number(quantity);
            } else {
                cart.items.push({
                    productid,
                    quantity,
                    price,
                    stock,
                });
            }

            await cart.save();

            return res.json({
                message: "Cart updated successfully",
                item: cart,
            });
        }

        const newCart = await cartModel.create({
            user: user.id,
            items: [{
                productid,
                quantity,
                price,
                stock,
            }],
        });

        return res.status(201).json({
            message: "Cart created successfully",
            item: newCart,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'something went wrong' });
    }
};


// delete product from cart

const removeproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const cart = await cartModel.findOne({ user: user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productid.toString() === id
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        return res.status(200).json({
            message: "Item deleted successfully",
            items: cart.items
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// delete whole cart

const deleteCart = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'unauthorized' });
        }

        let cart = await cartModel.findOneAndDelete({ user: user.id });

        return res.status(200).json({
            message: "Cart deleted successfully",
            items: cart.items,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'something went wrong' });
    }
};

module.exports = { getCartItems, createCart, deleteCart, removeproduct }