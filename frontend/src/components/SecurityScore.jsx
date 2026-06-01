// SVG circulaire pour la jauge
// stroke-dasharray définit la longueur du trait et des espaces
// stroke-dashoffset décale le début du trait — on s'en sert pour "remplir" le cercle
// proportionnellement au score

const HIGH_RISK_PORTS = [21, 23, 25, 445, 3389]; // FTP, Telnet, SMTP, SMB, RDP
const DEV_SERVICES = ["Node dev", "Vite"];

function calcScore(ports, connections) {
  let score = 100;
  const details = [];
  const advice = [];

  const exposedPorts = ports.filter((p) => p.exposed);
  const exposedDevPorts = exposedPorts.filter((p) => DEV_SERVICES.includes(p.service));
  const exposedHighRisk  = exposedPorts.filter((p) => HIGH_RISK_PORTS.includes(p.port));
  const exposedSystem    = exposedPorts.filter((p) => !DEV_SERVICES.includes(p.service) && !HIGH_RISK_PORTS.includes(p.port));

  exposedPorts.forEach((p) => {
    if (HIGH_RISK_PORTS.includes(p.port)) {
      score -= 15;
      details.push({ label: `Port ${p.port} (${p.service || "haut risque"}) exposé`, level: "critical" });
    } else if (DEV_SERVICES.includes(p.service)) {
      score -= 3;
      details.push({ label: `Port dev ${p.port} exposé`, level: "low" });
    } else if (p.service) {
      score -= 5;
      details.push({ label: `Port ${p.port} (${p.service}) exposé`, level: "medium" });
    } else {
      score -= 8;
      details.push({ label: `Port inconnu ${p.port} exposé`, level: "high" });
    }
  });

  const externalConns = connections.filter(
    (c) => c.state === "ESTABLISHED" &&
    c.remoteAddress &&
    !c.remoteAddress.startsWith("127.") &&
    !c.remoteAddress.startsWith("[::1]")
  );

  if (externalConns.length > 30) {
    score -= 5;
    details.push({ label: `${externalConns.length} connexions externes actives`, level: "low" });
  }

  // Conseils contextuels selon ce qu'on détecte
  if (exposedDevPorts.length > 0) {
    const portList = exposedDevPorts.map((p) => p.port).join(", ");
    advice.push({
      level: "low",
      text: `Tes backends Node (${portList}) sont accessibles depuis ton réseau local. En dev c'est normal, mais ne les déploie jamais ainsi en production. Pour les limiter à localhost, utilise app.listen(PORT, '127.0.0.1').`,
    });
  }

  if (exposedHighRisk.length > 0) {
    const portList = exposedHighRisk.map((p) => `${p.port} (${p.service})`).join(", ");
    advice.push({
      level: "critical",
      text: `Ports dangereux ouverts : ${portList}. Ces protocoles sont des vecteurs d'attaque connus — désactive-les si tu ne les utilises pas.`,
    });
  }

  if (exposedSystem.length > 0) {
    const procs = [...new Set(exposedSystem.map((p) => p.process))].join(", ");
    advice.push({
      level: "medium",
      text: `Des services système (${procs}) exposent des ports sur le réseau. C'est généralement normal sur macOS, mais vérifie que tu reconnais ces processus.`,
    });
  }

  if (details.length === 0) {
    advice.push({ level: "ok", text: "Aucun port à risque détecté. Ta machine n'expose que des services internes." });
  }

  return { score: Math.max(0, score), details, advice };
}

function scoreColor(score) {
  if (score >= 80) return "#4ade80"; // vert
  if (score >= 50) return "#fbbf24"; // jaune
  return "#f87171";                  // rouge
}

function scoreLabel(score) {
  if (score >= 80) return "Sécurisé";
  if (score >= 50) return "Modéré";
  return "Risqué";
}

export default function SecurityScore({ ports, connections }) {
  const { score, details, advice } = calcScore(ports, connections);
  const color = scoreColor(score);

  // Géométrie du cercle SVG
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // longueur totale du cercle
  // On remplit le cercle proportionnellement au score (0-100)
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="security-score-card">
      <h2 className="chart-title">Score de sécurité</h2>

      <div className="score-content">
        {/* Jauge circulaire */}
        <div className="gauge-wrapper">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Cercle de fond gris */}
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#2d3748" strokeWidth="10" />
            {/* Cercle coloré qui représente le score */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              // rotate(-90) pour partir du haut du cercle au lieu de la droite
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease" }}
            />
            {/* Score au centre */}
            <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="monospace">
              {score}
            </text>
            <text x="70" y="85" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">
              {scoreLabel(score)}
            </text>
          </svg>
        </div>

        {/* Liste des problèmes détectés */}
        <ul className="score-details">
          {details.length === 0 && (
            <li className="detail-ok">Aucun problème détecté</li>
          )}
          {details.map((d, i) => (
            <li key={i} className={`detail-item detail-${d.level}`}>
              {d.level === "critical" ? "🔴" : d.level === "high" ? "🟠" : d.level === "medium" ? "🟡" : "🔵"} {d.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Conseils contextuels */}
      <div className="score-advice">
        {advice.map((a, i) => (
          <p key={i} className={`advice-item advice-${a.level}`}>
            {a.level === "critical" ? "🔴" : a.level === "medium" ? "🟡" : a.level === "low" ? "🔵" : "✅"} {a.text}
          </p>
        ))}
      </div>
    </div>
  );
}
