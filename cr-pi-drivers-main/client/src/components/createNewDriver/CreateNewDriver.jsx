import React, { useState, useEffect } from 'react';
import './CreateNewDriver.css';
import { Link } from 'react-router-dom';

const CreateNewDriver = ({ drivers, setDrivers }) => {
  const initialFormData = {
    forename: '',
    surname: '',
    description: '',
    image: '',
    nationality: '',
    dob: '',
    teams: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [teamOptions, setTeamOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});

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

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'forename':
      case 'surname':
        if (!/^[a-zA-Z ]+$/.test(value)) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: 'Solo se permiten letras y espacios.' }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
        break;
      case 'description':
        if (value.length > 100) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: 'La descripción no puede tener más de 100 caracteres.' }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
        break;
      default:
        break;
    }
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
    return (
      Object.entries(formData).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return typeof value === 'string' && value.trim() !== '';
      }) &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar una vez más antes de enviar el formulario
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (!isFormValid()) {
      return;
    }

    const formattedDate = new Date(formData.dob).toISOString().split('T')[0];

    const formattedTeams = formData.teams.map((team) => (team && team.label ? team.label : team)).filter(Boolean);

    setFormData((prevData) => ({
      ...prevData,
      dob: formattedDate,
      name: {
        forename: formData.forename,
        surname: formData.surname,
      },
      teams: formattedTeams,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const response = await fetch('http://localhost:3001/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setDrivers((prevDrivers) => [...prevDrivers, result]);
        setSuccessMessage('¡Felicitaciones, creaste tu driver!');
        setErrorMessage('');
        setShowSuccessMessage(true);
        resetForm(); 
      } else {
        setShowSuccessMessage(false);
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error.message);
      setShowSuccessMessage(false);
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    resetForm(); 
  };

  return (
    <div>
      <Link to="/main" className="back-button1 custom-back-button">
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
            onChange={handleChange}
            required
          />
          {errors.forename && <p className="error-message">{errors.forename}</p>}

          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          {errors.surname && <p className="error-message">{errors.surname}</p>}

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <p className="error-message">{errors.description}</p>}

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

          {showSuccessMessage && (
            <div className="centered-message">
              <p>{successMessage}</p>
              <button onClick={closeSuccessMessage} className="close-button">
               &#10006; {/* Unicode para la cruz */}
               </button>
            </div>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateNewDriver;
