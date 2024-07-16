const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },

    visits: {
      type: Number,
      required: true,
    },

    //para sacar el unique tuve que borrar la coleccion y volver a crearla
    //TODO:para que se vean los cambios que hago aca tengo que reiniciar el servidor (bash)
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Middleware .pre()
// TODO: Llevar este middleware a un archivo separado

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// postSchema.set({ timestamps: true });

module.exports = mongoose.model("Post", postSchema);
