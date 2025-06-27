import { useState } from "react";
export default function SearchBar({ runSearch }){
  const [q, setQ] = useState("");
  return (
    <div className="flex gap-2">
      <input className="flex-grow" value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"/>
      <button onClick={() => runSearch(q)}>Search</button>
    </div>
  );
}
