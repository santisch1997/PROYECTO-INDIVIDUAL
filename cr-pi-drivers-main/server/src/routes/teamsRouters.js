const { Router } = require("express");
const { getTeamsHandler } = require("../handlers/getTeamsHandler");

const teamsRouters = Router();

teamsRouters.get("/", getTeamsHandler);

module.exports = teamsRouters;