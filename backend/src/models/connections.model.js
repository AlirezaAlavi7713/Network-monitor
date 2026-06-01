const { exec } = require("child_process");
const dns = require("dns").promises;
const demo = require("../demo/data");

const dnsCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

// Extrait l'IP pure depuis une adresse qui peut être :
// IPv4 : "192.168.1.1:443"       → "192.168.1.1"
// IPv6 : "[fe80::1]:443"         → "fe80::1"
function extractIp(addr) {
  if (!addr) return "";
  if (addr.startsWith("[")) {
    // IPv6 entre crochets : [2001:db8::1]:443
    const end = addr.indexOf("]");
    return end !== -1 ? addr.slice(1, end) : "";
  }
  // IPv4 : prend tout avant le dernier ":"
  const lastColon = addr.lastIndexOf(":");
  return lastColon !== -1 ? addr.slice(0, lastColon) : addr;
}

function isLocalIp(ip) {
  return !ip || ip === "*" || ip.startsWith("127.") ||
    ip.startsWith("::1") || ip.startsWith("fe80") || ip.startsWith("::") ||
    ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.");
}

async function resolveHostname(ip) {
  if (isLocalIp(ip)) return "";

  const cached = dnsCache.get(ip);
  if (cached && cached.expiresAt > Date.now()) return cached.hostname;

  // Essai 1 : DNS inversé (fonctionne pour Google, Cloudflare, etc.)
  try {
    const hostnames = await dns.reverse(ip);
    const hostname = hostnames[0] || "";
    dnsCache.set(ip, { hostname, expiresAt: Date.now() + CACHE_TTL });
    return hostname;
  } catch {
    // Essai 2 : identification par plage IP connue
    const org = identifyOrg(ip);
    dnsCache.set(ip, { hostname: org, expiresAt: Date.now() + CACHE_TTL });
    return org;
  }
}

// Identifie l'organisation derrière une IP par ses plages connues
function identifyOrg(ip) {
  const first = parseInt(ip.split(".")[0], 10);
  const two = ip.split(".").slice(0, 2).join(".");

  if (first === 17) return "Apple";
  if (first === 20 || first === 40 || first === 52 || first === 13) return "Microsoft";
  if (["34.", "35.", "66.249.", "142.250.", "172.217.", "216.58."].some(p => ip.startsWith(p))) return "Google";
  if (["104.16.", "104.17.", "104.18.", "104.19.", "1.1."].some(p => ip.startsWith(p))) return "Cloudflare";
  if (first === 54 || first === 3 || two === "52.94") return "Amazon AWS";
  if (ip.startsWith("157.240.") || ip.startsWith("31.13.")) return "Meta";
  return "";
}

async function getAll() {
  if (process.env.DEMO_MODE === "true") return demo.getConnections();

  return new Promise((resolve, reject) => {
    exec("lsof -i -n -P", async (error, stdout, stderr) => {
      if (error) {
        if (stdout) {
          resolve(await enrichWithDns(parse(stdout)));
        } else {
          reject(stderr || error.message);
        }
        return;
      }
      resolve(await enrichWithDns(parse(stdout)));
    });
  });
}

// Pour chaque connexion, on résout l'IP distante en nom de domaine
// Promise.all() lance toutes les résolutions DNS en parallèle
// au lieu de les faire une par une (ce qui serait très lent)
async function enrichWithDns(connections) {
  return Promise.all(
    connections.map(async (c) => {
      const ip = extractIp(c.remoteAddress);
      const hostname = await resolveHostname(ip);
      return { ...c, hostname };
    })
  );
}

function parse(output) {
  const lines = output.trim().split("\n");
  // La première ligne est l'en-tête : COMMAND PID USER FD TYPE DEVICE ...
  const dataLines = lines.slice(1);

  return dataLines
    .map((line) => {
      // lsof sépare les colonnes par des espaces multiples
      // split(/\s+/) découpe sur 1 ou plusieurs espaces
      const cols = line.trim().split(/\s+/);
      if (cols.length < 9) return null;

      // cols[8] = adresse réseau (ex: 192.168.1.1:53124->142.250.74.46:443)
      // cols[9] = état entre parenthèses (ex: (ESTABLISHED), (LISTEN)) — absent pour UDP
      // On utilise cols[8] pour l'adresse, pas cols[cols.length-1]
      // car pour les connexions avec état, la dernière colonne serait "(ESTABLISHED)"
      const parts = parseAddress(cols[8]);

      return {
        command: cols[0],
        pid: cols[1],
        user: cols[2],
        protocol: cols[7],  // TCP ou UDP
        localAddress: parts.local,
        remoteAddress: parts.remote,
        state: (cols[9] || "").replace(/[()]/g, ""),  // normalise : retire les parenthèses
      };
    })
    .filter(Boolean); // retire les lignes null
}

function parseAddress(name) {
  // Format : "localAddr:port->remoteAddr:port" pour les connexions établies
  // Format : "localAddr:port" pour les ports en écoute (LISTEN)
  if (name.includes("->")) {
    const [local, remote] = name.split("->");
    return { local, remote };
  }
  return { local: name, remote: "" };
}

module.exports = { getAll };
