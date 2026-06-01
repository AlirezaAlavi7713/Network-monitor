require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/config/socket");

const PORT = process.env.PORT || 3004;

const server = http.createServer(app);

// NOUVEAU : on attache socket.io au serveur HTTP
// socket.io ne fonctionne pas avec app.listen() seul,
// il a besoin de l'objet server pour intercepter les connexions WebSocket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
