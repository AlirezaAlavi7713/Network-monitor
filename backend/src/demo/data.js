// Générateur de données de démonstration
// Simule une activité réseau réaliste sur un Mac de développeur
// Les données changent légèrement à chaque appel pour simuler du vrai trafic

const USERS = ["devuser"];

// Pool de connexions permanentes (toujours présentes)
const STATIC_CONNECTIONS = [
  { command: "node",      pid: "3201", protocol: "TCP", localAddress: "*:3001",           remoteAddress: "",                         state: "LISTEN",      hostname: "" },
  { command: "node",      pid: "3201", protocol: "TCP", localAddress: "[::1]:3001",        remoteAddress: "",                         state: "LISTEN",      hostname: "" },
  { command: "node",      pid: "3205", protocol: "TCP", localAddress: "[::1]:5177",        remoteAddress: "",                         state: "LISTEN",      hostname: "" },
  { command: "mysqld",    pid: "976",  protocol: "TCP", localAddress: "127.0.0.1:3306",    remoteAddress: "",                         state: "LISTEN",      hostname: "" },
  { command: "Code",      pid: "1421", protocol: "TCP", localAddress: "127.0.0.1:52800",   remoteAddress: "127.0.0.1:3001",           state: "ESTABLISHED", hostname: "" },
  { command: "node",      pid: "3201", protocol: "TCP", localAddress: "127.0.0.1:3001",    remoteAddress: "127.0.0.1:52800",          state: "ESTABLISHED", hostname: "" },
  { command: "rapportd",  pid: "619",  protocol: "TCP", localAddress: "*:49152",           remoteAddress: "",                         state: "LISTEN",      hostname: "" },
  { command: "Spotify",   pid: "2201", protocol: "TCP", localAddress: "192.168.1.50:52901", remoteAddress: "35.186.224.25:443",       state: "ESTABLISHED", hostname: "spotify.com" },
  { command: "Spotify",   pid: "2201", protocol: "TCP", localAddress: "192.168.1.50:52902", remoteAddress: "35.186.224.26:443",       state: "ESTABLISHED", hostname: "spotify.com" },
  { command: "com.apple", pid: "812",  protocol: "TCP", localAddress: "192.168.1.50:53100", remoteAddress: "17.57.144.120:443",      state: "ESTABLISHED", hostname: "Apple" },
  { command: "com.apple", pid: "812",  protocol: "TCP", localAddress: "192.168.1.50:53101", remoteAddress: "17.57.144.121:5223",     state: "ESTABLISHED", hostname: "Apple" },
  { command: "Slack",     pid: "4412", protocol: "TCP", localAddress: "192.168.1.50:54200", remoteAddress: "52.205.138.12:443",      state: "ESTABLISHED", hostname: "Amazon AWS" },
  { command: "Slack",     pid: "4412", protocol: "TCP", localAddress: "192.168.1.50:54201", remoteAddress: "52.205.138.13:443",      state: "ESTABLISHED", hostname: "Amazon AWS" },
];

