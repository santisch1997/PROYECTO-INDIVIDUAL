const { Driver, Team } = require("../db");

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

    // Busca o crea los equipos en la base de datos
    const teamsInDB = await Promise.all(
      teams.map(async (teamName) => {
        return Team.findOrCreate({
          where: { teams: teamName },
        });
      })
    );

    // Crea el conductor
    const createDriver = await Driver.create({
      forename,
      surname,
      description,
      image,
      nationality,
      dob,
    });

    // Asocia los equipos al conductor
    await createDriver.addTeams(teamsInDB.map((team) => team[0]));

    // Obtiene los equipos asociados al conductor
    const associatedTeams = await createDriver.getTeams();

    // Devuelve la respuesta con el ID del nuevo conductor
    return {
      id: createDriver.id,
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