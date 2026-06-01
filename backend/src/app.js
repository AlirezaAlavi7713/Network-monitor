const express = require("express");
const cors = require("cors");
const connectionsRouter = require("./routes/connections.routes");
const devicesRouter = require("./routes/devices.routes");
const portsRouter = require("./routes/ports.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5177",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/connections", connectionsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/ports", portsRouter);

module.exports = app;
