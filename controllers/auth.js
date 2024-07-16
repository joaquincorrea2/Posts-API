const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const passport = require("passport");

const Auth = require("../models/auth");
const Post = require("../models/posts");

const signup = async (req, res = response) => {
  const errors = [];
  const {
    name,
    last_name,
    nickname,
    genero,
    fecha_nacimiento,
    email,
    confirm_email,
    password,
    confirm_password,
  } = req.body;

  if (password !== confirm_password) {
    console.log("La contraseña no coincide.");
    errors.push({ msg: "La contraseña no coincide." });
  }

  if (password.length < 4) {
    console.log("La contraseña debe tener al menos 4 caracteres.");
    errors.push({ msg: "La contraseña debe tener al menos 4 caracteres." });
  }

  const userFound = await Auth.findOne({ email });
  if (userFound) {
    errors.push({ msg: "El email ya esta registrado." });
    // return res.json({ msg: "El email ya esta registrado." });
  }

  const userNickFound = await Auth.findOne({ nickname });
  if (userNickFound) {
    errors.push({ msg: "El nick ya esta registrado." });
    // return res.json({ msg: "El email ya esta registrado." });
  }

  //TODO:!userFound LE DOY PRIORIDAD AL MSG DE EMAIL REGISTRADO, UNA VEZ QUE SE VERIFICO QUE EL EMAIL NO ESTA REGISTRADO, ME FIJO QUE COINCIDAN LOS EMAIL
  if (email !== confirm_email && !userFound) {
    console.log("El email no coincide.");
    errors.push({ msg: "El email no coincide." });
  }

  //   if (errors.length > 0) {
  //     return res.render("auth/signup", {
  //       errors,
  //       name,
  //       email,
  //     });
  //   }

  if (errors.length > 0) {
    return res.status(400).json({
      errors,
      //no necesito esto porque vue no me saca los datos del form
      //   name,
      //   last_name,
      //   email,
    });
  }

  // TODO: LO MUEVO ARRIBA Y HAGO QUE AGREGUE ERRORES AL ARRAY
  //   const userFound = await Auth.findOne({ email });
  //   if (userFound) {
  //     return res.json("El email ya esta registrado");
  //   }

  //

  const newUser = new Auth({
    name,
    last_name,
    nickname,
    genero,
    fecha_nacimiento,
    email,
    password,
  });
  newUser.password = await newUser.passwordEncrypt(password);
  const newUserSave = await newUser.save();

  // console.log("hola flash");
  // req.flash(
  //   "mensajeRegistro",
  //   "Gracias por crear tu cuenta, ahora estas autentificado."
  // );

  // const flash = req.flash("mensajeRegistro");
  // console.log(flash);

  // const msg = { msg: "Gracias por crear tu cuenta, ahora estas autentificado" };

  // const nuevo = new Array(newUserSave, msg);
  // console.log(nuevo);

  console.log("hola reg");

  res.status(200).json(newUserSave);

  //   req.flash("todo_ok", "Se registró correctamente");
  //   res.redirect("/auth/signin");
};

//TODO:USO SIN EL FAILURE Y SUCCESS XQ NO REDIRIIJO SINO QUE SI NO COINCIDE ALGO ME DEVUELVE UN 401, ESTE AUTHENTICATE ME LLEVA A LA ESTRATEGIA DEL PASSPORT QUE ESTA EN CONFIG
const signin = passport.authenticate("local");

// const signin = passport.authenticate("local", {
//   successRedirect: "/posts",
//   failureRedirect: "/auth/signin",
// });

const logout = async (req, res = response, next) => {
  await req.logout((err) => {
    console.log(err);
    if (err) return next(err);
    res.json("SESION CERRADA");
  });
};

// SHOW
//TODO:REQ.USER YA TENGO EL USARIO? Y MANDARLO EN UN JSON
const getUserDatos = async (req, res = response) => {
  try {
    //console.log(req.user);

    const user = await Auth.findOne({ _id: req.user.id }).lean();
    if (user === null) {
      res.status(404).json("User no encontrado");
      return;
    }

    //SACO EL PASSWORD DEL OBJETO QUE PASO AL FRONT
    delete user.password;

    console.log("getUserDatos");
    console.log(user);

    res.status(200).json(user);

    // res.render("show", {
    //   title: `InfoBlog - ${post.title}`,
    //   post,
    // });
  } catch (error) {
    console.log("Error getUserDatos", error);
  }
};

