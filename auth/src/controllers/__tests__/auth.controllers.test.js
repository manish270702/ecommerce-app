const {
  register,
  login,
  refreshUserToken,
  admin,
  me,
  logout,
  updateUser,
  updateAddress,
} = require("../auth.controllers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const usermodel = require("../../models/user.model");


const createMockRes = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);

  return res;
};

describe("Auth Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";
  });

  // ================= REGISTER =================

  describe("register", () => {
    test("returns 409 if passwords don't match", async () => {
      const req = {
        body: {
          password: "123",
          confirmPassword: "456",
        },
      };

      const res = createMockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "Password doesn't match",
      });
    });

    test("returns 409 if email already exists", async () => {
      bcrypt.hash.mockResolvedValue("hashed");

      usermodel.findOne.mockResolvedValue({
        email: "abc@test.com",
      });

      const req = {
        body: {
          name: "ABC",
          email: "abc@test.com",
          phone: "9999999999",
          password: "123",
          confirmPassword: "123",
        },
      };

      const res = createMockRes();

      await register(req, res);

      expect(usermodel.findOne).toHaveBeenCalledWith({
        email: "abc@test.com",
      });

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "user already exists with this email",
      });
    });

    test("creates user successfully", async () => {
      bcrypt.hash.mockResolvedValue("hashed");

      usermodel.findOne.mockResolvedValue(null);

      const createdUser = {
        _id: "1",
        email: "abc@test.com",
        role: "user",
      };

      usermodel.create.mockResolvedValue(createdUser);

      jwt.sign
        .mockReturnValueOnce("access-token")
        .mockReturnValueOnce("refresh-token");

      const req = {
        body: {
          name: "ABC",
          email: "abc@test.com",
          phone: "9999999999",
          password: "123",
          confirmPassword: "123",
        },
      };

      const res = createMockRes();

      await register(req, res);

      expect(usermodel.create).toHaveBeenCalled();

      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "refresh-token",
        expect.any(Object)
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "user created",
          accessToken: "access-token",
        })
      );
    });
  });

  // ================= LOGIN =================

  describe("login", () => {
    test("returns 409 when user not found", async () => {
      usermodel.findOne.mockResolvedValue(null);

      const req = {
        body: {
          loginId: "abc@test.com",
          password: "123",
        },
      };

      const res = createMockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "invalid crednetials",
      });
    });

    test("returns 409 when password incorrect", async () => {
      usermodel.findOne.mockResolvedValue({
        password: "hashed",
      });

      bcrypt.compare.mockResolvedValue(false);

      const req = {
        body: {
          loginId: "abc@test.com",
          password: "123",
        },
      };

      const res = createMockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "invalid crednetials",
      });
    });

    test("login success", async () => {
      const user = {
        _id: "1",
        email: "abc@test.com",
        password: "hashed",
        role: "user",
      };

      usermodel.findOne.mockResolvedValue(user);

      bcrypt.compare.mockResolvedValue(true);

      usermodel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "1",
          email: "abc@test.com",
        }),
      });

      jwt.sign
        .mockReturnValueOnce("access-token")
        .mockReturnValueOnce("refresh-token");

      const req = {
        body: {
          loginId: "abc@test.com",
          password: "123",
        },
      };

      const res = createMockRes();

      await login(req, res);

      expect(res.cookie).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "user logined successfully",
          accessToken: "access-token",
        })
      );
    });
  });

    // ================= REFRESH USER TOKEN =================

  describe("refreshUserToken", () => {
    test("returns 401 when refresh token is missing", async () => {
      const req = {
        cookies: {},
      };

      const res = createMockRes();

      await refreshUserToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Refresh token missing",
      });
    });

    test("returns 404 when user does not exist", async () => {
      jwt.verify.mockReturnValue({
        id: "1",
      });

      usermodel.findOne.mockResolvedValue(null);

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await refreshUserToken(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(
        "refresh-token",
        "refresh-secret"
      );

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "User no longer exists",
      });
    });

    test("refreshes token successfully", async () => {
      const user = {
        _id: "1",
        email: "abc@test.com",
        role: "user",
      };

      jwt.verify.mockReturnValue({
        id: "1",
      });

      usermodel.findOne.mockResolvedValue(user);

      jwt.sign
        .mockReturnValueOnce("new-access-token")
        .mockReturnValueOnce("new-refresh-token");

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await refreshUserToken(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "new-refresh-token",
        expect.any(Object)
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Token refreshed successfully",
        accessToken: "new-access-token",
        user,
      });
    });

    test("returns 403 when jwt verification fails", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid token");
      });

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await refreshUserToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);

      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired refresh token",
      });
    });
  });

  // ================= ADMIN =================

  describe("admin", () => {
    test("returns 409 when passwords don't match", async () => {
      const req = {
        body: {
          password: "123",
          confirmPassword: "456",
        },
      };

      const res = createMockRes();

      await admin(req, res);

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "Password doesn't match",
      });
    });

    test("returns 409 when admin already exists", async () => {
      bcrypt.hash.mockResolvedValue("hashed");

      usermodel.findOne.mockResolvedValue({
        email: "admin@test.com",
      });

      const req = {
        body: {
          name: "Admin",
          email: "admin@test.com",
          phone: "9999999999",
          password: "123",
          confirmPassword: "123",
        },
      };

      const res = createMockRes();

      await admin(req, res);

      expect(res.status).toHaveBeenCalledWith(409);

      expect(res.json).toHaveBeenCalledWith({
        message: "user already exists with this email",
      });
    });

    test("creates admin successfully", async () => {
      bcrypt.hash.mockResolvedValue("hashed-password");

      usermodel.findOne.mockResolvedValue(null);

      const adminUser = {
        _id: "2",
        email: "admin@test.com",
        role: "admin",
      };

      usermodel.create.mockResolvedValue(adminUser);

      jwt.sign
        .mockReturnValueOnce("admin-access")
        .mockReturnValueOnce("admin-refresh");

      const req = {
        body: {
          name: "Admin",
          email: "admin@test.com",
          phone: "9999999999",
          password: "123",
          confirmPassword: "123",
        },
      };

      const res = createMockRes();

      await admin(req, res);

      expect(usermodel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "admin",
        })
      );

      expect(res.cookie).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "user created",
          user: adminUser,
          accessToken: "admin-access",
        })
      );
    });
  });

    // ================= ME =================

  describe("me", () => {
    test("returns req.user if already authenticated", async () => {
      const req = {
        user: {
          _id: "1",
          email: "abc@test.com",
        },
      };

      const res = createMockRes();

      await me(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        user: req.user,
      });
    });

    test("returns 401 when refresh token missing", async () => {
      const req = {
        cookies: {},
      };

      const res = createMockRes();

      await me(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });

    test("returns user using refresh token", async () => {
      const user = {
        _id: "1",
        email: "abc@test.com",
      };

      jwt.verify.mockReturnValue({
        id: "1",
      });

      usermodel.findOne.mockResolvedValue(user);

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await me(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(
        "refresh-token",
        "refresh-secret"
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        user,
      });
    });

    test("returns 404 when user not found", async () => {
      jwt.verify.mockReturnValue({
        id: "1",
      });

      usermodel.findOne.mockResolvedValue(null);

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await me(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "user not found",
      });
    });

    test("returns 401 when token is invalid", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      const req = {
        cookies: {
          token: "refresh-token",
        },
      };

      const res = createMockRes();

      await me(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "unauthorized",
      });
    });
  });

  // ================= UPDATE USER =================

  describe("updateUser", () => {
    test("updates user successfully", async () => {
      const updatedUser = {
        _id: "1",
        name: "Updated",
      };

      usermodel.findOneAndUpdate.mockResolvedValue(updatedUser);

      const req = {
        user: {
          id: "1",
        },
        body: {
          name: "Updated",
        },
      };

      const res = createMockRes();

      await updateUser(req, res);

      expect(usermodel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "1" },
        { name: "Updated" },
        {
          new: true,
          runValidators: true,
        }
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: updatedUser,
      });
    });

    test("returns 500 if updateUser fails", async () => {
      usermodel.findOneAndUpdate.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "1",
        },
        body: {},
      };

      const res = createMockRes();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Database Error",
      });
    });
  });

  // ================= UPDATE ADDRESS =================

  describe("updateAddress", () => {
    test("updates address successfully", async () => {
      const updatedUser = {
        _id: "1",
        address: "Jaipur",
      };

      usermodel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const req = {
        user: {
          id: "1",
        },
        body: {
          address: "Jaipur",
        },
      };

      const res = createMockRes();

      await updateAddress(req, res);

      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        {
          address: "Jaipur",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "Address updated successfully",
        user: updatedUser,
      });
    });

    test("returns 500 if updateAddress fails", async () => {
      usermodel.findByIdAndUpdate.mockRejectedValue(
        new Error("Database Error")
      );

      const req = {
        user: {
          id: "1",
        },
        body: {},
      };

      const res = createMockRes();

      await updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Database Error",
      });
    });
  });

  // ================= LOGOUT =================

  describe("logout", () => {
    test("logs out successfully", async () => {
      const req = {};
      const res = createMockRes();

      await logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith(
        "token",
        expect.objectContaining({
          httpOnly: true,
        })
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: "logged out successfully",
      });
    });
  });
});


