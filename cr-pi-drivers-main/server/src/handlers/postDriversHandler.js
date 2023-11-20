const { Driver, Team } = require("../db");
const { postDriversController } = require("../controllers/postDriversController");

const postDriversHandler = async (req, res) => {
  try {
    const { forename, surname, description, image, nationality, dob, teams } = req.body;

    const teamNames = Array.isArray(teams) ? teams : [teams];

    const response = await postDriversController(
      forename,
      surname,
      description,
      image,
      nationality,
      dob,
      teamNames
    );

    return res.status(201).json(response);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

module.exports = { postDriversHandler };