const postUserFavPost = async (req, res = response) => {
  try {
    if (!isValidObjectId(req.body.id)) {
      res.status(400).json("Id invalido.");
      return;
    }

    //
    const post = await Post.findOne({ _id: req.body.id }).lean();
    if (post == null) {
      res.status(404).json("Post no encontrado.");
      return;
    }

    //
    let options = { returnDocument: "after" };
    const favsId = post._id;

    const userFound = await Auth.findById(req.user.id);
    if (userFound == null) {
      res.status(404).json("User no encotrado.");
      return;
    }

    // TODO:PARA COMPARAR OBJECTID USAR .EQUALS()
    const estaEnFav = userFound.favs.some((element) =>
      element.equals(post._id)
    );

    //cond, para ver que no este en favoritos, si esta (true) entra al else por el !true, si no esta (false) entra al if
    //en el update de acuerdo al id del user, pusheo en el array favs el id del post que marque como fav
    if (!estaEnFav) {
      console.log("if cond");
      const userUpdate = await Auth.updateOne(
        { _id: userFound.id },
        { $push: { favs: favsId } },
        options
      );
      console.log(userUpdate);
      res.status(200).json(userUpdate);
    } else {
      res.status(400).json("Este post ya esta en favoritos.");
    }
  } catch (error) {
    console.log("Error postUserFavPost", error);
  }
};

const deleteUserFavPost = async (req, res = response) => {
  try {
    if (!isValidObjectId(req.body.id)) {
      res.status(400).json("Id invalido.");
      return;
    }

    //
    const post = await Post.findOne({ _id: req.body.id }).lean();
    if (post == null) {
      res.status(404).json("Post no encontrado.");
    }

    //
    let options = { returnDocument: "after" };
    const favsId = post._id;

    const userFound = await Auth.findById(req.user.id);
    if (userFound == null) {
      res.status(404).json("User no encotrado.");
    }

    // TODO:PARA COMPARAR OBJECTID USAR .EQUALS()
    const estaEnFav = userFound.favs.some((element) =>
      element.equals(post._id)
    );

    //SI EXISTE ENTRA PARA ELIMINAR
    if (estaEnFav) {
      console.log("if cond");
      const userUpdate = await Auth.updateOne(
        { _id: userFound.id },
        { $pull: { favs: favsId } },
        options
      );
      res.status(200).json(userUpdate);
    } else {
      res.status(400).json("Este post ya se elimino.");
    }
  } catch (error) {
    console.log("Error deleteUserFavPost", error);
  }
};

const getUserFavPost = async (req, res = response) => {
  try {
    //
    //console.log(req.user.id);

    //TODO: SI NO ESTA LOGUEADO DEVUELVO EL 404 Y CORTO EL FLUJO
    if (req.user == undefined) {
      res.status(401).json("NO ESTA LOGUEADO, NO PUEDE AGREGAR FAVS.");
      return;
    }

    const userFound = await Auth.findById(req.user.id);
    if (userFound == null) {
      res.status(404).json("User no encontrado.");
      return;
    }

    console.log(userFound.favs);

    //TODO: CON $in PUEDO BUSCAR EN UN ARRAY
    const posts = await Post.find({ _id: { $in: userFound.favs } }).lean(); // Me deja un obj puro de JS
    if (posts == null) {
      res.status(400).json("Error en la busqueda del usuario.");
      return;
    }

    //TODO: PARA ODENAR LOS POSTS DE ACUERDO AL ORDEN DE COMO SE FUERON AGREGANDO. HAGO UN MAP DE userFound.favs, ESTO LO QUE HACE ES HACER UN ARRAY NUEVO DE ACUERDO A LA FUNCION, A ESTA FUNCION LE PASO EL ID QUE TENGO EN userFound.favs QUE ESTAN EL ORDEN QUE YO NECESITO. CON FIND BUSCO LOS POSTS (SON LOS QUE TIENEN TODA LA INFO (TITLE, BODY, ETC)), ESTO LO QUE HACE ES VA RECIBIENDO LOS ID DE userFound.favs EN EL ORDEN QUE YO NECESITO ENTONCES BUSCA EN POSTS SI HAY ALGUNO CON ESE ID, CUANDO LO ENCUENTRA LO PONE EN EL NUEVO ARRAY QUE ARMA .MAP QUE ES postsOrdenados
    const postsOrdenados = userFound.favs.map((id) =>
      posts.find((post) => post._id.equals(id))
    );

    // console.log("posts");
    // console.log(posts);

    console.log("postsOrdenados");
    console.log(postsOrdenados);

    res.status(200).json(postsOrdenados);
  } catch (error) {
    console.log("Error getUserFavPost", error);
  }
};

//POSTS PARA USUARIO ESPECIFICO
const getUserPosts = async (req, res = response) => {
  try {
    console.log(req.user);
    const posts = await Post.find({ user: req.user.nickname }).lean(); // Me deja un obj puro de JS
    if (posts == null) {
      res.status(400).json("Error en la busqueda del usuario.");
      return;
    }

    console.log(posts);
    console.log(req.user._id);

    res.status(200).json(posts);

    /*const title = "InfoBlog - Listado de Post";
    res.status(200).render("index", {
      title,
      posts,
    })*/
  } catch (error) {
    console.log("Error getPostsUser", error);
  }
};

module.exports = {
  signup,
  signin,
  logout,
  getUserDatos,
  postUserFavPost,
  deleteUserFavPost,
  getUserFavPost,
  getUserPosts,
};
