jest.mock('../../model/cart.model')

const cartModel = require('../../model/cart.model')
const { getCartItems } = require('../cart.controllers')

const createMockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('Cart Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns 401 when user missing', async () => {
    const req = {}
    const res = createMockRes()

    await getCartItems(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'unauthorized' })
  })

  test('returns items on success', async () => {
    const found = [{ _id: '1', items: [] }]
    cartModel.find.mockResolvedValue(found)

    const req = { user: { id: 'u1' } }
    const res = createMockRes()

    await getCartItems(req, res)

    expect(cartModel.find).toHaveBeenCalledWith({ user: 'u1' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ items: found })
  })

  test('handles errors', async () => {
    cartModel.find.mockRejectedValue(new Error('db'))
    const req = { user: { id: 'u1' } }
    const res = createMockRes()

    await getCartItems(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'something went wrong' })
  })

  test('returns empty items when none found', async () => {
    cartModel.find.mockResolvedValue([])

    const req = { user: { id: 'u2' } }
    const res = createMockRes()

    await getCartItems(req, res)

    expect(cartModel.find).toHaveBeenCalledWith({ user: 'u2' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ items: [] })
  })

  test('calls find exactly once on success', async () => {
    const found = [{ _id: '2', items: [{ product: 'p1', qty: 1 }] }]
    cartModel.find.mockResolvedValue(found)

    const req = { user: { id: 'u3' } }
    const res = createMockRes()

    await getCartItems(req, res)

    expect(cartModel.find).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ items: found })
  })
})
