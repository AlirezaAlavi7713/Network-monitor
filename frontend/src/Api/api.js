// Même fichier qu'avant : instance Axios pré-configurée
// Tous les services l'importent pour faire leurs requêtes HTTP
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3004/api",
});

export default api;
