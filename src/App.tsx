// App.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

// Define the shape of the API response
interface ExchangeRateData {
    base: string;
    date: string;
    rates: {
        [currencyCode: string]: number;
    };
}

const CURRENCY_CODES_BASE = ['JPY', 'USD', 'EUR', 'GBP'];
const CURRENCY_CODES_TARGET = ['JPY', 'USD', 'EUR', 'GBP'];

function App(): JSX.Element {
    const [baseCurrency, setBaseCurrency] = useState<string>('JPY');
    const [targetCurrency, setTargetCurrency] = useState<string>('USD');
    const [amount, setAmount] = useState<string>('1');
    const [convertedAmount, setConvertedAmount] = useState<number>(0);
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [error, setError] = useState<string | null>(null);

    // Fetch exchange rates when baseCurrency changes
    useEffect(() => {
        fetchExchangeRates(baseCurrency);
    }, [baseCurrency]);

    // Recalculate whenever targetCurrency, amount, or rates changes
    useEffect(() => {
        if (targetCurrency in rates) {
            setConvertedAmount(Number(amount) * rates[targetCurrency]);
        }
    }, [amount, targetCurrency, rates]);

    const fetchExchangeRates = async (base: string) => {
        try {
            const response = await axios.get<ExchangeRateData>(`https://api.exchangerate-api.com/v4/latest/${base}`);
            setRates(response.data.rates);
        } catch (error) {
            setError('Error fetching exchange rates');
        }
    };

    return (
        <Box
            sx={{
                width: '80%',
                maxWidth: 400,
                mx: 'auto',
                mt: 4,
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '0.05em',
                    animation: 'fadeIn 0.5s ease-in',
                    '@keyframes fadeIn': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(-20px)',
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    },
                    // Add responsive font size
                    fontSize: {
                        xs: '1.4rem', // Smaller screens
                        sm: '2.125rem', // Default h4 size
                    },
                    paddingBottom: '10px',
                }}
            >
                CurrencyCompanion
            </Typography>

            {/* Base Currency Selector */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="base-currency-label">Base Currency</InputLabel>
                <Select
                    labelId="base-currency-label"
                    value={baseCurrency}
                    label="Base Currency"
                    onChange={(e) => setBaseCurrency(e.target.value as string)}
                >
                    {CURRENCY_CODES_BASE.map((code) => (
                        <MenuItem key={code} value={code}>
                            {code}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Target Currency Selector */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="target-currency-label">Target Currency</InputLabel>
                <Select
                    labelId="target-currency-label"
                    value={targetCurrency}
                    label="Target Currency"
                    onChange={(e) => setTargetCurrency(e.target.value as string)}
                >
                    {CURRENCY_CODES_TARGET.map((code) => (
                        <MenuItem key={code} value={code}>
                            {code}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Amount Input */}
            <TextField
                fullWidth
                label={`Amount in ${baseCurrency}`}
                type="number"
                value={amount}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                        setAmount(value);
                    }
                }}
                variant="outlined"
                sx={{ mb: 2 }}
            />

            {/* Display Converted Amount */}
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <Typography variant="h6">
                    {amount} {baseCurrency} = {convertedAmount.toFixed(2)} {targetCurrency}
                </Typography>
            )}
        </Box>
    );
}

export default App;
