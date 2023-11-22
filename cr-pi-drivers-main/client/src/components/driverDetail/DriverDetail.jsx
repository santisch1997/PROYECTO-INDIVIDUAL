// Importa las bibliotecas necesarias
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Importa el estilo del componente
import './DriverDetail.css';

// Define el componente principal
const DriverDetail = () => {
  // Obtiene el ID del conductor de los parámetros de la URL
  const { driverId } = useParams();
  // Define un estado para almacenar la información del conductor
  const [driver, setDriver] = useState(null);

  // Efecto para cargar los detalles del conductor
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // Intenta obtener los detalles del conductor desde la API
        const apiResponse = await fetch(`http://localhost:3001/drivers/${driverId}`);
        if (apiResponse.ok) {
          // Si la respuesta es correcta, convierte los datos a formato JSON
          const apiData = await apiResponse.json();
          // Almacena los datos del conductor en el estado
          setDriver(apiData);
        } else {
          // Manejar errores aquí si es necesario
          console.error('Error fetching driver details:', apiResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching driver details:', error.message);
      }
    };

    // Llama a la función para cargar los detalles del conductor
    fetchDriver();
  }, [driverId]);

  // Imprime el objeto del conductor en la consola para depuración
  console.log('Driver:', driver);

  // Si no se ha cargado la información del conductor, muestra un mensaje de carga
  if (!driver) {
    return <div>Cargando detalles del conductor...</div>;
  }

  // Extrae el nombre y apellido del conductor del objeto
  const fullName = `${driver.name?.forename || driver.forename} ${driver.name?.surname || driver.surname}`;

  // Divide la cadena de equipos en un array usando la coma como separador
  const teamsArray = driver.teams ? driver.teams.split(',').map((team) => team.trim()) : [];

  // Formatea la fecha para que sea más legible
  const formattedDate = new Date(driver.dob).toLocaleDateString();

  // Muestra la información del conductor
  return (
    <div className="driver-detail-container">
      {/* Enlace para volver a la página principal */}
      <Link to="/main" className="back-button">
        Volver
      </Link>

      {/* Muestra la imagen del conductor si está disponible */}
      {driver.image && driver.image.url && (
       <img
     src={driver.image.url}
    alt={fullName}
    className="driver-detail-image"
  />
)}

{/* Muestra la imagen del conductor si está disponible (para drivers creados por ti) */}
{driver.image && typeof driver.image === 'string' && (
  <img
    src={driver.image}
    alt={fullName}
    className="driver-detail-image"
  />
)}

      {/* Muestra el nombre completo del conductor */}
      <h2>{fullName}</h2>

      {/* Muestra los equipos en los que ha participado el conductor */}
      {teamsArray.length > 0 && <p><strong style={{ color: '#0056b3' }}>Teams:</strong> {teamsArray.join(', ')}</p>}
  
      {/* Muestra el resto de los detalles del conductor */}
      <p><strong style={{ color: '#0056b3' }}>Id:</strong> {driver.id}</p>
      <p><strong style={{ color: '#0056b3' }}>Description:</strong> {driver.description || driver.desc}</p>
      <p><strong style={{ color: '#0056b3' }}>Nacionality:</strong> {driver.nationality}</p>
      <p><strong style={{ color: '#0056b3' }}>Date of Birth:</strong> {formattedDate}</p>
  
      {/* Puedes seguir agregando más detalles según la estructura de tu objeto driver */}
    </div>
  );
};

// Exporta el componente como predeterminado
export default DriverDetail;
