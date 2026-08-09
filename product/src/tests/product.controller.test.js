jest.mock("../models/product.model", () => ({
  create: jest.fn(),
  findOneAndDelete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../services/ImageKit", () => ({
  upload: jest.fn(),
}));

const productModel = require("../models/product.model");
const imagekit = require("../services/ImageKit");

const {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  search,
} = require("../controllers/Product.controller");

describe("Product.controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ---------------- CREATE PRODUCT ----------------

  test("createProduct returns 400 when no images provided", async () => {
    req = {
      body: { title: "Product" },
      files: [],
      user: { id: "u1" },
    };

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "At least one image is required",
    });
  });

  test("createProduct creates product successfully", async () => {
    imagekit.upload.mockResolvedValue({
      url: "http://image.com/test.jpg",
    });

    productModel.create.mockResolvedValue({
      _id: "p1",
      title: "Product",
    });

    req = {
      body: {
        title: "Product",
        description: "desc",
        brand: "Nike",
        category: "Shoes",
        price: 100,
        stock: 10,
        discountPercentage: 5,
      },
      files: [{ buffer: Buffer.from("img") }],
      user: { id: "user1" },
    };

    await createProduct(req, res);

    expect(imagekit.upload).toHaveBeenCalledTimes(1);

    expect(productModel.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  test("createProduct returns 500 if ImageKit upload fails", async () => {
    imagekit.upload.mockRejectedValue(new Error("Upload failed"));

    req = {
      body: {},
      files: [{ buffer: Buffer.from("img") }],
      user: { id: "u1" },
    };

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Upload failed",
    });
  });

  test("createProduct returns 500 if database create fails", async () => {
    imagekit.upload.mockResolvedValue({
      url: "http://image.com/test.jpg",
    });

    productModel.create.mockRejectedValue(new Error("Database Error"));

    req = {
      body: {},
      files: [{ buffer: Buffer.from("img") }],
      user: { id: "u1" },
    };

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database Error",
    });
  });

  // ---------------- DELETE PRODUCT ----------------

  test("deleteProduct returns 404 when product not found", async () => {
    productModel.findOneAndDelete.mockResolvedValue(null);

    req = {
      params: {
        id: "1",
      },
    };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deleteProduct deletes successfully", async () => {
    productModel.findOneAndDelete.mockResolvedValue({
      _id: "1",
    });

    req = {
      params: {
        id: "1",
      },
    };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  test("deleteProduct returns 500 on database error", async () => {
    productModel.findOneAndDelete.mockRejectedValue(
      new Error("Database Error")
    );

    req = {
      params: {
        id: "1",
      },
    };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failed to delete product",
    });
  });

  // ---------------- GET PRODUCTS ----------------

  test("getProducts returns products", async () => {
    const limitMock = jest.fn().mockResolvedValue([{ _id: "1" }]);

    const skipMock = jest.fn().mockReturnValue({
      limit: limitMock,
    });

    productModel.find.mockReturnValue({
      skip: skipMock,
    });

    req = {
      query: {
        page: 1,
        limit: 10,
      },
    };

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
  });

  test("getProducts returns 500 on error", async () => {
    productModel.find.mockImplementation(() => {
      throw new Error("DB Error");
    });

    req = {
      query: {},
    };

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ---------------- GET SINGLE PRODUCT ----------------

  test("getSingleProduct returns product", async () => {
    productModel.findOne.mockResolvedValue({
      _id: "1",
    });

    req = {
      params: {
        id: "1",
      },
    };

    await getSingleProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
  });

  test("getSingleProduct returns 204 if not found", async () => {
    productModel.findOne.mockResolvedValue(null);

    req = {
      params: {
        id: "1",
      },
    };

    await getSingleProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("getSingleProduct returns 500 on error", async () => {
    productModel.findOne.mockRejectedValue(new Error("DB Error"));

    req = {
      params: {
        id: "1",
      },
    };

    await getSingleProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ---------------- SEARCH ----------------

  test("search returns matching products", async () => {
    productModel.find.mockResolvedValue([{ _id: "1" }]);

    req = {
      params: {
        keyword: "shoe",
      },
    };

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ _id: "1" }],
    });
  });

  test("search returns 500 on error", async () => {
    productModel.find.mockRejectedValue(new Error("DB Error"));

    req = {
      params: {
        keyword: "shoe",
      },
    };

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "DB Error",
    });
  });
});