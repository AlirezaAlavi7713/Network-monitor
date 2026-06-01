const { exec } = require("child_process");
const demo = require("../demo/data");

// Mapping des ports connus vers leur nom de service
// Utile pour identifier rapidement à quoi sert un port ouvert
const KNOWN_PORTS = {
  21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
  53: "DNS", 80: "HTTP", 110: "POP3", 143: "IMAP",
  443: "HTTPS", 445: "SMB", 3000: "Node dev", 3001: "Node dev",
  3002: "Node dev", 3003: "Node dev", 3004: "Node dev",
  3306: "MySQL", 5173: "Vite", 5174: "Vite", 5175: "Vite",
  5176: "Vite", 5177: "Vite", 5432: "PostgreSQL",
  5900: "VNC", 6379: "Redis", 8080: "HTTP alt", 8443: "HTTPS alt",
  27017: "MongoDB",
};

function getAll() {
  if (process.env.DEMO_MODE === "true") return Promise.resolve(demo.getPorts());

  return new Promise((resolve, reject) => {
    // -sTCP:LISTEN filtre uniquement les ports TCP en écoute
    exec("lsof -i -n -P -sTCP:LISTEN", (error, stdout, stderr) => {
      if (error && !stdout) {
        reject(stderr || error.message);
        return;
      }
      resolve(parse(stdout || ""));
    });
  });
}

function parse(output) {
  const lines = output.trim().split("\n").slice(1); // retire l'en-tête

  const seen = new Set(); // évite les doublons (lsof peut lister le même port plusieurs fois)

  return lines
    .map((line) => {
      const cols = line.trim().split(/\s+/);
      if (cols.length < 9) return null;

      const addr = cols[8]; // ex: "*:3004" ou "127.0.0.1:3000" ou "[::1]:5177"
      const port = extractPort(addr);
      if (!port) return null;

      const key = `${cols[7]}-${port}`; // protocole + port
      if (seen.has(key)) return null;
      seen.add(key);

      // Si l'adresse commence par * ou une IP non-locale, le port est exposé au réseau
      const exposed = addr.startsWith("*") || (!addr.includes("127.0.0.1") && !addr.includes("[::1]") && !addr.includes("localhost"));

      return {
        port,
        protocol: cols[7], // TCP ou UDP
        process: cols[0],
        pid: cols[1],
        address: addr,
        exposed,                          // true = accessible depuis le réseau
        service: KNOWN_PORTS[port] || "", // nom du service connu
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.port - b.port); // trier par numéro de port
}

function extractPort(addr) {
  // "*:3004"          → 3004
  // "127.0.0.1:3000"  → 3000
  // "[::1]:5177"      → 5177
  const match = addr.match(/:(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

module.exports = { getAll };
