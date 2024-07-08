import React, { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setCurFrom] = useState("USD");
  const [toCur, setCurTo] = useState("EUR");
  const [convertedValue, setConvertedValue] = useState("");
  const [isLoding, setIsLoding] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function convert() {
      setIsLoding(true);
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`,
          { signal }
        );
        if (!res.ok) throw new Error("Error fetching exchange rate");

        const data = await res.json();
        if (!data.rates || !data.rates[toCur])
          throw new Error("Currency not found");

        setConvertedValue(data.rates[toCur]);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err.message);
        }
      } finally {
        setIsLoding(false);
      }
    }

    if (fromCur === toCur) return setConvertedValue(amount);
    convert();

    return () => {
      controller.abort();
    };
  }, [amount, fromCur, toCur]);

  return (
    <div>
      <h1>Currency Converter</h1>
      <input
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
        type="text"
        disabled={isLoding}
      />
      <select
        value={fromCur}
        onChange={(e) => setCurFrom(e.target.value)}
        disabled={isLoding}
      >
        <option>USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="GBP">GBP</option>
      </select>
      <select
        value={toCur}
        onChange={(e) => setCurTo(e.target.value)}
        disabled={isLoding}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="GBP">GBP</option>
      </select>

      {!isLoding ? (
        <p>
          Converted Value: {convertedValue} {toCur}
        </p>
      ) : (
        <p>Loding...</p>
      )}
    </div>
  );
}

export default App;
