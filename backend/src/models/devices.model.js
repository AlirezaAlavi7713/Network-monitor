// arp -a : affiche la table ARP de la machine
// ARP = protocole qui fait le lien entre IP et adresse MAC sur le réseau local
// La table ARP contient tous les appareils avec qui la machine a communiqué récemment
// Format de sortie : "? (192.168.1.10) at aa:bb:cc:dd:ee:ff on en0 ifscope [ethernet]"

const { exec } = require("child_process");
const demo = require("../demo/data");

function getAll() {
  if (process.env.DEMO_MODE === "true") return Promise.resolve(demo.getDevices());

  return new Promise((resolve, reject) => {
    exec("arp -a", (error, stdout, stderr) => {
      if (error && !stdout) {
        reject(stderr || error.message);
        return;
      }
      resolve(parse(stdout));
    });
  });
}

function parse(output) {
  const lines = output.trim().split("\n");

  return lines
    .map((line) => {
      // Regex pour extraire les parties de la ligne arp
      // Exemple : "bbox.lan (192.168.1.1) at aa:bb:cc:dd:ee:ff on en0 ifscope [ethernet]"
      const match = line.match(/^(\S+)\s+\(([^)]+)\)\s+at\s+(\S+)\s+on\s+(\S+)/);
      if (!match) return null;

      const [, hostname, ip, mac, iface] = match;

      // "incomplete" = l'appareil ne répond plus (ARP sans réponse)
      if (mac === "(incomplete)") return null;

      return {
        hostname: hostname === "?" ? "" : hostname,
        ip,
        mac,
        interface: iface,
      };
    })
    .filter(Boolean);
}

module.exports = { getAll };
