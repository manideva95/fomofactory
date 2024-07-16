'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import io from 'socket.io-client'; // Import WebSocket client
import styles from './page.module.css';

// Define interface for cryptocurrency data
interface Crypto {
  symbol: string;
  name: string;
  currentPrice: number;
  image: string;
  priceList: any
}

export default function Home() {
  // State hooks for managing cryptocurrency data and selection
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(null)
  useEffect(() => {
    async function fetchCryptos() {
      try {
        const response = await axios.get('http://localhost:3000/cryptos');
        setCryptos(response.data.data); // Assuming response.data.data is an array of Crypto objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
        setError('Failed to fetch cryptocurrency data.');
        setLoading(false);
      }
    }

    fetchCryptos();
  }, []);

  useEffect(() => {
    // Establish WebSocket connection when selectedCrypto changes
    if (selectedCrypto) {
      const socket = io('ws://localhost:3000'); // Replace with your backend URL
      socket.on('welcome', function (data) {
        console.log(data)
      });

      socket.emit('subscribe', selectedCrypto.symbol); // Subscribe to updates for selected cryptocurrency
      socket.on('update', (update: any) => {
        // Handle incoming update from server
        console.log('Received update:', update);
        // setUpdate(update)
        // // Update cryptos array with updated cryptocurrency data
        // setCryptos((prevCryptos) =>
        //   prevCryptos.map((crypto) =>
        //     crypto.symbol === selectedCrypto.symbol ? { ...crypto, priceList: update.priceList } : crypto
        //   )
        // );
      });

      return () => {
        socket.disconnect(); // Clean up WebSocket connection
      };
    }
  }, [selectedCrypto]);

  // Handler for when a cryptocurrency is selected from Autocomplete
  const handleCryptoChange = (event: React.ChangeEvent<{}>, value: Crypto | null) => {
    setSelectedCrypto(value); // Update selectedCrypto state
  };

  // Render loading indicator if data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if there was an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the main content once data is loaded and no errors
  return (
    <main className={styles.main}>
      {/* Select a cryptocurrency using Autocomplete */}
      <label htmlFor="cryptoPicker">Select a Cryptocurrency:</label>
      <Autocomplete
        disablePortal
        id="cryptoPicker"
        value={selectedCrypto}
        onChange={handleCryptoChange}
        options={cryptos}
        getOptionLabel={(crypto) => crypto.name}
        renderInput={(params) => <TextField {...params} className={styles.cryptoPicker} />}
        style={{ width: '300px' }}
      />

      {/* Display details of the selected cryptocurrency */}
      {selectedCrypto && (
        <div className={styles.cryptoDetails}>
          <h2>{selectedCrypto.name}</h2>
          <div>
            <p>Symbol: {selectedCrypto.symbol}</p>
            <p>Current Price: ${selectedCrypto?.currentPrice}</p>
            <Image
              src={selectedCrypto.image} // Ensure selectedCrypto.image is a valid URL
              alt={`${selectedCrypto.name} Logo`}
              className={styles.cryptoLogo}
              width={30}
              height={30}
            />
          </div>
        </div>
      )}

      {/* Display a table of all cryptocurrencies */}
      <div className={styles.center}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Current Price</th>
              <th>Logo</th>
              <th>PriceList</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.filter((crypto) => crypto.symbol == selectedCrypto?.symbol).map((crypto) => (
              <tr key={crypto.symbol}>
                <td>{crypto.symbol}</td>
                <td>{crypto.name}</td>
                <td>${crypto.currentPrice}</td>
                <td>
                  <Image
                    src={crypto.image} // Ensure crypto.image is a valid URL
                    alt={`${crypto.name} Logo`}
                    className={styles.cryptoLogo}
                    width={30}
                    height={30}
                  />
                </td>
                {/* <td>
                  {crypto.priceList.map((el: any) => {
                    return (
                      <tr>
                        <td>{JSON.stringify(el.price)}</td>
                        <td>{JSON.stringify(el.time)}</td>
                      </tr>
                    )
                  })}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
