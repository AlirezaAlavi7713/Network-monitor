const devicesModel = require("../models/devices.model");

async function getDevices(req, res) {
  try {
    const data = await devicesModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}

module.exports = { getDevices };
