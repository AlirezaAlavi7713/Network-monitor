const { Router } = require("express");
const { getConnections } = require("../controllers/connections.controller");

const router = Router();

// Route REST classique (en plus du WebSocket)
// Utile pour le premier chargement de la page
router.get("/", getConnections);

module.exports = router;