// Pool de connexions dynamiques (changent à chaque refresh)
const DYNAMIC_POOL = [
  { command: "Google",    pid: "9595", protocol: "TCP", localAddress: "192.168.1.50:55010", remoteAddress: "142.250.74.46:443",      state: "ESTABLISHED", hostname: "par21s03-in-x0e.1e100.net" },
  { command: "Google",    pid: "9595", protocol: "TCP", localAddress: "192.168.1.50:55011", remoteAddress: "142.250.74.78:443",      state: "ESTABLISHED", hostname: "wb-in-f188.1e100.net" },
  { command: "Google",    pid: "9595", protocol: "TCP", localAddress: "192.168.1.50:55012", remoteAddress: "142.250.74.100:443",     state: "ESTABLISHED", hostname: "tzpara-an-in-x0e.1e100.net" },
  { command: "Google",    pid: "9595", protocol: "UDP", localAddress: "192.168.1.50:55013", remoteAddress: "142.250.74.46:443",      state: "",            hostname: "par21s03-in-x0e.1e100.net" },
  { command: "Safari",    pid: "1102", protocol: "TCP", localAddress: "192.168.1.50:56001", remoteAddress: "17.253.144.10:443",      state: "ESTABLISHED", hostname: "Apple" },
  { command: "Safari",    pid: "1102", protocol: "TCP", localAddress: "192.168.1.50:56002", remoteAddress: "140.82.112.22:443",      state: "ESTABLISHED", hostname: "lb-140-82-112-22-iad.github.com" },
  { command: "curl",      pid: "8801", protocol: "TCP", localAddress: "192.168.1.50:57001", remoteAddress: "93.184.216.34:80",       state: "ESTABLISHED", hostname: "example.com" },
  { command: "node",      pid: "3201", protocol: "TCP", localAddress: "192.168.1.50:58100", remoteAddress: "8.8.8.8:53",            state: "ESTABLISHED", hostname: "dns.google" },
  { command: "claude",    pid: "6186", protocol: "TCP", localAddress: "192.168.1.50:59200", remoteAddress: "160.79.104.10:443",      state: "ESTABLISHED", hostname: "Microsoft" },
  { command: "claude",    pid: "6186", protocol: "TCP", localAddress: "192.168.1.50:59201", remoteAddress: "160.79.104.11:443",      state: "ESTABLISHED", hostname: "Microsoft" },
];

const DEMO_DEVICES = [
  { hostname: "MacBook-Pro.local",   ip: "192.168.1.50",  mac: "a4:83:e7:2c:1f:88", interface: "en0" },
  { hostname: "iPhone-Alireza",      ip: "192.168.1.51",  mac: "f2:1d:3c:88:ab:12", interface: "en0" },
  { hostname: "bbox.lan",            ip: "192.168.1.1",   mac: "00:24:d4:7e:00:01", interface: "en0" },
  { hostname: "iPad.local",          ip: "192.168.1.52",  mac: "b6:4a:11:cc:09:3d", interface: "en0" },
  { hostname: "Samsung-TV.local",    ip: "192.168.1.60",  mac: "c8:14:79:12:34:56", interface: "en0" },
  { hostname: "",                    ip: "192.168.1.100", mac: "dc:a6:32:ab:cd:ef", interface: "en0" },
];

const DEMO_PORTS = [
  { port: 3001,  protocol: "TCP", process: "node",     pid: "3201", address: "*:3001",          exposed: true,  service: "Node dev" },
  { port: 3306,  protocol: "TCP", process: "mysqld",   pid: "976",  address: "127.0.0.1:3306",  exposed: false, service: "MySQL" },
  { port: 5177,  protocol: "TCP", process: "node",     pid: "3205", address: "[::1]:5177",       exposed: false, service: "Vite" },
  { port: 49152, protocol: "TCP", process: "rapportd", pid: "619",  address: "*:49152",          exposed: true,  service: "" },
  { port: 5000,  protocol: "TCP", process: "ControlCe",pid: "628",  address: "*:5000",           exposed: true,  service: "" },
  { port: 7000,  protocol: "TCP", process: "ControlCe",pid: "628",  address: "*:7000",           exposed: true,  service: "" },
  { port: 19812, protocol: "TCP", process: "Code",     pid: "1421", address: "127.0.0.1:19812",  exposed: false, service: "" },
];

// Sélectionne aléatoirement N éléments d'un tableau
function sample(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function getConnections() {
  // On garde toutes les connexions statiques + un sous-ensemble aléatoire des dynamiques
  const dynamicCount = 4 + Math.floor(Math.random() * 5); // entre 4 et 8
  const dynamic = sample(DYNAMIC_POOL, dynamicCount);
  return [...STATIC_CONNECTIONS, ...dynamic].map((c) => ({ ...c, user: USERS[0] }));
}

function getDevices() {
  return DEMO_DEVICES;
}

function getPorts() {
  return DEMO_PORTS;
}

module.exports = { getConnections, getDevices, getPorts };
