const { Team } = require("../db");
const axios = require("axios");

const getTeamsDB = async () => {
  try {
    const driverApi = await axios.get(`http://localhost:5000/drivers/`);
    const allDriver = driverApi.data;
    const apiTeams = allDriver.map((t) => t.teams);

    let teams = [];

    for (let i = 0; i < apiTeams.length; i++) {
      if (apiTeams[i]) {
        const teamSplit = apiTeams[i].split(", ");
        teams.push(...teamSplit);
      }
    }

    teams.sort();

    let filteredTeams = [];

    for (let i = 0; i < teams.length; i++) {
      const found = filteredTeams.find((e) => e.teams === teams[i]);
      if (!found) filteredTeams.push({ teams: teams[i] });
    }

    if (filteredTeams.length === 0)
      throw new Error("No hay equipos disponibles");

    return filteredTeams;
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

      // Verificar y filtrar equipos duplicados
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
};
