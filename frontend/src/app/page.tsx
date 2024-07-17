'use client';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Import WebSocket client
import styles from './page.module.css';
import { Crypto, saveCrypto } from './store/cryptoSlice';
import { useAppDispatch, useAppSelector } from './store/hook';
import { RootState } from './store/store';

export default function Home() {
  //Used redux to store live prices data
  const liveCryptos = useAppSelector((state: RootState) => state.crypto.cryptos)
  const dispatch = useAppDispatch();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);

  useEffect(() => {
    async function fetchCryptos() {
      try {
        const response = await axios.get('http://localhost:3000/cryptos');
        setCryptos(response.data.data);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      }
    }

    fetchCryptos();
  }, []);

  useEffect(() => {
    // Establish WebSocket connection when selectedCrypto changes
    if (selectedCrypto) {
      const socket = io('ws://localhost:3000');
      socket.on('welcome', function (data) {
        console.log(data)
      });

      socket.emit('subscribe', selectedCrypto.symbol); // Subscribe to updates for selected cryptocurrency
      socket.on('update', (data: any) => {
        //TODO: selectedCrypto only should be returned from the data, for time constraints now all the crypto data will come
        console.log('Received data:', data);
        dispatch(saveCrypto(data))
      });

      return () => {
        socket.disconnect(); // Clean up WebSocket connection
      };
    }
  }, [selectedCrypto]);

  const handleCryptoChange = (event: React.ChangeEvent<{}>, value: Crypto | null) => {
    setSelectedCrypto(value);
  };


  return (
    <main className={styles.main}>
      <label htmlFor="cryptoPicker">Select a Cryptocurrency to display the data:</label>
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
              src={selectedCrypto.image}
              alt={`${selectedCrypto.name} Logo`}
              className={styles.cryptoLogo}
              width={30}
              height={30}
            />
          </div>
        </div>
      )}
      {liveCryptos?.length > 0 && (
        <p>Currently displaying all the coins and scroll down to see live 20 real time prices in table for each coin</p>
      )}
      <div className={styles.center}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Current Price</th>
              <th>Logo</th>
              <th>Live PriceList</th>
            </tr>
          </thead>
          <tbody>
            {liveCryptos.map((crypto) => (
              <tr key={crypto.symbol}>
                <td>{crypto.symbol}</td>
                <td>{crypto.name}</td>
                <td>${crypto.currentPrice}</td>
                <td>
                  <Image
                    src={crypto.image}
                    alt={`${crypto.name} Logo`}
                    className={styles.cryptoLogo}
                    width={30}
                    height={30}
                  />
                </td>
                <td>
                  {crypto.priceList.map((el: any, ind) => {
                    return (
                      <tr>
                        <td>{ind + 1}</td>
                        <td>{el.price}</td>
                        <td>{moment(el.time).format('MMMM Do YYYY, h:mm:ss a')}</td>
                      </tr>
                    )
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
