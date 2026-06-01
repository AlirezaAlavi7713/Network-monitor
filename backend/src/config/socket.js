// NOUVEAU : socket.io
// WebSocket = connexion persistante entre client et serveur.
// Contrairement à HTTP (le client demande → le serveur répond → connexion fermée),
// ici la connexion reste ouverte et le SERVEUR peut envoyer des données
// quand il veut, sans que le client ait fait une requête.
//
// Ici : toutes les 3 secondes, on récupère les connexions et on les envoie
// à tous les clients connectés via l'événement "connections:update"

const { Server } = require("socket.io");
const connectionsModel = require("../models/connections.model");
const devicesModel = require("../models/devices.model");
const portsModel = require("../models/ports.model");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "http://localhost:5177" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Envoie les données immédiatement à la connexion
    sendConnections(socket);
    sendDevices(socket);
    sendPorts(socket);

    const connInterval = setInterval(() => sendConnections(socket), 3000);
    const devInterval  = setInterval(() => sendDevices(socket), 10000);
    const portInterval = setInterval(() => sendPorts(socket), 5000);

    socket.on("disconnect", () => {
      clearInterval(connInterval);
      clearInterval(devInterval);
      clearInterval(portInterval);
      console.log("Client disconnected:", socket.id);
    });
  });
}

async function sendConnections(socket) {
  try {
    const data = await connectionsModel.getAll();
    socket.emit("connections:update", data);
  } catch (err) {
    socket.emit("connections:error", err.message);
  }
}

async function sendDevices(socket) {
  try {
    const data = await devicesModel.getAll();
    socket.emit("devices:update", data);
  } catch (err) {
    socket.emit("devices:error", err.message);
  }
}

async function sendPorts(socket) {
  try {
    const data = await portsModel.getAll();
    socket.emit("ports:update", data);
  } catch (err) {
    socket.emit("ports:error", err.message);
  }
}

module.exports = { initSocket };
