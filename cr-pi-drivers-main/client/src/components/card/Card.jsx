// Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ driver }) => {
  return (
    <Link to={`/driver/${driver.id}`} className="driver-card-link" key={driver.id}>
      <div className="driver-card">
        <img src={driver.image} alt={`${driver.forename} ${driver.surname}`} className="driver-image" />
        <h2>{`${driver.forename} ${driver.surname}`}</h2>

        {driver.teams && (
          <p>
            <strong>Equipos:</strong> {driver.teams}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Card;
