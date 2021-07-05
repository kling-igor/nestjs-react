import React, { useEffect, useState } from 'react';
import styles from './App.module.css';

const API_VERSION = process.env.REACT_APP_API_VERSION;
const API_HOST = process.env.REACT_APP_API_HOST;

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch(`${API_HOST}/${API_VERSION}/`)
      .then((response) => response.text())
      .then((data) => {
        setData(data);
      });
  }, []);

  return <div className={styles.App}>{`Response: ${data}`}</div>;
}

export default App;
