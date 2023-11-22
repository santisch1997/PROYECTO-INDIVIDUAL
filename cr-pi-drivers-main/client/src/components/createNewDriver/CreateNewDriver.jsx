import React, { useState, useEffect } from 'react';
import './CreateNewDriver.css';
import { Link } from 'react-router-dom';

const CreateNewDriver = ({ drivers, setDrivers }) => {
  const [formData, setFormData] = useState({
    forename: '',
    surname: '',
    description: '',
    image: '',
    nationality: '',
    dob: '',
    teams: [],
  });

  const [teamOptions, setTeamOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTeamOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/teams');
        const data = await response.json();
        setTeamOptions(data.map((team) => ({ value: team.teams, label: team.teams })));
      } catch (error) {
        console.error('Error fetching team options:', error.message);
      }
    };

    fetchTeamOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      teams: selectedValues,
    }));
  };

  const isFormValid = () => {
    return Object.entries(formData).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return typeof value === 'string' && value.trim() !== '';
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegurarse de que la fecha esté en el formato correcto (YYYY-MM-DD)
    const formattedDate = new Date(formData.dob).toISOString().split('T')[0];

    // Alinear estructura con DriverDetail
    const formattedTeams = formData.teams.map((team) => team.label);

    setFormData((prevData) => ({
      ...prevData,
      dob: formattedDate,
      name: {
        forename: formData.forename,
        surname: formData.surname,
      },
      teams: formattedTeams,
    }));

    try {
      const response = await fetch('http://localhost:3001/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (response.ok) {
        setDrivers((prevDrivers) => [...prevDrivers, result]);
        setSuccessMessage('¡Felicitaciones, creaste tu driver!');
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error.message);
      setSuccessMessage('');
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Link to="/main" className="back-button">
        Volver
      </Link>
      <div className="create-driver-container">
        <h2>Create new Driver!</h2>
        <form onSubmit={handleSubmit}>
          <label>Forename:</label>
          <input
            type="text"
            name="forename"
            value={formData.forename}
            onChange={(e) => setFormData({ ...formData, forename: e.target.value })}
            required
          />

          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <label>Image:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />

          <label>Nationality:</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            required
          />

          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />

          <label>Teams:</label>
          <select name="teams" value={formData.teams} onChange={handleSelect} multiple>
            {teamOptions.map((team) => (
              <option value={team.value} key={team.value}>
                {team.label}
              </option>
            ))}
          </select>

          <button type="submit" disabled={!isFormValid()}>
            Create
          </button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateNewDriver;
