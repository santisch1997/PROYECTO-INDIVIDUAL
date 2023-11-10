const { saveTeams } = require("../controllers/getTeamsController");

const getTeamsHandler = async (req, res) => {
  try {
    const response = await saveTeams();
    res.status(200).json(response);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

module.exports = {
  getTeamsHandler,
};
