const { Team } = require("../db");
const axios = require("axios");

const getTeamsDB = async () => {
  try {
    const driverApi = await axios.get(`http://localhost:5000/drivers/`);
    const allDriver = driverApi.data;

    if (!Array.isArray(allDriver) || allDriver.length === 0) {
      throw new Error("La respuesta de la API no es válida");
    }

    const teamsFromApi = allDriver
      .filter((driver) => driver.teams) 
      .map((driver) => driver.teams.split(", "))
      .flat(); 

    const uniqueTeams = Array.from(new Set(teamsFromApi)); // Filtra equipos duplicados

    const formattedTeams = uniqueTeams.map((team) => ({ teams: team }));

    if (formattedTeams.length === 0) {
      throw new Error("No hay equipos disponibles");
    }

    return formattedTeams;
  } catch (error) {
    return { error: error.message };
  }
};

const saveTeams = async () => {
  try {
    let dbTeams = await Team.findAll();

    if (dbTeams.length === 0) {
      const allTeams = await getTeamsDB();

      if (!allTeams) throw new Error("No hay equipos");

      
      const uniqueTeams = allTeams.filter(
        (team) => !dbTeams.some((dbTeam) => dbTeam.name === team.teams)
      );

      await Team.bulkCreate(uniqueTeams);
      return uniqueTeams;
    } else {
      return dbTeams;
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  saveTeams,
  getTeamsDB,
};
