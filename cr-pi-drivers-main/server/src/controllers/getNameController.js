const axios = require("axios");
const { Driver, Team } = require("../db");

// Define la relación entre Driver y Team si no lo has hecho ya
Driver.belongsToMany(Team, { through: 'DriverTeams' });

const getDriverDB = async () => {
  try {
    const allDriver = await Driver.findAll({
      include: Team,
      attributes: ["id", "forename", "surname", "description", "image", "nationality", "dob"],
    });

    // // Añadir una imagen por defecto si el campo "image" es nulo o vacío
    // allDriver.forEach((driver) => {
    //   if (!driver.image) {
    //     // Reemplaza 'URL_DE_LA_IMAGEN_POR_DEFECTO' con la URL de la imagen por defecto que desees utilizar.
    //     driver.image = 'URL_DE_LA_IMAGEN_POR_DEFECTO';
    //   }
    // });
    

    return allDriver;
  } catch (error) {
    console.error("Error en getDriverDB:", error);
    throw error;
  }
};

const getDriverApi = async () => {
  try {
    const peticion = (
      await axios(`http://localhost:5000/drivers?limit=15`)
    ).data.slice(0, 15);

    const apiInfoMap = peticion.map((driver) => {
      return {
        id: driver.id,
        forename: driver.name.forename,
        surname: driver.name.surname,
        description: driver.description,
        image: driver.image.url,
        nationality: driver.nationality,
        dob: driver.dob,
        teams: driver.teams,
      };
    });
    return apiInfoMap;
  } catch (error) {
    throw error;
  }
};

const getNameController = async (forename) => {
  try {
    const driverDB = await getDriverDB(); // todos los usuarios de la DB
    const driverApi = await getDriverApi(); // todos los usuarios de la API
    const allDrivers = [...driverDB, ...driverApi]; // todos los USUARIOS

    if (forename) {
      const filterDriver = allDrivers.filter((driver) =>
        driver.forename.toLowerCase().includes(forename.toLowerCase())
      );
      if (filterDriver.length) {
        return filterDriver;
      } else {
        return "No se encontraron conductores con el forename especificado.";
      }
    } else {
      return allDrivers;
    }
  } catch (error) {
    throw error;
  }
};

const getDriverDetails = async (idDriver) => {
  try {
    const driverDB = await getDriverDB();
    const driverApi = await getDriverApi();

    // Buscar el driver por ID en ambas fuentes
    const driverDetailsDB = driverDB.find((driver) => driver.id === idDriver);
    const driverDetailsApi = driverApi.find((driver) => driver.id === idDriver);

    if (driverDetailsDB) {
      return driverDetailsDB;
    } else if (driverDetailsApi) {
      return driverDetailsApi;
    } else {
      return "Driver no encontrado.";
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { getNameController, getDriverDB, getDriverApi, getDriverDetails };
