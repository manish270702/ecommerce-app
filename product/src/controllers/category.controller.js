const categorymodel = require("../models/category.model")
const imagekit = require("../services/ImageKit")

// create category

const category = async (req, res) => {
    try {
        const { name, description } = req.body;
        const file = req.file;

        const result = await imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: `${Date.now()}-${file.originalname}`,
            folder: "/products/categories"
        });

        const categoryData = await categorymodel.create({
            name,
            description,
            createdby:req.user.id,
            image: result.url
        });

        res.status(201).json({
            success: true,
            category: categoryData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// delete category

const delete_category = async (req, res) => {
    try {

        const { id } = req.params
        console.log(id)

        if (!id) {
            return res.status(403).json({
                message: "category not found"
            })
        }

        const del = await categorymodel.findOneAndDelete({ _id: id })

        if (del === null) {
            return res.status(403).json({
                message: "category does not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "category deleted ",
            del
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



// get all categories

const get_categories = async (req, res) => {
    try {
        const unique_category = await categorymodel.distinct("name");

        res.status(200).json({
            success: true,
            message: "categories fetched",
            unique_category
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "no categories found"
        });
    }
}

module.exports = { category, delete_category ,get_categories}
