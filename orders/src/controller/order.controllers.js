const orderModel = require("../model/order.model")
const axios = require("axios")
const getorders = async (req, res) => {
    try {
        const user = req.user

        if (!user) return res.status(401).json({ message: "unAuthorised" })

        const order = await orderModel.find({ user: user.id })

        if (order.length > 0) {
            return res.status(200).json({
                order,
                message: "worked"
            })
        }

        return res.status(404).json({ message: "no orders" })
    } catch (err) {
        console.log(err, "Internal Server Error")
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// const createOrder = async (req, res) => {
//     try {
//         const user = req.user
//         const order = await orderModel.create({
//             user: req.user.id,
//             items: req.body.items,
//             totalAmount: req.body.totalAmount
//         });

//         return res.status(201).json({
//             message: "Order created successfully",
//             order
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: err.message
//         });
//     }
// }


const createOrder = async (req, res) => {
    const token = req.headers.authorizaton.split(" ")[1]
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const data = await axios.get("http://localhost:3001/cart", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const x = data.data.items[0]

        console.log(x)

        // const { items, totalAmount } = req.body;

        const amt = x.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        console.log(amt)

        const order = await orderModel.create({
            user: x.user,
            items: x.items,
            totalAmount: amt
        });

        await axios.delete(
            "http://localhost:3001/cart",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.status(201).json({
            message: "Order created successfully",
            // order
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


const getOrderById = async (req, res) => {
    try {
        const user = req.user;

        if (!user)
            return res.status(401).json({ message: "Unauthorized" });

        const order = await orderModel.findOne({
            _id: req.params.id,
            user: user.id
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        return res.status(200).json(order);

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// const updateOrder = async (req, res) => {
//     try {

//         const user = req.user;

//         if (!user)
//             return res.status(401).json({ message: "Unauthorized" });

//         const order = await orderModel.findOneAndUpdate(
//             {
//                 _id: req.params.id,
//                 user: user.id
//             },
//             {
//                 $set: req.body
//             },
//             {
//                 new: true
//             }
//         );

//         if (!order)
//             return res.status(404).json({ message: "Order not found" });

//         return res.status(200).json({
//             message: "Order updated",
//             order
//         });

//     } catch (err) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }


const deleteOrder = async (req, res) => {
    try {

        const user = req.user;

        if (!user)
            return res.status(401).json({ message: "Unauthorized" });

        const order = await orderModel.findOneAndDelete({
            _id: req.params.id,
            user: user.id
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({
            message: "Order deleted"
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


const getAllOrders = async (req, res) => {
    try {

        const user = req.user

        if (!user) {
            return res.status(401).json({ message: "Unauthorize" })
        }

        const orders = await orderModel.find()
            .populate("user")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


const updateOrderStatus = async (req, res) => {
    try {
        const user = req.user

        if (!user) return res.status(401).json({ message: "Unauthorized access" })
        const order = await orderModel.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true
            }
        );

        if (!order)
            return res.status(404).json({
                message: "Order not found"
            });

        return res.status(200).json({
            message: "Status updated",
            order
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports = { getorders, createOrder, updateOrderStatus, getAllOrders, deleteOrder, getOrderById }