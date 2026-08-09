const categorymodel = require("../models/category.model")
const imagekit = require("../services/ImageKit")

// create category



const category = async (req, res) => {
    try {
    const { name, slug, description } = req.body;
    // console.log(req.body)
    const file = req.file;
    // console.log(file)

    const alreadyexists = await categorymodel.findOne({ name })

    if (alreadyexists) {
        return res.status(409).json({ message: "Category already exists" })
    }

    const result = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/products/categories"
    });

    console.log(result)

    const categoryData = await categorymodel.create({
        name,
        slug,
        description,
        createdby: req.user.id,
        image: result.url
    });

    res.status(201).json({
        success: true,
        category: categoryData
    });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
        console.log("Error:", err);
    console.log("Message:", err.message);
    console.log("Code:", err.code);
    console.log("Response:", err.response?.data);
    console.log("Cause:", err.cause);
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
        const unique_category = await categorymodel.find({}, "_id name");

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

module.exports = { category, delete_category, get_categories }
