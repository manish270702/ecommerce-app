jest.mock('../../model/cart.model')

const cartModel = require('../../model/cart.model')
const { createCart, updateCart } = require('../cart.controllers')

const createMockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('Cart CRUD Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createCart', () => {
    test('returns 401 when user missing', async () => {
      const req = { body: { items: [] } }
      const res = createMockRes()

      await createCart(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'unauthorized' })
    })

    test('creates item on success', async () => {
      const created = { _id: 'c1', items: [{ product: 'p1' }] }
      cartModel.create.mockResolvedValue(created)

      const req = { user: { id: 'u1' }, body: { items: [{ product: 'p1' }] } }
      const res = createMockRes()

      await createCart(req, res)

      expect(cartModel.create).toHaveBeenCalledWith({ user: 'u1', items: req.body.items })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ item: created })
    })

    test('handles create errors', async () => {
      cartModel.create.mockRejectedValue(new Error('db'))
      const req = { user: { id: 'u1' }, body: { items: [] } }
      const res = createMockRes()

      await createCart(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'something went wrong' })
    })
  })

  describe('updateCart', () => {
    test('returns 401 when user missing', async () => {
      const req = { params: { id: 'c1' }, body: { items: [] } }
      const res = createMockRes()

      await updateCart(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'unauthorized' })
    })

    test('updates item on success', async () => {
      const updated = { _id: 'c1', items: [{ product: 'p2' }] }
      cartModel.findOneAndUpdate.mockResolvedValue(updated)

      const req = { user: { id: 'u1' }, params: { id: 'c1' }, body: { items: [{ product: 'p2' }] } }
      const res = createMockRes()

      await updateCart(req, res)

      expect(cartModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'c1', user: 'u1' },
        { $set: req.body },
        { new: true }
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ item: updated })
    })

    test('handles update errors', async () => {
      cartModel.findOneAndUpdate.mockRejectedValue(new Error('db'))
      const req = { user: { id: 'u1' }, params: { id: 'c1' }, body: {} }
      const res = createMockRes()

      await updateCart(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'something went wrong' })
    })
  })
})
