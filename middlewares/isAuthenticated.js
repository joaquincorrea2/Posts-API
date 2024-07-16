const isAuthenticated = (req, res, next) => {
  //console.log(req);
  console.log("a0");

  if (req.isAuthenticated()) {
    console.log("a1");
    // res.status(200).json("logueado");
    return next();
  }
  console.log("a2");
  // TODO: EL FLASH ME GENERA UNA SESSION EL TODO ERROR
  //req.flash("todo_error", "Acceso no autorizado");

  //res.redirect("/auth/signin");

  res.status(401).json("NO AUTORIZADO, debe iniciar sesion");
};

module.exports = isAuthenticated;
