jest.mock('../src/models/product.model', () => ({
  create: jest.fn(),
  findOneAndDelete: jest.fn()
}));

jest.mock('../src/services/ImageKit', () => ({
  upload: jest.fn()
}));

const productModel = require('../src/models/product.model');
const imagekit = require('../src/services/ImageKit');
const { createProduct, deleteProduct } = require('../src/controllers/Product.controller');

describe('Product.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createProduct returns 400 when no images provided', async () => {
    const req = { body: { title: 't' }, files: [], user: { id: 'u1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('createProduct uploads images and creates product', async () => {
    imagekit.upload.mockResolvedValue({ url: 'http://img' });
    productModel.create.mockResolvedValue({ _id: 'p1', title: 't' });

    const req = {
      body: { title: 't', description: 'd', brand: 'b', category: 'c', price: 10, stock: 5 },
      files: [{ buffer: Buffer.from('a') }],
      user: { id: 'u1' }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createProduct(req, res);

    expect(imagekit.upload).toHaveBeenCalled();
    expect(productModel.create).toHaveBeenCalledWith(expect.objectContaining({ title: 't', createdBy: 'u1' }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('deleteProduct returns 404 when product not found', async () => {
    productModel.findOneAndDelete.mockResolvedValue(null);
    const req = { params: { id: 'nope' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('deleteProduct returns 200 when deleted', async () => {
    productModel.findOneAndDelete.mockResolvedValue({ _id: 'p1' });
    const req = { params: { id: 'p1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
