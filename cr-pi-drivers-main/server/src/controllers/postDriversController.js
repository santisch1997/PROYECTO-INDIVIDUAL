const { Driver, Team } = require("../db");
const axios = require("axios");

const postDriversController = async (
  forename,
  surname,
  description,
  image,
  nationality,
  dob,
  teams
) => {
  try {
    if (!forename || !surname || !description || !image || !nationality || !dob)
      throw new Error("Data missing");

    let driverDB = await Driver.findAll();
    const id = 508 + driverDB.length;
    const createDriver = await Driver.create({
      id: id,
      forename,
      surname,
      description,
      image,
      nationality,
      dob,
    });

    // Busca los equipos en la base de datos utilizando los nombres proporcionados
    const teamsInDB = await Team.findAll({
      where: {
        teams: teams,
      },
    });

    // Asocia los equipos al conductor
    await createDriver.setTeams(teamsInDB);

    // Obtiene los equipos asociados al conductor
    const associatedTeams = await createDriver.getTeams();

    return {
      forename: createDriver.forename,
      surname: createDriver.surname,
      description: createDriver.description,
      image: createDriver.image,
      nationality: createDriver.nationality,
      dob: createDriver.dob,
      teams: associatedTeams.map((team) => team.teams),
    };
  } catch (error) {
    return { error: error.message };
  }
};



module.exports = { postDriversController };
