import { useState } from "react";

export default function Auth({ onLogin }){
  const [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [mode, setMode] = useState("login");
  const handle = async () => {
    const url = mode === "login" ? "/api/login" : "/api/register";
    const res = await fetch("http://localhost:5000" + url, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email, password: pw })
    });
    const j = await res.json();
    if (res.ok) onLogin(j.token);
    else alert(j.error);
  };
  return (
    <div className="space-y-2">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password"/>
      <button onClick={handle}>{mode === "login" ? "Login" : "Register"}</button>
      <p>
        <a href="#" onClick={() => setMode(m => m === "login" ? "register" : "login")}>
          {mode === "login" ? "Switch to register" : "Switch to login"}
        </a>
      </p>
    </div>
  );
}
