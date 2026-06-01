export default function PortsTable({ ports }) {
  if (ports.length === 0) {
    return <p className="empty-msg">Aucun port ouvert détecté.</p>;
  }

  const exposed = ports.filter((p) => p.exposed);
  const local   = ports.filter((p) => !p.exposed);

  return (
    <div>
      {exposed.length > 0 && (
        <div className="ports-warning">
          ⚠ {exposed.length} port{exposed.length > 1 ? "s" : ""} exposé{exposed.length > 1 ? "s" : ""} sur le réseau
        </div>
      )}

      <div className="table-wrapper">
        <table className="connections-table ports-table">
          <thead>
            <tr>
              <th>Port</th>
              <th>Service</th>
              <th>Protocole</th>
              <th>Processus</th>
              <th>PID</th>
              <th>Adresse</th>
              <th>Exposition</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((p, i) => (
              <tr key={i} className={p.exposed ? "row-exposed" : ""}>
                <td className="port-number">{p.port}</td>
                <td className="hostname-cell">{p.service || "—"}</td>
                <td>{p.protocol}</td>
                <td className="cmd-cell">{p.process}</td>
                <td>{p.pid}</td>
                <td className="addr-cell">{p.address}</td>
                <td>
                  <span className={`exposition-badge ${p.exposed ? "badge-exposed" : "badge-local"}`}>
                    {p.exposed ? "Réseau" : "Localhost"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="ports-legend">
        <span className="badge-exposed exposition-badge">Réseau</span> = accessible depuis d'autres machines &nbsp;|&nbsp;
        <span className="badge-local exposition-badge">Localhost</span> = accessible uniquement sur cette machine
      </p>
    </div>
  );
}
