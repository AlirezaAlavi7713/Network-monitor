# Network Monitor

Dashboard de monitoring réseau en temps réel. Visualise les connexions actives, les appareils sur le réseau local, les ports ouverts et évalue l'exposition de ta machine.

---

## Aperçu

![Dashboard](https://raw.githubusercontent.com/AlirezaAlavi7713/Network-monitor/main/preview.png)

---

## Fonctionnalités

- **Connexions en temps réel** — toutes les connexions réseau actives de la machine, rafraîchies toutes les 3 secondes via WebSocket
- **Graphe de trafic** — courbe du nombre de connexions dans le temps (3 minutes d'historique)
- **Score de sécurité** — jauge qui évalue l'exposition réseau avec conseils contextuels
- **Résolution DNS** — identification des IPs distantes (hostname ou organisation : Google, Apple, Microsoft...)
- **Alertes** — notification visuelle à chaque nouvelle connexion externe détectée
- **Vue groupée** — regroupement des connexions par processus avec compteurs
- **Appareils réseau** — liste des appareils connectés sur le réseau local (via ARP)
- **Ports ouverts** — audit des ports en écoute avec distinction réseau / localhost
- **Mode démo** — données simulées réalistes pour déploiement portfolio sans exposer de vraies données

---

## Stack technique

| Côté | Technologie |
|---|---|
| Frontend | React 19, Vite, Recharts, socket.io-client, Axios |
| Backend | Node.js, Express, socket.io, Helmet, express-rate-limit |
| Système | `lsof`, `arp` (commandes macOS/Linux) |
| Temps réel | WebSockets (socket.io) |

---

## Prérequis

- Node.js 18+
- macOS (les commandes `lsof` et `arp` sont utilisées pour lire l'état réseau)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/AlirezaAlavi7713/Network-monitor.git
cd Network-monitor
```

### 2. Installer les dépendances backend

```bash
cd backend
npm install
```

### 3. Installer les dépendances frontend

```bash
cd ../frontend
npm install
```

---

## Lancement

### Mode réel (lit ta machine)

**Terminal 1 — Backend**
```bash
cd backend
npm start
# Démarre sur http://localhost:3004
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# Démarre sur http://localhost:5177
```

Ouvre `http://localhost:5177` dans ton navigateur.

---

### Mode démo (données simulées — pour portfolio)

```bash
cd backend
npm run demo
```

Le backend génère des données réalistes sans accéder à la machine. Idéal pour un déploiement public.

---

## Structure du projet

```
network-monitor/
├── backend/
│   ├── index.js                  # Point d'entrée, création du serveur HTTP
│   ├── .env                      # Variables d'environnement (PORT, DEMO_MODE)
│   ├── .env.demo                 # Config mode démo
│   └── src/
│       ├── app.js                # Express + CORS + routes
│       ├── config/
│       │   └── socket.js         # Initialisation socket.io, émissions périodiques
│       ├── models/
│       │   ├── connections.model.js  # Parsing lsof + résolution DNS
│       │   ├── devices.model.js      # Parsing arp -a
│       │   └── ports.model.js        # Parsing lsof -sTCP:LISTEN
│       ├── controllers/          # Logique métier
│       ├── routes/               # Routes Express
│       └── demo/
│           └── data.js           # Données simulées pour le mode démo
│
└── frontend/
    └── src/
        ├── Api/api.js            # Instance Axios
        ├── services/             # Appels API + création socket
        ├── pages/
        │   └── Dashboard.jsx     # Page principale
        ├── components/
        │   ├── ConnectionsTable.jsx  # Tableau des connexions
        │   ├── GroupedTable.jsx      # Vue groupée par processus
        │   ├── DevicesTable.jsx      # Tableau des appareils réseau
        │   ├── PortsTable.jsx        # Tableau des ports ouverts
        │   ├── TrafficChart.jsx      # Graphe de trafic (Recharts)
        │   └── SecurityScore.jsx     # Jauge SVG + score sécurité
        └── styles/
            └── Dashboard.css
```

---

## Variables d'environnement

Créer un fichier `.env` dans `backend/` :

```env
PORT=3004
DEMO_MODE=false   # true pour activer le mode démo
```

---

## Ce que j'ai appris

- **WebSockets** avec socket.io — communication temps réel serveur → client sans polling HTTP
- **child_process** — exécution de commandes système depuis Node.js et parsing de leur output
- **DNS inversé** — résolution IP → hostname avec le module `dns` natif de Node.js
- **Commandes réseau** — `lsof` pour les connexions et ports, `arp` pour les appareils locaux
- **SVG dynamique** — jauge circulaire avec `stroke-dashoffset` pour animer le score
- **Recharts** — graphes temps réel avec données glissantes
- **Helmet** — sécurisation des headers HTTP (XSS, clickjacking, HTTPS forcé...)
- **Rate limiting** — protection brute force et DDoS (100 requêtes / 15 min / IP)

---

## Auteur

**Alireza Alavi** — [Portfolio](https://github.com/AlirezaAlavi7713)
