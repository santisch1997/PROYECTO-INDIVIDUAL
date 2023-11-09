const { Driver, Team } = require("../db");
const { postDriversController } = require("../controllers/postDriversController");

const postDriversHandler = async (req, res) => {
  try {
    const { forename, surname, description, image, nationality, dob, teams } = req.body;

    // Divide los nombres de los equipos separados por comas en un arreglo
    const teamNames = teams.split(",").map((teamName) => teamName.trim());

    const response = await postDriversController(
      forename,
      surname,
      description,
      image,
      nationality,
      dob,
      teamNames // Pasa el arreglo de nombres de equipos en lugar de la cadena
    );

    return res.status(201).json(response);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

module.exports = { postDriversHandler };
