const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    genero: {
      type: String,
      required: true,
    },
    fecha_nacimiento: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favs: {
      type: Array,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AuthSchema.methods.passwordEncrypt = async (password) => {
  const salt = await bcrypt.genSalt(10); // Una semilla
  return await bcrypt.hash(password, salt);
};

AuthSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // true o false
};

module.exports = mongoose.model("Auth", AuthSchema);
