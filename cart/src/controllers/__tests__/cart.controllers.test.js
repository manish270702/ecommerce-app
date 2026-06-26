jest.mock("../../model/cart.model");

const cartModel = require("../../model/cart.model");
const { getCartItems, createCart } = require("../cart.controllers");

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

  describe("getCartItems", () => {
    test("returns 401 when user missing", async () => {
      const req = {};
      const res = createMockRes();

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });

    test("returns cart items", async () => {
      const items = [{ _id: "1", items: [] }];

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

    test("handles errors", async () => {
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

    test("creates new cart when user has no cart", async () => {
      cartModel.findOne.mockResolvedValue(null);

      const createdCart = {
        _id: "c1",
        user: "u1",
        items: [
          {
            productid: "p1",
            quantity: 2,
          },
        ],
      };

      cartModel.create.mockResolvedValue(createdCart);

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 2,
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
          },
        ],
      });

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart created successfully",
        item: createdCart,
      });
    });

    test("updates quantity if product already exists", async () => {
      const save = jest.fn();

      const cart = {
        user: "u1",
        items: [
          {
            productid: {
              toString: () => "p1",
            },
            quantity: 1,
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
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(cart.items[0].quantity).toBe(5);

      expect(save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart updated successfully",
        item: cart,
      });
    });

    test("adds new product if not already in cart", async () => {
      const save = jest.fn();

      const cart = {
        user: "u1",
        items: [
          {
            productid: {
              toString: () => "p1",
            },
            quantity: 1,
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
        },
      };

      const res = createMockRes();

      await createCart(req, res);

      expect(cart.items).toContainEqual({
        productid: "p2",
        quantity: 3,
      });

      expect(save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart updated successfully",
        item: cart,
      });
    });

    test("handles database errors", async () => {
      cartModel.findOne.mockRejectedValue(new Error("DB Error"));

      const req = {
        user: {
          id: "u1",
        },
        body: {
          productid: "p1",
          quantity: 2,
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
});