const { Router } = require("express");
const driversRouters = require ("./driversRouters")
const teamsRouters = require ("./teamsRouters")

const router = Router();

router.use("/drivers", driversRouters);
router.use("/teams", teamsRouters);



module.exports = router;
