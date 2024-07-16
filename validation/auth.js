const yup = require("yup");

const registerSchema = yup.object({
  name: yup.string().required("Este campo es obligatorio."),
  last_name: yup.string().required("Este campo es obligatorio."),
  nickname: yup
    .string()
    .matches(/^\S+$/gm, "No puede contener espacios en blanco.")
    .required("Este campo es obligatorio."),
  genero: yup
    .string()
    .matches(
      /^([M]|[F]|[O])$/gm,
      "Opcion incorrecta. Opciones disponibles: M (Masculino), F (Femenino), O (Otro)."
    )
    .required("Este campo es obligatorio."),
  fecha_nacimiento: yup
    .string()
    .matches(
      /^\d{4}([\-])(0?[1-9]|1[1-2])\1(3[01]|[12][0-9]|0?[1-9])$/gm,
      "Formato de fecha incorrecto. Formato correcto: yyyy-mm-dd."
    )
    .required("Este campo es obligatorio."),
  email: yup
    .string()
    .email("El email no es valido.")
    .required("Este campo es obligatorio."),
  confirm_email: yup
    .string()
    .email("El email no es valido.")
    .oneOf([yup.ref("email"), null], "El email no coincide")
    .required("Este campo es obligatorio."),
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\u0021-\u002b\u003c-\u0040.])\S{8,}$/gm,
      "La contraseña debe tener al menos 8 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico."
    )
    //.min(8, "La contraseña debe tener al menos 8 caracteres.")
    .required("Este campo es obligatorio."),

  confirm_password: yup
    .string()
    //.oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Este campo es obligatorio."),
});

const logInSchema = yup.object({
  email: yup
    .string()
    .email("El email no es valido.")
    .required("Este campo es obligatorio."),

  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\u0021-\u002b\u003c-\u0040.])\S{8,}$/gm,
      "La contraseña debe tener al menos 8 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico."
    )
    //.min(8, "La contraseña debe tener al menos 8 caracteres.")
    .required("Este campo es obligatorio."),
});

module.exports = { registerSchema, logInSchema };
