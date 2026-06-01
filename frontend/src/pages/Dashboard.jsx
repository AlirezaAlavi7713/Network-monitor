import { useEffect, useState, useRef } from "react";
import { createSocket } from "../services/connections.service";
import ConnectionsTable from "../components/ConnectionsTable";
import GroupedTable from "../components/GroupedTable";
import DevicesTable from "../components/DevicesTable";
import PortsTable from "../components/PortsTable";
import SecurityScore from "../components/SecurityScore";
import TrafficChart from "../components/TrafficChart";
import "../styles/Dashboard.css";

const MAX_HISTORY = 60;

function connectionKey(c) {
  return `${c.pid}-${c.remoteAddress}`;
}

function isExternal(c) {
  const r = c.remoteAddress;
  return r && !r.startsWith("127.") && !r.startsWith("[::1]") && !r.startsWith("*");
}

export default function Dashboard() {
  const [connections, setConnections] = useState([]);
  const [devices, setDevices] = useState([]);
  const [ports, setPorts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState("");
  const [history, setHistory] = useState([]);
  const [newKeys, setNewKeys] = useState(new Set());
  // tab : "connections" | "devices"
  const [tab, setTab] = useState("connections");
  // grouped : true = vue groupée par processus, false = vue détaillée
  const [grouped, setGrouped] = useState(false);
  const prevKeysRef = useRef(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("connections:update", (data) => {
      setConnections(data);

      const currentKeys = new Set(data.map(connectionKey));
      const appeared = new Set(
        data
          .filter((c) => isExternal(c) && !prevKeysRef.current.has(connectionKey(c)))
          .map(connectionKey)
      );
      if (appeared.size > 0) {
        setNewKeys(appeared);
        setTimeout(() => setNewKeys(new Set()), 4000);
      }
      prevKeysRef.current = currentKeys;

      const now = new Date();
      const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setHistory((prev) => {
        const next = [...prev, {
          time,
          total: data.length,
          established: data.filter((c) => c.state === "ESTABLISHED").length,
        }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    });

    socket.on("devices:update", (data) => setDevices(data));
    socket.on("ports:update", (data) => setPorts(data));

    return () => socket.disconnect();
  }, []);

  const filtered = connections.filter((c) => {
    const q = filter.toLowerCase();
    return (
      c.command.toLowerCase().includes(q) ||
      c.localAddress.toLowerCase().includes(q) ||
      c.remoteAddress.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.protocol.toLowerCase().includes(q)
    );
  });

  const newCount = newKeys.size;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Network Monitor</h1>
        <div className={`status-badge ${connected ? "connected" : "disconnected"}`}>
          {connected ? "Connecté" : "Déconnecté"}
        </div>
      </header>

      {newCount > 0 && (
        <div className="alert-banner">
          ⚠ {newCount} nouvelle{newCount > 1 ? "s" : ""} connexion{newCount > 1 ? "s" : ""} externe{newCount > 1 ? "s" : ""} détectée{newCount > 1 ? "s" : ""}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{connections.length}</span>
          <span className="stat-label">Connexions totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {connections.filter((c) => c.state === "ESTABLISHED").length}
          </span>
          <span className="stat-label">ESTABLISHED</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {connections.filter((c) => c.state === "LISTEN").length}
          </span>
          <span className="stat-label">LISTEN</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{devices.length}</span>
          <span className="stat-label">Appareils réseau</span>
        </div>
      </div>

      <div className="charts-row">
        <TrafficChart history={history} />
        <SecurityScore ports={ports} connections={connections} />
      </div>

      {/* Onglets */}
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "connections" ? "active" : ""}`}
          onClick={() => setTab("connections")}
        >
          Connexions
        </button>
        <button
          className={`tab-btn ${tab === "devices" ? "active" : ""}`}
          onClick={() => setTab("devices")}
        >
          Appareils réseau ({devices.length})
        </button>
        <button
          className={`tab-btn ${tab === "ports" ? "active" : ""}`}
          onClick={() => setTab("ports")}
        >
          Ports ouverts ({ports.length})
        </button>
      </div>

      {tab === "connections" && (
        <>
          <div className="dashboard-toolbar">
            <input
              type="text"
              placeholder="Filtrer par processus, IP, état..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
            <button
              className={`view-toggle ${grouped ? "active" : ""}`}
              onClick={() => setGrouped((g) => !g)}
            >
              {grouped ? "Vue détaillée" : "Grouper par processus"}
            </button>
            <span className="results-count">{filtered.length} résultats</span>
          </div>

          {grouped
            ? <GroupedTable connections={filtered} />
            : <ConnectionsTable connections={filtered} newKeys={newKeys} />
          }
        </>
      )}

      {tab === "devices" && <DevicesTable devices={devices} />}
      {tab === "ports"   && <PortsTable ports={ports} />}
    </div>
  );
}
