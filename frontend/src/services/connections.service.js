// Même logique que reservation.service.js dans camping-premium
// Ce service gère :
//   1. La requête HTTP initiale (pour charger les données au démarrage)
//   2. La connexion WebSocket (pour les mises à jour en temps réel)

import api from "../Api/api";
import { io } from "socket.io-client";

// NOUVEAU : socket.io-client
// io() ouvre une connexion WebSocket vers le serveur.
// On reçoit un objet "socket" qu'on peut utiliser pour :
//   - écouter des événements : socket.on("nom", callback)
//   - envoyer des événements : socket.emit("nom", data)

export function getConnections() {
  return api.get("/connections");
}

export function createSocket() {
  return io("http://localhost:3004");
}
