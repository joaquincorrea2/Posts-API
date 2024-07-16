// const app = require('express')()
const express = require("express");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const flash = require("connect-flash");
var cors = require("cors");

require("./config/passport");

const { dbConnection } = require("./database/config");
const { routerAuth } = require("./routes/auth");
const { routerDev } = require("./routes/db");
const { routerPosts } = require("./routes/posts");
const passport = require("passport");

// Inicializo la aplicación de express
const app = express();

// Conectar a la DB
dbConnection();

// Template Engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

//TODO: SI PONGO EL CORS DSPS DEL MID QUE IMPRIME LA SESSION Y EL USER SE EJECUTA DOS VECES ESE MID, XQ LA PRIMERA VEZ AL EJECUTARSE ANTES DEL CORS NO TIENE LA INFO DE LAS OPCIONES DEL CORS (ORIGIN Y CREDNTIALS) ENTONCES AL ESTAR DSPS DE ES MID EL MID DEL CORS EN ESE PUNTO SE VUELVE A EJECUTAE TODOS LOS MID DEL SERVER DSD EL PRINCIPIO
//   express:router dispatching OPTIONS /api/auth/signin +8s
//   express:router query  : /api/auth/signin +2ms              ARRANCA SECUENCIA
//   express:router expressInit  : /api/auth/signin +1ms
//   express:router serveStatic  : /api/auth/signin +1ms
//   express:router urlencodedParser  : /api/auth/signin +1ms
//   express:router jsonParser  : /api/auth/signin +1ms
//   express:router methodOverride  : /api/auth/signin +0ms
//   express:router session  : /api/auth/signin +1ms
//   express:router initialize  : /api/auth/signin +2ms
//   express:router authenticate  : /api/auth/signin +2ms
//   express:router <anonymous>  : /api/auth/signin +0ms        MID QUE IMPRIME SESSION Y USER
// Session {
//   cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
// }
// undefined
// hola mid serv
//   express:router corsMiddleware  : /api/auth/signin +4ms     SE EJECUTA CORS Y COMO TIENE OPCIONES Y EL ANTERIOR MID NO TENIA ESAS INFO, VUELVE A ARRANCAR TODO
//   express:router dispatching POST /api/auth/signin +7ms
//   express:router query  : /api/auth/signin +0ms              VUELVE A ARRANCAR SECUENCIA

//CORS
app.use(cors({ origin: "http://localhost:8080", credentials: true }));

//EXPRESS-SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_LOCAL_URI }),
  })
);

//********************************************IMPORTANTE********************************************
//TODO:SI IMPRIMO EL REQ.USER ANTES DE PASS NO SE IMPRIME PERO SI LO PONGO DSPS SE IMPRIME EL USER, PARECE QUE EL PASS LO AGREGA (DESARIALIZE?)
//PASSPORT
app.use(passport.initialize());
// sacado de docs de passport, app.use(passport.authenticate("session")); es lo mismo que lo de abajo
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.todo_ok = req.flash("todo_ok");
  res.locals.todo_error = req.flash("todo_error");
  res.locals.mensajeRegistro = req.flash("mensajeRegistro");
  //console.log(res.locals);
  next();
});

//MID
//SE EJECUTA DOS VECES CUANDO HAGO EL LOGIN, SIN REDIRIJO, UNA TERCERA, QUE ES LA QUE ME TRAE BIEN LOS DATOS DE SESSION Y USER (SOL: PONER CORS MAS ARRIBA)
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  console.log("hola mid serv");

  next();
});

// Routes
app.use("/api", routerAuth);
app.use("/api", routerDev); // Solo para desarrollo
app.use("/api", routerPosts);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) throw new Error("Ocurrió un problema con el servidor: ", err);
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});
