// Même logique que camping-premium : le controller appelle le model
// et renvoie le JSON au client
const connectionsModel = require("../models/connections.model");

async function getConnections(req, res) {
  try {
    const data = await connectionsModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}

module.exports = { getConnections };
