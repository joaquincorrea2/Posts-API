const express = require("express");
const routerPosts = express.Router();

const {
  getPosts,
  newPost,
  createPost,
  showPost,
  deletePost,
  showPostFormEdit,
  traerPostCards,
  edit,
  getPostsMoreVisits,
} = require("../controllers/posts");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Rutas de Index

//SIN USO
// routerPosts.get("/", traerPostCards);
// routerPosts.get("/posts/new", newPost);
// routerPosts.get("/posts/edit/:id", showPostFormEdit);

//EL isAuthenticated ME PROHIBIR DARME LOS DATOS QUE NECESITO DE LA API PERO LA VIEW DE VUE ME LA IMPRIMIR IGUAL
//CADA VEZ QUE EJECUTO EL isAuthenticated SE EJECUTA EL MID SERV Y ANTES DE ESO DESERIALIZE
//HOME
routerPosts.get("/posts", getPosts);
routerPosts.get("/posts/visits", getPostsMoreVisits);

//
routerPosts.get("/posts/:slug", isAuthenticated, showPost);

routerPosts.post("/posts/create", isAuthenticated, createPost);

routerPosts.put("/posts/:id", isAuthenticated, edit);

routerPosts.delete("/posts/:id", isAuthenticated, deletePost);

//routerPosts.get("/user/posts", getUserPosts);

module.exports = {
  routerPosts,
};
