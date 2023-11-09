const {getNameController} = require("../controllers/getNameController");
const getNameHandler = async (req, res) => {
  const { forename } = req.query;
  try {
    if (forename) {
      const response = await getNameController(forename);
      return res.status(200).json(response);
    }
    const response = await getNameController();
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { getNameHandler };
