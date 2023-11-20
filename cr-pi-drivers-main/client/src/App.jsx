import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/landing/Landing';
import Home from './components/home/Home';
import DriverDetail from './components/driverDetail/DriverDetail';
import axios from 'axios';
import './App.css';
import './components/pagination/Pagination.css'; 
import CreateNewDriver from './components/createNewDriver/CreateNewDriver';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/drivers');
      setDrivers(response.data);
      console.log('Lista de conductores actualizada:', response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (loading) {
    // Muestra algún indicador de carga mientras los datos se están cargando
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Home drivers={drivers} />} />
        <Route
          path="/create-driver"
          element={<CreateNewDriver drivers={drivers} setDrivers={setDrivers} />}
        />
        <Route path="/driver/:driverId" element={<DriverDetail />} />
      </Routes>
    </Router>
  );
}

export default App;