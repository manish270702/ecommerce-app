const axios = require('axios');
const orderModel = require('../model/order.model');
const { getorders, createOrder } = require('../controller/order.controllers');
const { validate } = require('../middlewares/checklogin.middleware');
const jwt = require('jsonwebtoken');

jest.mock('../model/order.model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
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
    process.env.ACCESS_TOKEN_SECRET = 'test-secret';
  });

  it('returns 401 when no user is attached to the request', async () => {
    const req = {};
    const res = makeRes();

    await getorders(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'unAuthorised' });
  });

  it('returns 200 with an order for an authenticated user', async () => {
    const req = { user: { id: 'user-1' } };
    const res = makeRes();
    orderModel.find.mockResolvedValue([{ _id: 'order-1', user: 'user-1' }]);

    await getorders(req, res);

    expect(orderModel.find).toHaveBeenCalledWith({ user: 'user-1' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'worked' }));
  });

  it('returns 404 when no order exists for the authenticated user', async () => {
    const req = { user: { id: 'user-2' } };
    const res = makeRes();
    orderModel.find.mockResolvedValue([]);

    await getorders(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'no orders' });
  });

  it('creates an order successfully', async () => {
    const req = {
      user: { id: 'user-3' },
      headers: { authorizaton: 'Bearer test-token' },
    };
    const res = makeRes();
    const createdOrder = { _id: 'order-2', user: 'user-3', items: [{ name: 'shoe', price: 25, quantity: 2 }], totalAmount: 50 };

    axios.get.mockResolvedValue({ data: { items: [{ user: 'user-3', items: [{ price: 25, quantity: 2 }] }] } });
    orderModel.create.mockResolvedValue(createdOrder);
    axios.delete.mockResolvedValue({});

    await createOrder(req, res);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/cart', {
      headers: { Authorization: 'Bearer test-token' },
    });
    expect(orderModel.create).toHaveBeenCalledWith({
      user: 'user-3',
      items: [{ price: 25, quantity: 2 }],
      totalAmount: 50,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order created successfully' });
  });

  it('rejects requests that do not include a token', async () => {
    const req = { headers: { authorization: 'Bearer ' } };
    const res = makeRes();
    const next = jest.fn();

    await validate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the user to the request for a valid token', async () => {
    jwt.verify.mockReturnValue({ id: 'user-4' });
    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = makeRes();
    const next = jest.fn();

    await validate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual({ id: 'user-4' });
    expect(next).toHaveBeenCalled();
  });
});
