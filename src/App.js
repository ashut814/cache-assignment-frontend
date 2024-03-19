import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [response, setResponse] = useState({ value: null, expiration: null });

  const handleGet = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/cache/get?key=${key}`);
      const { value, expiration } = res.data;
      if (expiration && Date.now() > expiration * 1000) {
        setResponse({ value: null, expiration: null });
      } else {
        setResponse({ value, expiration });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSet = async () => {
    try {
      await axios.post(`http://localhost:8080/cache/set`, {
        key: parseInt(key),
        value: parseInt(value),
      });
      setResponse({
        value: `Set ${value} for key ${key}`,
        expiration: Date.now() + 5000,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>LRU Cache with Expiration</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleSet}>Set</button>
        <button onClick={handleGet}>Get</button>
      </div>
      <div className="response">
        <p>Response: {response.value}</p>
        {response.expiration && (
          <p>
            Expiration: {new Date(response.expiration * 1000).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
