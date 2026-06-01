export default function DevicesTable({ devices }) {
  if (devices.length === 0) {
    return <p className="empty-msg">Aucun appareil détecté sur le réseau.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="connections-table devices-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Hostname</th>
            <th>MAC</th>
            <th>Interface</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d, i) => (
            <tr key={i}>
              <td className="cmd-cell">{d.ip}</td>
              <td className="hostname-cell">{d.hostname || "—"}</td>
              <td className="addr-cell">{d.mac}</td>
              <td className="addr-cell">{d.interface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
