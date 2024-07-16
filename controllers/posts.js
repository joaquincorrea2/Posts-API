const { response } = require("express");
const { isValidObjectId, isObjectIdOrHexString } = require("mongoose");
const Post = require("../models/posts");

// Mostrar los post en cards

// SIN USO
const traerPostCards = async (req, res = response) => {
  try {
    const posts = await Post.find({}).lean(); // Me deja un obj puro de JS
    //console.log(posts)
    const title = "InfoBlog - Inicio";
    res.status(200).render("home", {
      title,
      posts,
    });
  } catch (error) {
    console.log("Error INDEX", error);
  }
};

// INDEX
const getPosts = async (req, res = response) => {
  try {
    const posts = await Post.find({}).lean(); // Me deja un obj puro de JS

    //console.log(posts);

    console.log("hola home");

    res.status(200).json(posts);

    /*const title = "InfoBlog - Listado de Post";
    res.status(200).render("index", {
      title,
      posts,
    })*/
  } catch (error) {
    console.log("Error INDEX", error);
  }
};

// POSTS MAS VISITADOS
const getPostsMoreVisits = async (req, res = response) => {
  try {
    //ACA TRAIA LOS POSTS QUE TENIAN VISITAS MAYOR A O, AL AZAR, Y LIMITABA A 3 DOCS
    // const posts = await Post.find({ visits: { $gt: 0 } })
    //   .limit(3)
    //   .lean(); // Me deja un obj puro de JS

    // console.log(posts);

    //ACA ORDENO LOS POSTS EN ORDEN DESCENDENTE (-1) DE ACUERDO A LAS VISITAS Y LIMITABA A 3 DOCS
    const posts = await Post.find({}).sort({ visits: -1 }).limit(3).lean(); // Me deja un obj puro de JS

    console.log(posts);

    //LO IBA A USAR POR SI TENIA MENOS DE 3 POSTS SIN VISITAS, PERO AL CREAR POSTS CON DB/FRESH TAMBIEN SE CREA AL AZAR EL CONTADOR DE VISITAS
    // if (posts.length < 3) {
    // }

    console.log("hola getPostsMoreVisits");

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error INDEX", error);
  }
};

// SHOW
//VER BIEN LO DE VISITS, SERIA PUT POR EL UPDATE??????????
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();

    if (post == null) {
      return res.status(404).json("Post no encontrado.");
    }

    //para que devuelva el objeto actualizado
    let options = { returnDocument: "after" };

    console.log(post.visits);

    const postEdit = await Post.updateOne(
      { slug: req.params.slug },
      { visits: post.visits + 1 },
      options
    );
    console.log(postEdit);

    res.status(200).json(post);

    // res.render("show", {
    //   title: `InfoBlog - ${post.title}`,
    //   post,
    // });
  } catch (error) {
    console.log("Error SHOW", error);
  }
};

// DELETE
const deletePost = async (req, res = response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json("Id invalido.");
      return;
    }

    const post = await Post.findByIdAndDelete(req.params.id);

    if (post == null) {
      res.status(404).json("Post no encontrado.");
      return;
    }

    res.status(200).json(post);

    /*setTimeout(() => {
      res.redirect("/posts");
    }, 1000);*/
  } catch (error) {
    console.log("Error DELETE", error);
  }
};

//SIN USO
// NEW
const newPost = (req, res = response) => {
  res.status(200).render("new");
};

// CREATE
const createPost = async (req, res = response) => {
  try {
    //para enviar respuesta cuando el texto esta vacio pero el titulo es valido
    if (!req.body.body) {
      return res.status(400).json("Por favor introduzca un texto.");
    }

    const postBuscado = await Post.findOne({ title: req.body.title }).lean();
    console.log(postBuscado);

    //SI YA EXISTE EL TITULO
    if (postBuscado) {
      return res
        .status(400)
        .json("El titulo ya existe. Por favor introduzca uno nuevo.");
    }

    let post = new Post();

    post.title = req.body.title;
    post.body = req.body.body;
    post.visits = 0;
    //passport me crea req.user si estoy logueado
    post.user = req.user.nickname;

    post = await post.save();

    res.status(200).json(post);

    //res.redirect(`/posts/${post.slug}`);
    //res.send("ok");
  } catch (error) {
    console.log("Error CREATE", error);
  }
};

//SIN USO
// Show Post Form Edit
const showPostFormEdit = async (req, res = response) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    res.status(200).json(post);

    /*res.render("edit", {
      title: "Editando Post",
      post,
    });*/
  } catch (error) {
    console.log("Show Edit Post", error);
  }
};

//SOLO SE PUEDE EDITAR EL BODY (TEXTO), EL TITLE NO SE PUEDE
const edit = async (req, res = response) => {
  try {
    console.log(req.body);
    const postBuscado = await Post.findOne({ title: req.body.title }).lean();
    console.log(postBuscado);

    //SI ES NULL ES PORQUE NO ENCONTRO NINUGN POST EN BASE AL TITULO, LO MODOIFICO ENTONCES NO ENCUTRA NINGUNO CON ES NOMBRE
    if (postBuscado == null) {
      res.status(400).json("El titulo no se puede modificar.");
      return;
    }

    const noModificoTexto = postBuscado.body == req.body.body;

    console.log(noModificoTexto);

    //SI NO MODIFICO EL BODY (TEXTO) O ESTA VACIO
    if (noModificoTexto || !req.body.body) {
      res
        .status(400)
        .json(
          "Debe modificar el texto si quiere editar el post, sino no se efectuara ningun cambio. No puede dejar vacio el texto."
        );
      return;
    }

    //para que devuelva el objeto actualizado
    let options = { returnDocument: "after" };

    const id = req.params.id;

    console.log(id);

    const { body } = req.body;

    const postEdit = await Post.findByIdAndUpdate(id, { body }, options);

    console.log(postEdit);

    res.status(200).json(postEdit);

    //res.redirect(`/posts/${postEdit.slug}`);
  } catch (error) {
    console.log("Edit Post", error);
  }
};

module.exports = {
  getPosts,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  traerPostCards,
  edit,
  getPostsMoreVisits,
};
