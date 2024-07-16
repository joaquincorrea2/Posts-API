const passport = require("passport");
const { Strategy } = require("passport-local");
const Auth = require("../models/auth");

//TODO:passReqToCallback SI PONGO EN TRUE PUEDO USAR EL REQ
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    //TODO: RECEIBE EL EMAIL Y PASSWORD DEL REQ.BODY SIN NECESIDAD DE USAR EL REQ.BODY
    async (req, email, password, done) => {
      // console.log("req.body");
      // console.log(req.body);
      // console.log(email + password + "HOLA 1");

      const user = await Auth.findOne({ email });
      if (!user) {
        return done(null, false, { message: "User not found." });
      }

      const isMatch = await user.checkPassword(password);
      // console.log(email + isMatch + "HOLA 2");
      if (!isMatch) {
        return done(null, false, { message: "Password error" });
      }
      // console.log(user + "HOLA 3");
      console.log("hola auth");

      return done(null, user);
    }
  )
);

//CUANDO CONSTRUYO LA SESSION USAR EL ID PARA PONERLA EN LA SESSION
passport.serializeUser((user, done) => {
  // console.log(user + "HOLA 4");
  done(null, user.id);
});

//CUANDO USO EL IS AUTH
passport.deserializeUser((id, done) => {
  console.log(id + "HOLA 5");
  Auth.findById(id, (err, user) => {
    done(err, user);
  });
});
