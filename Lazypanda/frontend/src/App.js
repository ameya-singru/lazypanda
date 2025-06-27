import React, {useState, useEffect} from "react";
import Auth from "./components/Auth";
import SearchBar from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import History from "./components/History";

function App(){
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  const onLogin = t => { setToken(t); localStorage.setItem("token", t); loadHistory(); };
  const onLogout = () => { setToken(""); localStorage.removeItem("token"); };

  const loadHistory = async ()=>{
    const res = await fetch("http://localhost:5000/api/history", { headers: { Authorization: "Bearer "+token } });
    setHistory(await res.json());
  };

  const runSearch = async q => {
    const res = await fetch(`http://localhost:5000/api/search?q=${q}`, { headers: { Authorization: "Bearer "+token }});
    const data = await res.json();
    setProducts(data);
    await fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization: "Bearer "+token },
      body: JSON.stringify({ query: q, products: data })
    });
    loadHistory();
  };

  useEffect(() => { if(token) loadHistory(); }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-4">LazyPanda</h1>
      {!token 
        ? <Auth onLogin={onLogin}/> 
        : <>
            <button onClick={onLogout} className="text-red-600 mb-4">Logout</button>
            <SearchBar runSearch={runSearch}/>
            <ProductGrid products={products}/>
            <h2 className="mt-8 text-xl font-semibold">Your Last Searches</h2>
            <History items={history}/>
          </>
      }
    </div>
  );
}

export default App;
