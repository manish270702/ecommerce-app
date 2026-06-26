const orderModel = require('../src/model/order.model');
const { getorders, createOrder } = require('../src/controller/order.controllers');
const { validate } = require('../src/middlewares/checklogin.middleware');
const jwt = require('jsonwebtoken');

jest.mock('../src/model/order.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('Order controller and middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REFRESH_TOKEN_SECRET = 'test-secret';
  });

  it('returns 400 when no user is attached to the request', async () => {
    const req = {};
    const res = makeRes();

    await getorders(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'unAuthorised' });
  });

  it('returns 200 with an order for an authenticated user', async () => {
    const req = { user: { id: 'user-1' } };
    const res = makeRes();
    orderModel.findOne.mockResolvedValue({ _id: 'order-1', user: 'user-1' });

    await getorders(req, res);

    expect(orderModel.findOne).toHaveBeenCalledWith({ user: 'user-1' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'worked' }));
  });

  it('returns 401 when no order exists for the authenticated user', async () => {
    const req = { user: { id: 'user-2' } };
    const res = makeRes();
    orderModel.findOne.mockResolvedValue(null);

    await getorders(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'no orders' });
  });

  it('creates an order successfully', async () => {
    const req = {
      body: {
        user: 'user-3',
        items: [{ product: 'product-1', quantity: 2, price: 25 }],
        totalAmount: 50,
        paymentMethod: 'COD',
      },
    };
    const res = makeRes();
    const createdOrder = { ...req.body, _id: 'order-2' };
    orderModel.create.mockResolvedValue(createdOrder);

    await createOrder(req, res);

    expect(orderModel.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order created successfully',
      order: createdOrder,
    });
  });

  it('rejects requests that do not include a token', async () => {
    const req = { cookies: {} };
    const res = makeRes();
    const next = jest.fn();

    await validate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the user to the request for a valid token', async () => {
    jwt.verify.mockReturnValue({ id: 'user-4' });
    const req = { cookies: { token: 'valid-token' } };
    const res = makeRes();
    const next = jest.fn();

    await validate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual({ id: 'user-4' });
    expect(next).toHaveBeenCalled();
  });
});
