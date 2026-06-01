const portsModel = require("../models/ports.model");

async function getPorts(req, res) {
  try {
    const data = await portsModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}

module.exports = { getPorts };
