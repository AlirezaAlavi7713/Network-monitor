const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectionsRouter = require("./routes/connections.routes");
const devicesRouter = require("./routes/devices.routes");
const portsRouter = require("./routes/ports.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json());

app.use("/api/connections", connectionsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/ports", portsRouter);

module.exports = app;
