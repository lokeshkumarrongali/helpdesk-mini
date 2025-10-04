export default function Timeline({ logs }) {
  if (!logs || logs.length === 0) return <p>No timeline events found.</p>;

  return (
    <div>
      <h4>Timeline</h4>
      <ul>
        {logs.map((log) => (
          <li key={log.id || log._id}>
            <strong>{log.action}</strong> by {log.user?.name || 'Unknown'} at{' '}
            {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
