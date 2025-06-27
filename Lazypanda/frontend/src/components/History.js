export default function History({ items }){
  if(!items.length) return <p>No history yet.</p>;
  return (
    <ul className="space-y-2">
      {items.map(h => (
        <li key={h._id} className="bg-gray-100 p-2 rounded">
          <strong>{h.query}</strong> @ {new Date(h.ts).toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
