const axios = require("axios");
const { Driver } = require("../db");

const getIdController = async (id) => {
  if (isNaN(id)) {
    const user = await Driver.findByPk(id);
    return user;
  }
  const response = await axios.get(`http://localhost:5000/drivers/${id}`);
  const user = response.data;
  return user;
};

module.exports = { getIdController };
