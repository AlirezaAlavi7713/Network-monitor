function connectionKey(c) {
  return `${c.pid}-${c.remoteAddress}`;
}

export default function ConnectionsTable({ connections, newKeys = new Set() }) {
  if (connections.length === 0) {
    return <p className="empty-msg">Aucune connexion trouvée.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="connections-table">
        <thead>
          <tr>
            <th>Processus</th>
            <th>PID</th>
            <th>Protocole</th>
            <th>Adresse locale</th>
            <th>Adresse distante</th>
            <th>Hostname</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((c, i) => {
            const isNew = newKeys.has(connectionKey(c));
            return (
            <tr key={i} className={`row-state-${c.state.replace(/[()]/g, "").toLowerCase()}${isNew ? " row-new" : ""}`}>
              <td className="cmd-cell">{c.command}</td>
              <td>{c.pid}</td>
              <td>{c.protocol}</td>
              <td className="addr-cell">{c.localAddress}</td>
              <td className="addr-cell">{c.remoteAddress || "—"}</td>
              <td className="hostname-cell">{c.hostname || "—"}</td>
              <td>
                <span className={`state-badge state-${c.state.replace(/[()]/g, "").toLowerCase()}`}>
                  {c.state || "—"}
                </span>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
