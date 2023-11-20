import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Asegúrate de que la ruta sea correcta
import banderasImg from './banderas.png'; // Importa la imagen

const Header = ({ onSearch }) => {
  const handleGoHome = () => {
    // Limpiar la búsqueda y volver a la página principal
    onSearch('');
  };

  return (
    <header>
      <Link to="/main">
        <img className="banderas-button" src={banderasImg} alt="Banderas" onClick={handleGoHome} />
      </Link>
      <h1 className="header-title">DRIVERS APP</h1>
    </header>
  );
};

export default Header;
