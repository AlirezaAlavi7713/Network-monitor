const express = require("express");
const cors = require("cors");
const connectionsRouter = require("./routes/connections.routes");
const devicesRouter = require("./routes/devices.routes");
const portsRouter = require("./routes/ports.routes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/connections", connectionsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/ports", portsRouter);

module.exports = app;
