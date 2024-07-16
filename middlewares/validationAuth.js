const validation = (schema) => async (req, res, next) => {
  try {
    const body = req.body;

    console.log(body);

    //TODO: abortEarly: false ESTO ES UNA OPCION DE YUP PARA QUE NO ME CORTE EL FLUJO AL PRIMER ERROR SINO QUE RECOJA TODOS LOS ERRORES QUE HAYA Y DSPS LOS MUESTRE
    const response = await schema.validate(body, { abortEarly: false });

    console.log(response);

    return next();
  } catch (error) {
    //console.log("Error validate", error);
    return res.status(400).json({ error });
  }
};

module.exports = validation;
