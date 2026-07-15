const express = require("express");
const { register, login, refreshUserToken,admin, me,updateUser, updateAddress } = require("../controllers/auth.controllers");
const passport = require("passport");
const router = express.Router()
const validate = require("../middlewares/checklogin.middleware")

router.post("/register",
    register
);
router.post("/login",
    login
);

router.post("/admin/register",
    admin
)

router.get("/refreshToken",
    refreshUserToken
);


router.get("/me",
    me
);

router.patch("/update",
    validate,
    updateUser
);
router.post("/update-address",
    validate,
    updateAddress
);


// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get('/auth/google/callback',
//   passport.authenticate('google', { session: false }),
//   (req, res) => {
//     // Generate a JWT for the authenticated user
//     const token = jwt.sign({ id: req.user.id, displayName: req.user.displayName }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     // Send the token to the client
//     res.json({ token });
//   }
// );
module.exports = router