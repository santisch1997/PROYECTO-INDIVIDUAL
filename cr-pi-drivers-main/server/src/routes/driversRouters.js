const { Router } = require("express");
const { postDriversHandler } = require("../handlers/postDriversHandler");
const { getIdHandler } = require("../handlers/getIdHandler");
const { getNameHandler } = require("../handlers/getNameHandler");
const driversRouters = Router();

// Obtener conductores por ID
driversRouters.get("/:id", getIdHandler);

// Crear nuevo conductor
driversRouters.post("/", postDriversHandler);

// Obtener conductores por nombre
driversRouters.get("/name", getNameHandler);

// Obtener todos los conductores
driversRouters.get("/", getNameHandler);


module.exports = driversRouters;
