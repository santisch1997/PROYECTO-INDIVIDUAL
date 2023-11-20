// src/components/landing/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ferrariLogo from '../../assets/ferrari-png.png';
import driversPng from '../../assets/drivers-png.png';

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
        <img className="ferrari-logo" src={driversPng} alt="Ferrari Logo" />
      </div>
    </div>
  );
};

export default Landing;
