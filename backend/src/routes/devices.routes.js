const { Router } = require("express");
const { getDevices } = require("../controllers/devices.controller");

const router = Router();

router.get("/", getDevices);

module.exports = router;
