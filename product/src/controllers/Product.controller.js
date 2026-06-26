const productmodel = require("../models/product.model")
const imagekit = require("../services/ImageKit")
const { randomUUID } = require('crypto')

// create product

const createProduct = async (req, res) => {
    try {
        const { title, description, brand, category, price, stock, discountPercentage } = req.body;
        const images = req.files;

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

        const uploadedImages = await Promise.all(
            images.map(file =>
                imagekit.upload({
                    file: file.buffer,
                    fileName: randomUUID(),
                    folder: "/products/product"
                })
            )
        ).then(results => results.map(result => result.url));

        const product = await productmodel.create({
            title,
            description,
            brand,
            category,
            price,
            stock,
            discountPercentage,
            createdBy: req.user.id,
            images: uploadedImages
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create product"
        });
    }
};


// delete product

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await productmodel.findOneAndDelete({ _id: id });

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct
        });

    } catch (err) {
        console.error("Delete product error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};


// get all products
const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const products = await productmodel.find().skip((page - 1) * limit)
            .limit(limit);

        if (!products) return res.status(204).json({ message: "no products found" })

        return res.status(202).json({ products })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// get single product by id

const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await productmodel.findOne({ _id: id })

        if (!product) return res.status(204).json({ message: "no products found" })

        return res.status(202).json({ product })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// filter by search

const search = async (req, res) => {
    try {
        const { keyword } = req.params

        const product = await productmodel.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { brand: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } }
            ]
        });

        return res.status(200).json({ success: true, data: product });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// search by category

module.exports = { createProduct, deleteProduct, getProducts, getSingleProduct, search };