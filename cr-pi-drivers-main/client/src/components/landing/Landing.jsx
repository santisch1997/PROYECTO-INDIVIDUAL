// src/components/landing/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import landingImage from '../../assets/landing-image.jpg'; // Ruta correcta

import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="left-section">
        <h1>BIENVENIDO</h1>
        <h5>La web más grande de Formula 1 de Latinoamérica!</h5>
        <Link to="/main" className="btn">
          Vamos!
        </Link>
      </div>
      <div className="right-section">
      <img className="landing-image" src="/src/assets/landing-image.jpg" alt="Formula 1" />
      </div>
    </div>
  );
};

export default Landing;
