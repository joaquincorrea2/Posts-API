const express = require("express");
const {
  showAuthFormSignUp,
  signup,
  showAuthFormSignIn,
  signin,
  logout,
} = require("../controllers/auth");
const routerAuth = express.Router();

// Routes

routerAuth.get("/auth/signup", showAuthFormSignUp);
routerAuth.post("/auth/signup", signup);

routerAuth.get("/auth/signin", showAuthFormSignIn);
routerAuth.post("/auth/signin", signin);

routerAuth.get("/auth/logout", logout);

module.exports = {
  routerAuth,
};
