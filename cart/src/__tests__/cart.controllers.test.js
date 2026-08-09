jest.mock("../model/cart.model");

const cartModel = require("../model/cart.model");

const {
  getCartItems,
  createCart,
  removeproduct,
  deleteCart,
} = require("../controllers/cart.controllers");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Cart Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =======================
  // getCartItems
  // =======================

  describe("getCartItems", () => {
    test("returns 401 when user is missing", async () => {
      const req = {};
      const res = createMockRes();

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });

    test("returns all cart items", async () => {
      const items = [
        {
          _id: "1",
          user: "u1",
          items: [],
        },
      ];

      cartModel.find.mockResolvedValue(items);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await getCartItems(req, res);

      expect(cartModel.find).toHaveBeenCalledWith({
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        items,
      });
    });

    test("returns empty array when cart is empty", async () => {
      cartModel.find.mockResolvedValue([]);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        items: [],
      });
    });

    test("handles database error", async () => {
      cartModel.find.mockRejectedValue(new Error("DB Error"));

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "something went wrong",
      });
    });
  });

  // =======================
  // createCart
  // =======================

  describe("createCart", () => {
    test("returns 401 when user missing", async () => {
      const req = {
        body: {},
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });

    test("creates new cart successfully", async () => {
      cartModel.findOne.mockResolvedValue(null);

      const newCart = {
        _id: "1",
        user: "u1",
        items: [
          {
            productid: "p1",
            quantity: 2,
            price: 100,
            stock: 5,
          },
        ],
      };

      cartModel.create.mockResolvedValue(newCart);

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 2,
          price: 100,
          stock: 5,
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(cartModel.findOne).toHaveBeenCalledWith({
        user: "u1",
      });

      expect(cartModel.create).toHaveBeenCalledWith({
        user: "u1",
        items: [
          {
            productid: "p1",
            quantity: 2,
            price: 100,
            stock: 5,
          },
        ],
      });

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart created successfully",
        item: newCart,
      });
    });


        test("updates quantity when product already exists", async () => {
      const save = jest.fn();

      const cart = {
        user: "u1",
        items: [
          {
            productid: {
              toString: () => "p1",
            },
            quantity: 1,
            price: 100,
            stock: 5,
          },
        ],
        save,
      };

      cartModel.findOne.mockResolvedValue(cart);

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 5,
          price: 100,
          stock: 5,
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(cart.items[0].quantity).toBe(5);

      expect(save).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart updated successfully",
        item: cart,
      });
    });

    test("adds a new product when it does not exist", async () => {
      const save = jest.fn();

      const cart = {
        user: "u1",
        items: [
          {
            productid: {
              toString: () => "p1",
            },
            quantity: 1,
            price: 100,
            stock: 5,
          },
        ],
        save,
      };

      cartModel.findOne.mockResolvedValue(cart);

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p2",
          quantity: 3,
          price: 250,
          stock: 20,
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(cart.items).toHaveLength(2);

      expect(cart.items[1]).toEqual({
        productid: "p2",
        quantity: 3,
        price: 250,
        stock: 20,
      });

      expect(save).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart updated successfully",
        item: cart,
      });
    });

    test("returns 500 when findOne throws error", async () => {
      cartModel.findOne.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 1,
          price: 100,
          stock: 10,
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "something went wrong",
      });
    });

    test("returns 500 when create fails", async () => {
      cartModel.findOne.mockResolvedValue(null);

      cartModel.create.mockRejectedValue(
        new Error("Create Error")
      );

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 1,
          price: 100,
          stock: 10,
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "something went wrong",
      });
    });
  });

  // =======================
  // removeproduct
  // =======================

  describe("removeproduct", () => {
        test("returns 400 when product id is missing", async () => {
      const req = {
        params: {},
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await removeproduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid product id",
      });
    });

    test("returns 404 when cart is not found", async () => {
      cartModel.findOne.mockResolvedValue(null);

      const req = {
        params: {
          id: "p1",
        },
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await removeproduct(req, res);

      expect(cartModel.findOne).toHaveBeenCalledWith({
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart not found",
      });
    });

    test("returns 404 when product is not in cart", async () => {
      const cart = {
        items: [
          {
            productid: {
              toString: () => "p2",
            },
            quantity: 1,
          },
        ],
        save: jest.fn(),
      };

      cartModel.findOne.mockResolvedValue(cart);

      const req = {
        params: {
          id: "p1",
        },
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await removeproduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Product not found in cart",
      });
    });

    test("removes product successfully", async () => {
      const save = jest.fn();

      const cart = {
        items: [
          {
            productid: {
              toString: () => "p1",
            },
            quantity: 2,
          },
        ],
        save,
      };

      cartModel.findOne.mockResolvedValue(cart);

      const req = {
        params: {
          id: "p1",
        },
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await removeproduct(req, res);

      expect(save).toHaveBeenCalledTimes(1);

      expect(cart.items).toEqual([]);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Item deleted successfully",
        items: [],
      });
    });

    test("returns 500 when removeproduct throws error", async () => {
      cartModel.findOne.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        params: {
          id: "p1",
        },
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await removeproduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Database Error",
      });
    });
  });

  // =======================
  // deleteCart
  // =======================

  describe("deleteCart", () => {    test("returns 401 when user is missing", async () => {
      const req = {};
      const res = createMockRes();

      await deleteCart(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });

    test("deletes cart successfully", async () => {
      const deletedCart = {
        _id: "c1",
        user: "u1",
        items: [
          {
            productid: "p1",
            quantity: 2,
          },
        ],
      };

      cartModel.findOneAndDelete.mockResolvedValue(deletedCart);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await deleteCart(req, res);

      expect(cartModel.findOneAndDelete).toHaveBeenCalledWith({
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart deleted successfully",
        items: deletedCart.items,
      });
    });

    test("returns empty items when deleted cart has no items", async () => {
      const deletedCart = {
        items: [],
      };

      cartModel.findOneAndDelete.mockResolvedValue(deletedCart);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await deleteCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart deleted successfully",
        items: [],
      });
    });

    test("returns 500 when deleteCart throws an error", async () => {
      cartModel.findOneAndDelete.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = createMockRes();

      await deleteCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "something went wrong",
      });
    });
  });
});