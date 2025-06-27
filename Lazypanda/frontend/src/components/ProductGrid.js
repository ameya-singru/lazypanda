export default function ProductGrid({ products }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {products.map((p,i) => (
        <div key={i} className="bg-white p-4 rounded shadow hover:scale-105 transform transition">
          <h3 className="font-semibold">{p.name}</h3>
          <p>{p.price}</p>
          <a href={p.url} target="_blank">View</a>
        </div>
      ))}
    </div>
  );
}
