const { Router } = require("express");
const { getPorts } = require("../controllers/ports.controller");

const router = Router();
router.get("/", getPorts);

module.exports = router;
