const { Router } = require("express");
const {getTeamHandler, postTeamHandler} = require("../handlers/getTeamsHandler")

const teamsRouters = Router();

teamsRouters.get("/", getTeamHandler)


module.exports = teamsRouters;