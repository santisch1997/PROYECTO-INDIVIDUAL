// Importa las bibliotecas necesarias
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Importa el estilo del componente
import './DriverDetail.css';


const DriverDetail = () => {
  
  const { driverId } = useParams();
  
  const [driver, setDriver] = useState(null);

  
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        
        const apiResponse = await fetch(`http://localhost:3001/drivers/${driverId}`);
        if (apiResponse.ok) {
          
          const apiData = await apiResponse.json();
          
          setDriver(apiData);
        } else {
          
          console.error('Error fetching driver details:', apiResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching driver details:', error.message);
      }
    };


    fetchDriver();
  }, [driverId]);

  
  useEffect(() => {
    
    console.log('Teams:', driver ? driver.teams : 'No driver data yet');
  }, []); 

  if (!driver) {
    return <div>Cargando detalles del conductor...</div>;
  }

  const fullName = `${driver.name?.forename || driver.forename} ${driver.name?.surname || driver.surname}`;

  const teamsArray = Array.isArray(driver.teams) ? driver.teams : [driver.teams];

  const formattedDate = new Date(driver.dob).toLocaleDateString();

  return (
    <div className="driver-detail-container">
      <Link to="/main" className="back-button">
        Volver
      </Link>

      {driver.image && driver.image.url && (
        <img
          src={driver.image.url}
          alt={fullName}
          className="driver-detail-image"
        />
      )}

      {driver.image && typeof driver.image === 'string' && (
        <img
          src={driver.image}
          alt={fullName}
          className="driver-detail-image"
        />
      )}

      <h2>{fullName}</h2>

      {teamsArray.length > 0 && <p><strong style={{ color: '#0056b3' }}>Teams:</strong> {teamsArray.join(', ')}</p>}
  
      <p><strong style={{ color: '#0056b3' }}>Id:</strong> {driver.id}</p>
      <p><strong style={{ color: '#0056b3' }}>Description:</strong> {driver.description || driver.desc}</p>
      <p><strong style={{ color: '#0056b3' }}>Nacionality:</strong> {driver.nationality}</p>
      <p><strong style={{ color: '#0056b3' }}>Date of Birth:</strong> {formattedDate}</p>
  
    </div>
  );
};

export default DriverDetail;
