const orderModel = require("../model/order.model")

const getorders = async (req, res) => {
    try {
        const user = req.user

        if (!user) return res.status(400).json({ message: "unAuthorised" })

        const order = await orderModel.findOne({ user: user.id })

        if (order) {
            return res.status(200).json({
                order,
                message: "worked"
            })
        }

        return res.status(401).json({ message: "no orders" })
    } catch (err) {
        console.log(err, "something went wrong")
        return res.status(500).json({ message: "something went wrong" })
    }
}

const createOrder = async (req, res) => {
    try {
        const order = await orderModel.create(req.body);

        return res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

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
        return res.status(500).json({ message: "Something went wrong" });
    }
}


const updateOrder = async (req, res) => {
    try {

        const user = req.user;

        if (!user)
            return res.status(401).json({ message: "Unauthorized" });

        const order = await orderModel.findOneAndUpdate(
            {
                _id: req.params.id,
                user: user.id
            },
            {
                $set: req.body
            },
            {
                new: true
            }
        );

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({
            message: "Order updated",
            order
        });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}


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
            message: "Something went wrong"
        });
    }
}




const getAllOrders = async (req, res) => {
    try {

        const orders = await orderModel.find()
            .populate("user")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}



const updateOrderStatus = async (req, res) => {
    try {

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
            message: "Something went wrong"
        });
    }
}

module.exports = { getorders, createOrder }