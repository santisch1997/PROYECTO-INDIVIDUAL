import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import SearchBar from '../searchbar/SearchBar';
import Card from '../card/Card';
import Pagination from '../pagination/Pagination';
import './Home.css';
import noResultsImage from './no-results-icon.png';
import { Link } from 'react-router-dom';

const Home = ({ drivers }) => {
const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [originalResults, setOriginalResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedAlphabeticOrder, setSelectedAlphabeticOrder] = useState('');
  const [selectedDobOrder, setSelectedDobOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 9;
  const [noResults, setNoResults] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState('');

  useEffect(() => {
    setOriginalResults(drivers);
    setSearchResults(drivers);

    // Recuperar filtros desde el historial del navegador o contexto global
    const storedFilters = JSON.parse(localStorage.getItem('driverFilters')) || {};
    setSelectedTeam(storedFilters.selectedTeam || '');
    setSelectedAlphabeticOrder(storedFilters.selectedAlphabeticOrder || '');
    setSelectedDobOrder(storedFilters.selectedDobOrder || '');
    setSelectedOrigin(storedFilters.selectedOrigin || '');
  }, [drivers]);

  const handleSearch = async (term) => {
    try {
      if (term) {
        const response = await fetch(`http://localhost:3001/drivers?forename=${term}`);
        const data = await response.json();

        console.log('Data from server:', data);

        if (Array.isArray(data)) {
          setSearchResults([...data]);
          setNoResults(data.length === 0);
        } else {
          console.error('Error searching drivers:', data);
          setNoResults(true);
        }

        setSearchTerm(term);
      } else {
        setSearchResults(originalResults);
        setSearchTerm('');
        setNoResults(false);
      }
    } catch (error) {
      console.error('Error searching drivers:', error.message);
      setNoResults(true);
    }
  };

  const handleFilterTeam = (team) => {
    const filteredResults = originalResults.filter((driver) => {
      return driver.teams && driver.teams.includes(team);
    });

    setSearchResults(filteredResults);
    setSelectedTeam(team);

    // Almacenar filtros en el historial del navegador o contexto global
    const filtersToStore = { ...localStorage.getItem('driverFilters'), selectedTeam: team };
    localStorage.setItem('driverFilters', JSON.stringify(filtersToStore));
  };

  const handleAlphabeticOrder = (order) => {
    let sortedResults;

    if (order === 'asc') {
      sortedResults = [...searchResults].sort((a, b) => a.forename.localeCompare(b.forename, 'en', { sensitivity: 'base' }));
    } else if (order === 'desc') {
      sortedResults = [...searchResults].sort((a, b) => b.forename.localeCompare(a.forename, 'en', { sensitivity: 'base' }));
    } else {
      sortedResults = originalResults;
    }

    console.log("Drivers ordenados:", sortedResults);

    setSearchResults(sortedResults);
    setSelectedAlphabeticOrder(order);

    // Almacenar filtros en el historial del navegador o contexto global
    const filtersToStore = { ...localStorage.getItem('driverFilters'), selectedAlphabeticOrder: order };
    localStorage.setItem('driverFilters', JSON.stringify(filtersToStore));
  };

  const handleDobOrder = (order) => {
    let sortedResults;
  
    if (selectedTeam) {
      // Si se ha seleccionado un equipo, aplicar el filtro de equipo antes de ordenar por fecha de nacimiento
      const teamResults = searchResults.filter((driver) => driver.teams && driver.teams.includes(selectedTeam));
  
      if (order === 'asc') {
        sortedResults = [...teamResults].sort((a, b) => a.dob.localeCompare(b.dob));
      } else if (order === 'desc') {
        sortedResults = [...teamResults].sort((a, b) => b.dob.localeCompare(a.dob));
      } else {
        sortedResults = teamResults;
      }
    } else {
      // Si no se ha seleccionado un equipo, ordenar todos los resultados por fecha de nacimiento
      if (order === 'asc') {
        sortedResults = [...searchResults].sort((a, b) => a.dob.localeCompare(b.dob));
      } else if (order === 'desc') {
        sortedResults = [...searchResults].sort((a, b) => b.dob.localeCompare(a.dob));
      } else {
        sortedResults = searchResults;
      }
    }
  
    setSearchResults(sortedResults);
    
    // Actualizar el estado de selectedDobOrder
    setSelectedDobOrder(order);
  
    // Almacenar filtros en el historial del navegador o contexto global
    const filtersToStore = { ...localStorage.getItem('driverFilters'), selectedDobOrder: order };
    localStorage.setItem('driverFilters', JSON.stringify(filtersToStore));
  };

  const handleOriginFilter = async (origin) => {
    try {
      let filteredResults;

      if (origin === 'Api') {
        const response = await fetch('http://localhost:3001/drivers');
        const data = await response.json();
        // Filtrar conductores con ID hasta 508
        filteredResults = data.filter(driver => driver.id <= 508);
      } else if (origin === 'Data Base') {
        const response = await fetch('http://localhost:3001/drivers');
        const data = await response.json();
        // Filtrar conductores con ID mayor a 508
        filteredResults = data.filter(driver => driver.id > 508);
      } else {
        filteredResults = originalResults;
      }

      setSearchResults(filteredResults);
      setSelectedOrigin(origin);

      // Almacenar filtros en el historial del navegador o contexto global
      const filtersToStore = { ...localStorage.getItem('driverFilters'), selectedOrigin: origin };
      localStorage.setItem('driverFilters', JSON.stringify(filtersToStore));
    } catch (error) {
      console.error('Error filtering drivers by origin:', error.message);
    }
  };

  const handleResetFilters = () => {
    // Limpiar filtros y restaurar resultados originales
    setSearchResults(originalResults);
    setSelectedTeam('');
    setSelectedAlphabeticOrder('');
    setSelectedDobOrder('');
    setSelectedOrigin('');

    // Limpiar filtros almacenados en el historial del navegador o contexto global
    localStorage.removeItem('driverFilters');
  };

  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = (searchResults || []).slice(indexOfFirstDriver, indexOfLastDriver);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />
      <SearchBar onSearch={handleSearch} searchTerm={searchTerm}/>

      <div className="create-driver-button-container">
        <Link to="/create-driver" className="create-driver-button">
          Create Driver
        </Link>
      </div>

      <div className="dropdown-container">
        <div className="dropdown">
          <label>Team Filter:</label>
          <select value={selectedTeam} onChange={(e) => handleFilterTeam(e.target.value)}>
            <option value="">Todos</option>
            {Array.from(new Set(originalResults.flatMap((driver) => (driver.teams ? (Array.isArray(driver.teams) ? driver.teams : driver.teams.split(',')) : []))))
              .filter(Boolean)
              .map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
          </select>
        </div>

        <div className="dropdown">
          <label>Alphabetic Filter:</label>
          <select value={selectedAlphabeticOrder} onChange={(e) => handleAlphabeticOrder(e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        <div className="dropdown">
          <label>DOB Filter:</label>
          <select value={selectedDobOrder} onChange={(e) => handleDobOrder(e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div className="dropdown">
          <label>Origin Filter:</label>
          <select value={selectedOrigin} onChange={(e) => handleOriginFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="Api">Api</option>
            <option value="Data Base">Data Base</option>
          </select>
        </div>
      </div>

      <div className="reset-filters-button-container">
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>

      <div className="driver-cards-container">
        {noResults ? (
          <div className="no-results-message">
            <p>Lo siento, no encontramos ningún driver con ese nombre.</p>
            <div className="no-results-content">
              <img src={noResultsImage} alt="No Results" />
              <button onClick={() => handleSearch('')}>Volver a Home</button>
            </div>
          </div>
        ) : (
          currentDrivers.map((driver) => <Card key={driver.id} driver={driver} />)
        )}
      </div>

      <Pagination totalDrivers={(searchResults || []).length} driversPerPage={driversPerPage} paginate={paginate} />
    </div>
  );
};

export default Home;
