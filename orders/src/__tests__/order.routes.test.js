jest.mock("../model/order.model");

jest.mock("axios");

const axios = require("axios");
const orderModel = require("../model/order.model");

const {
  getorders,
  createOrder,
  getOrderById,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/order.controllers");

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Order Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // getorders
  // =========================

  describe("getorders", () => {
    test("returns 401 when user is missing", async () => {
      const req = {};

      const res = makeRes();

      await getorders(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "unAuthorised",
      });
    });

    test("returns all orders", async () => {
      const orders = [
        {
          _id: "o1",
          user: "u1",
        },
      ];

      orderModel.find.mockResolvedValue(orders);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = makeRes();

      await getorders(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        order: orders,
        message: "worked",
      });
    });

    test("returns 404 when no orders exist", async () => {
      orderModel.find.mockResolvedValue([]);

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = makeRes();

      await getorders(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "no orders",
      });
    });

    test("returns 500 when database throws error", async () => {
      orderModel.find.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "u1",
        },
      };

      const res = makeRes();

      await getorders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  // =========================
  // createOrder
  // =========================

  describe("createOrder", () => {
    test("returns 401 when user missing", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });

    test("creates order successfully", async () => {
      axios.get.mockResolvedValue({
        data: {
          items: [
            {
              user: "u1",
              items: [
                {
                  price: 100,
                  quantity: 2,
                },
                {
                  price: 50,
                  quantity: 1,
                },
              ],
            },
          ],
        },
      });

      orderModel.create.mockResolvedValue({
        _id: "o1",
      });

      axios.delete.mockResolvedValue({});

      const req = {
        user: {
          id: "u1",
        },
        headers: {
          authorization: "Bearer token123",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/cart",
        {
          headers: {
            Authorization: "Bearer token123",
          },
        }
      );

      expect(orderModel.create).toHaveBeenCalledWith({
        user: "u1",
        items: [
          {
            price: 100,
            quantity: 2,
          },
          {
            price: 50,
            quantity: 1,
          },
        ],
        totalAmount: 250,
      });

      expect(axios.delete).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Order created successfully",
      });
    });


        test("returns 500 when axios.get fails", async () => {
      axios.get.mockRejectedValue(
        new Error("Cart Service Down")
      );

      const req = {
        user: {
          id: "u1",
        },
        headers: {
          authorization: "Bearer token123",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Cart Service Down",
      });
    });

    test("returns 500 when order creation fails", async () => {
      axios.get.mockResolvedValue({
        data: {
          items: [
            {
              user: "u1",
              items: [
                {
                  price: 100,
                  quantity: 2,
                },
              ],
            },
          ],
        },
      });

      orderModel.create.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "u1",
        },
        headers: {
          authorization: "Bearer token123",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Database Error",
      });
    });

    test("returns 500 when cart delete fails", async () => {
      axios.get.mockResolvedValue({
        data: {
          items: [
            {
              user: "u1",
              items: [
                {
                  price: 100,
                  quantity: 2,
                },
              ],
            },
          ],
        },
      });

      orderModel.create.mockResolvedValue({
        _id: "o1",
      });

      axios.delete.mockRejectedValue(
        new Error("Delete Error")
      );

      const req = {
        user: {
          id: "u1",
        },
        headers: {
          authorization: "Bearer token123",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Delete Error",
      });
    });

    test("returns 500 when cart response is empty", async () => {
      axios.get.mockResolvedValue({
        data: {
          items: [],
        },
      });

      const req = {
        user: {
          id: "u1",
        },
        headers: {
          authorization: "Bearer token123",
        },
      };

      const res = makeRes();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================
  // getOrderById
  // =========================

  describe("getOrderById", () => {
    test("returns 401 when user missing", async () => {
      const req = {
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });

    test("returns order successfully", async () => {
      const order = {
        _id: "o1",
      };

      orderModel.findOne.mockResolvedValue(order);

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await getOrderById(req, res);

      expect(orderModel.findOne).toHaveBeenCalledWith({
        _id: "o1",
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(order);
    });

    test("returns 404 when order not found", async () => {
      orderModel.findOne.mockResolvedValue(null);

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Order not found",
      });
    });

    test("returns 500 on database error", async () => {
      orderModel.findOne.mockRejectedValue(
        new Error("DB Error")
      );

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });  // =========================
  // deleteOrder
  // =========================

  describe("deleteOrder", () => {
    test("returns 401 when user missing", async () => {
      const req = {
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });

    test("deletes order successfully", async () => {
      orderModel.findOneAndDelete = jest.fn().mockResolvedValue({
        _id: "o1",
      });

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await deleteOrder(req, res);

      expect(orderModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: "o1",
        user: "u1",
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Order deleted",
      });
    });

    test("returns 404 when order not found", async () => {
      orderModel.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Order not found",
      });
    });

    test("returns 500 when delete throws", async () => {
      orderModel.findOneAndDelete = jest
        .fn()
        .mockRejectedValue(new Error("DB Error"));

      const req = {
        user: {
          id: "u1",
        },
        params: {
          id: "o1",
        },
      };

      const res = makeRes();

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  // =========================
  // getAllOrders
  // =========================

  describe("getAllOrders", () => {
    test("returns 401 when user missing", async () => {
      const req = {};

      const res = makeRes();

      await getAllOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorize",
      });
    });

    test("returns all orders", async () => {
      const orders = [{ _id: "o1" }];

      const sort = jest.fn().mockResolvedValue(orders);

      const populate = jest.fn().mockReturnValue({
        sort,
      });

      orderModel.find = jest.fn().mockReturnValue({
        populate,
      });

      const req = {
        user: {
          id: "admin",
        },
      };

      const res = makeRes();

      await getAllOrders(req, res);

      expect(populate).toHaveBeenCalledWith("user");

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(orders);
    });

    test("returns 500 on database error", async () => {
      const populate = jest.fn(() => ({
        sort: jest.fn().mockRejectedValue(new Error("DB")),
      }));

      orderModel.find = jest.fn().mockReturnValue({
        populate,
      });

      const req = {
        user: {
          id: "admin",
        },
      };

      const res = makeRes();

      await getAllOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });

  // =========================
  // updateOrderStatus
  // =========================

  describe("updateOrderStatus", () => {
    test("returns 401 when user missing", async () => {
      const req = {
        params: {
          id: "o1",
        },
        body: {
          status: "Delivered",
        },
      };

      const res = makeRes();

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });

    test("updates status successfully", async () => {
      orderModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: "o1",
        status: "Delivered",
      });

      const req = {
        user: {
          id: "admin",
        },
        params: {
          id: "o1",
        },
        body: {
          status: "Delivered",
        },
      };

      const res = makeRes();

      await updateOrderStatus(req, res);

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "o1",
        {
          status: "Delivered",
        },
        {
          new: true,
        }
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Status updated",
        order: {
          _id: "o1",
          status: "Delivered",
        },
      });
    });

    test("returns 404 when order not found", async () => {
      orderModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const req = {
        user: {
          id: "admin",
        },
        params: {
          id: "o1",
        },
        body: {
          status: "Delivered",
        },
      };

      const res = makeRes();

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "Order not found",
      });
    });

    test("returns 500 when update fails", async () => {
      orderModel.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("DB Error"));

      const req = {
        user: {
          id: "admin",
        },
        params: {
          id: "o1",
        },
        body: {
          status: "Delivered",
        },
      };

      const res = makeRes();

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});