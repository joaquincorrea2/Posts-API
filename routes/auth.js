const { response } = require("express");
const express = require("express");
const routerAuth = express.Router();
const {
  signup,
  signin,
  logout,
  getUserDatos,
  postUserFavPost,
  deleteUserFavPost,
  getUserFavPost,
  getUserPosts,
  //   showAuthFormSignIn,
  //   logout,
} = require("../controllers/auth");
const isAuthenticated = require("../middlewares/isAuthenticated");
const validation = require("../middlewares/validationAuth");

//const logInSchema = require("../validation/logInSchema");
const { registerSchema, logInSchema } = require("../validation/auth");

// Routes

routerAuth.post("/auth/signup", validation(registerSchema), signup);

//TODO: UNA VEZ QUE SE EJECUTO EL signin, SIGUE CON LA SIGUENTE FUNCION, SI HAY UN 401 NO SE EJECUTA ESTA FUNCION, SI ES EXITOSO EN EL REQ AHI TENGO LO QUE DEVUELVE EL DONE (USER Y LA SESSION), SI DEVUELVO SOLO EL REQ ME DA ERROR (500), CON EL JSON PUEDO DEVOLVER EL req.user O req.session, SI USO EL SEND NO PASO NADA
routerAuth.post(
  "/auth/signin",
  validation(logInSchema),
  signin,
  function (req, res = response) {
    // console.log(res);

    // res.send("ok");

    //console.log(req.flash("mensajeRegistro"));

    console.log("hola sign in func");
    res.status(200).json(req.user);
  }
);

routerAuth.get("/auth/logout", logout);

routerAuth.get("/auth/authenticated", isAuthenticated); //VER ESTO

routerAuth.put("/auth/post/updateFav", isAuthenticated, postUserFavPost);
routerAuth.put("/auth/post/deleteFav", isAuthenticated, deleteUserFavPost);

routerAuth.get("/auth/datos-user", isAuthenticated, getUserDatos);
routerAuth.get("/auth/user/posts", isAuthenticated, getUserPosts);
routerAuth.get("/auth/post/favs", isAuthenticated, getUserFavPost);

//SIN USO
//TODO: LO MOVI ABAJO PORQUE SINO ME DABA ERROR CON EL authenticated, PARECE QUE TOMABA EL authenticated COMO EL NICK CUANDO HACIA LA PETCION, SI FURON DIFERENTES METODOS NO HABRIA PROBLEMA PERO SON LOS DOS GET JUSTO
// routerAuth.get("/auth/:nick", isAuthenticated, getUserDatos);
//ESTE GETUSER SE ME EJECUTA POR EL GUARDS DSPS DE CERRAR SESION
//TODO: ***VER ESTA RUTA***

module.exports = {
  routerAuth,
};
