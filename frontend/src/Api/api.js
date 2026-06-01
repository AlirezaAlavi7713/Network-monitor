// Même fichier qu'avant : instance Axios pré-configurée
// Tous les services l'importent pour faire leurs requêtes HTTP
import axios from "axios";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3004" : "https://network-monitor-8rc8.onrender.com")
).replace(/\/$/, "");

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export default api;
