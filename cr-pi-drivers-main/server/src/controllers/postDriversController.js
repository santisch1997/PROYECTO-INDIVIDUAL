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
    if (!forename || !surname || !description || !image || !nationality || !dob || teams.length === 0)
      throw new Error("Data missing");

    const teamsInDB = await Promise.all(
      teams.map(async (teamName) => {
        return Team.findOrCreate({
          where: { teams: teamName },
        });
      })
    );

    const createDriver = await Driver.create({
      forename,
      surname,
      description,
      image,
      nationality,
      dob,
    });

    await createDriver.reload();

    await createDriver.addTeams(teamsInDB.map((team) => team[0]));

    const associatedTeams = await createDriver.getTeams();

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
