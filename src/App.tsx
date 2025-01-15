import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [baseCurrency, setBaseCurrency] = useState("JPY");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rates, setRates] = useState({});

  // Fetch the exchange rates when baseCurrency changes
  useEffect(() => {
    fetchExchangeRates(baseCurrency);
  }, [baseCurrency]);

  // Recalculate conversion when targetCurrency or amount changes
  useEffect(() => {
    if (rates && rates[targetCurrency]) {
      setConvertedAmount(amount * rates[targetCurrency]);
    }
  }, [amount, targetCurrency, rates]);

  const fetchExchangeRates = async (base) => {
    try {
      // Using a free public API endpoint for demonstration:
      // Replace with your chosen API if needed
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${base}`
      );
      setRates(response.data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>CurrencyCompanion</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Base Currency:</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="JPY">JPY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          {/* Add more options as desired */}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Target Currency:</label>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="JPY">JPY</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          {/* Add more options as desired */}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>
          Amount in {baseCurrency}:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <h2>
        {amount} {baseCurrency} = {convertedAmount.toFixed(2)} {targetCurrency}
      </h2>
    </div>
  );
}

export default App;
