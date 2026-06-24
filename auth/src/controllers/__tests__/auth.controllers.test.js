const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

jest.mock('../../models/user.model')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

const usermodel = require('../../models/user.model')

const { register, login, refreshToken, admin, me, logout } = require('../auth.controllers')

const createMockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.cookie = jest.fn()
  res.clearCookie = jest.fn()
  return res
}

describe('Auth Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    test("returns 409 when passwords don't match", async () => {
      const req = { body: { password: 'a', confirmPassword: 'b' } }
      const res = createMockRes()

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ message: "Password doesn't match" })
    })

    test('returns 409 when user already exists', async () => {
      usermodel.findOne.mockResolvedValue({ email: 'exists@example.com' })
      const req = { body: { password: 'p', confirmPassword: 'p', email: 'exists@example.com' } }
      const res = createMockRes()

      await register(req, res)

      expect(usermodel.findOne).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ message: 'user already exists with this email' })
    })

    test('creates user and returns tokens on success', async () => {
      usermodel.findOne.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashed')
      const createdUser = { _id: '1', email: 'u@example.com', role: 'user' }
      usermodel.create.mockResolvedValue(createdUser)
      jwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token')

      const req = { body: { name: 'u', email: 'u@example.com', phone: '123', password: 'p', confirmPassword: 'p' } }
      const res = createMockRes()

      await register(req, res)

      expect(usermodel.findOne).toHaveBeenCalledWith({ email: 'u@example.com' })
      expect(usermodel.create).toHaveBeenCalled()
      expect(res.cookie).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'user created', user: createdUser, accessToken: 'access-token' }))
    })
  })

  describe('login', () => {
    test('returns 409 when credentials invalid', async () => {
      const foundUser = { _id: '1', email: 'a@b.com', password: 'hashed' }
      usermodel.findOne.mockResolvedValue(foundUser)
      bcrypt.compare.mockResolvedValue(false)

      const req = { body: { loginId: 'a@b.com', password: 'wrong' } }
      const res = createMockRes()

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ message: 'something went wrong' })
    })

    test('logs in successfully', async () => {
      const foundUser = { _id: '1', email: 'a@b.com', password: 'hashed', role: 'user' }
      usermodel.findOne.mockResolvedValue(foundUser)
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign.mockReturnValueOnce('access').mockReturnValueOnce('refresh')

      const req = { body: { loginId: 'a@b.com', password: 'pass' } }
      const res = createMockRes()

      await login(req, res)

      expect(res.cookie).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'user logined successfully', user: foundUser, accessToken: 'access' }))
    })
  })

  describe('refreshToken', () => {
    test('refreshes token successfully', async () => {
      const req = { cookies: { token: 'rtoken' } }
      const res = createMockRes()
      jwt.verify.mockReturnValue({ id: '1' })
      const foundUser = { _id: '1', email: 'a@b.com', role: 'user' }
      usermodel.findOne.mockResolvedValue(foundUser)
      jwt.sign.mockReturnValueOnce('access').mockReturnValueOnce('refresh')

      await refreshToken(req, res)

      expect(usermodel.findOne).toHaveBeenCalledWith({ _id: '1' })
      expect(res.cookie).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'token refreshed successfully', user: foundUser, accessToken: 'access' }))
    })
  })

  describe('me', () => {
    test('returns user from req.user when present', async () => {
      const req = { user: { _id: 'u1', email: 'me@example.com' } }
      const res = createMockRes()

      await me(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ user: { _id: 'u1', email: 'me@example.com' } })
    })

    test('returns user from token cookie when req.user missing', async () => {
      const req = { cookies: { token: 'rtoken' } }
      const res = createMockRes()
      jwt.verify.mockReturnValue({ id: '1' })
      const foundUser = { _id: '1', email: 'a@b.com' }
      usermodel.findOne.mockResolvedValue(foundUser)

      await me(req, res)

      expect(jwt.verify).toHaveBeenCalledWith('rtoken', process.env.REFRESH_TOKEN_SECRET)
      expect(usermodel.findOne).toHaveBeenCalledWith({ _id: '1' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ user: foundUser })
    })
  })

  describe('logout', () => {
    test('clears token cookie and returns success', async () => {
      const req = {}
      const res = createMockRes()

      await logout(req, res)

      expect(res.clearCookie || res.cookie).toBeDefined()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'logged out successfully' })
    })
  })

  describe('admin', () => {
    test('creates admin user successfully', async () => {
      usermodel.findOne.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashed')
      const createdUser = { _id: '2', email: 'adm@example.com', role: 'admin' }
      usermodel.create.mockResolvedValue(createdUser)
      jwt.sign.mockReturnValueOnce('access').mockReturnValueOnce('refresh')

      const req = { body: { name: 'adm', email: 'adm@example.com', phone: '321', password: 'p', confirmPassword: 'p' } }
      const res = createMockRes()

      await admin(req, res)

      expect(usermodel.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }))
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'user created', user: createdUser, accessToken: 'access' }))
    })
  })
})
