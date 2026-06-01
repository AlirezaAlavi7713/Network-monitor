// Vue groupée : une ligne par processus avec le total de ses connexions

export default function GroupedTable({ connections }) {
  // reduce() construit un dictionnaire { processName: { ...stats } }
  // à partir du tableau de connexions
  const groups = connections.reduce((acc, c) => {
    const key = c.command;
    if (!acc[key]) {
      acc[key] = { command: key, total: 0, established: 0, listen: 0, hostnames: new Set() };
    }
    acc[key].total++;
    if (c.state === "ESTABLISHED") acc[key].established++;
    if (c.state === "LISTEN") acc[key].listen++;
    if (c.hostname) acc[key].hostnames.add(c.hostname);
    return acc;
  }, {});

  // Trier par nombre de connexions décroissant
  const rows = Object.values(groups).sort((a, b) => b.total - a.total);

  if (rows.length === 0) {
    return <p className="empty-msg">Aucune connexion trouvée.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="connections-table grouped-table">
        <thead>
          <tr>
            <th>Processus</th>
            <th>Total</th>
            <th>ESTABLISHED</th>
            <th>LISTEN</th>
            <th>Destinations</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="cmd-cell">{r.command}</td>
              <td>
                <span className="count-badge">{r.total}</span>
              </td>
              <td>
                {r.established > 0 && (
                  <span className="state-badge state-established">{r.established}</span>
                )}
              </td>
              <td>
                {r.listen > 0 && (
                  <span className="state-badge state-listen">{r.listen}</span>
                )}
              </td>
              <td className="hostname-cell">
                {r.hostnames.size > 0
                  ? [...r.hostnames].slice(0, 3).join(", ") + (r.hostnames.size > 3 ? ` +${r.hostnames.size - 3}` : "")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
