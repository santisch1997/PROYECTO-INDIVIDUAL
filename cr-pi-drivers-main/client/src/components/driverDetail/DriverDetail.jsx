import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './DriverDetail.css'; // Asegúrate de que la ruta sea correcta

const DriverDetail = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://localhost:3001/drivers/${driverId}`);
        const data = await response.json();
        setDriver(data);
      } catch (error) {
        console.error('Error fetching driver details:', error.message);
      }
    };

    fetchDriver();
  }, [driverId]);

  console.log('Driver:', driver);

  if (!driver) {
    return <div>Cargando detalles del conductor...</div>;
  }

  // Divide la cadena de equipos en un array usando la coma como separador
  const teamsArray = driver.teams ? driver.teams.split(',').map((team) => team.trim()) : [];
 
  return (
    <div className="driver-detail-container">
      <Link to="/main" className="back-button">
        Volver
      </Link>
  
      {driver.image && (
        <img
          src={driver.image.url}
          alt={`${driver.name.forename} ${driver.name.surname}`}
          className="driver-detail-image"
        />
      )}
  
      <h2>{`${driver.name.forename} ${driver.name.surname}`}</h2>
  
      {teamsArray.length > 0 && <p><strong style={{ color: '#0056b3' }}>Teams:</strong> {teamsArray.join(', ')}</p>}
  
      {/* Agrega aquí el resto de los detalles del conductor */}
      <p><strong style={{ color: '#0056b3' }}>Id:</strong> {driver.id}</p>
      <p><strong style={{ color: '#0056b3' }}>Description:</strong> {driver.description}</p>
      <p><strong style={{ color: '#0056b3' }}>Nacionality:</strong> {driver.nationality}</p>
      <p><strong style={{ color: '#0056b3' }}>Date of Birth:</strong> {driver.dob}</p>
  
      {/* Puedes seguir agregando más detalles según la estructura de tu objeto driver */}
    </div>
  );
};

export default DriverDetail;

