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


module.exports = { createProduct, deleteProduct };