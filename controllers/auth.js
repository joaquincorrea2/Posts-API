const { response } = require("express");
const passport = require("passport");

const Auth = require("../models/auth");

const showAuthFormSignUp = (req, res = response) => {
  res.render("auth/signup");
};

const signup = async (req, res = response) => {
  const errors = [];
  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    console.log("Password do not match.");
    errors.push({ msg: "Password do not match." });
  }

  if (password.length < 4) {
    console.log("Password must be at least 4 characters");
    errors.push({ msg: "Password must be at least 4 characters" });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
    });
  }

  const userFound = await Auth.findOne({ email });
  if (userFound) {
    return res.redirect("/auth/signup");
  }

  const newUser = new Auth({ name, email, password });
  newUser.password = await newUser.passwordEncrypt(password);
  await newUser.save();
  res.redirect("/auth/signin");
};

const showAuthFormSignIn = (req, res = response) => {
  res.render("auth/signin");
};

const signin = passport.authenticate("local", {
  successRedirect: "/posts",
  failureRedirect: "/auth/signin",
});

const logout = async (req, res = response, next) => {
  await req.logout((err) => {
    if (err) return next();
    res.redirect("/auth/signin");
  });
};

module.exports = {
  showAuthFormSignUp,
  signup,
  showAuthFormSignIn,
  signin,
  logout,
};
