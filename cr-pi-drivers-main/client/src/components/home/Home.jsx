import React, { useState } from 'react';
import Header from '../header/Header';
import SearchBar from '../searchbar/SearchBar';
import Card from '../card/Card';
import Pagination from '../pagination/Pagination';
import './Home.css';
import noResultsImage from './no-results-icon.png';
import { Link } from 'react-router-dom';

const Home = ({ drivers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(drivers);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedAlphabeticOrder, setSelectedAlphabeticOrder] = useState('');
  const [selectedDobOrder, setSelectedDobOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 9;
  const [noResults, setNoResults] = useState(false);

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
        setSearchResults(drivers);
        setSearchTerm('');
        setNoResults(false);
      }
    } catch (error) {
      console.error('Error searching drivers:', error.message);
      setNoResults(true);
    }
  };

  const handleFilterTeam = (team) => {
    const filteredResults = drivers.filter((driver) => {
      return driver.teams && driver.teams.includes(team);
    });

    setSearchResults(filteredResults);
    setSelectedTeam(team);
  };

  const handleAlphabeticOrder = (order) => {
    let sortedResults;

    if (order === 'asc') {
      sortedResults = [...searchResults].sort((a, b) => a.forename.localeCompare(b.forename));
    } else if (order === 'desc') {
      sortedResults = [...searchResults].sort((a, b) => b.forename.localeCompare(a.forename));
    } else {
      sortedResults = drivers;
    }

    setSearchResults(sortedResults);
    setSelectedAlphabeticOrder(order);
  };

  const handleDobOrder = (order) => {
    let sortedResults;

    if (order === 'asc') {
      sortedResults = [...searchResults].sort((a, b) => a.dob.localeCompare(b.dob));
    } else if (order === 'desc') {
      sortedResults = [...searchResults].sort((a, b) => b.dob.localeCompare(a.dob));
    } else {
      sortedResults = drivers;
    }

    setSearchResults(sortedResults);
    setSelectedDobOrder(order);
  };

  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = searchResults.slice(indexOfFirstDriver, indexOfLastDriver).reverse();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />
      <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />

      <Link to="/create-driver" className="create-driver-button">
        Create Driver
      </Link>

      <div className="dropdown-container">
        <div className="dropdown">
          <label>Team Filter:</label>
          <select value={selectedTeam} onChange={(e) => handleFilterTeam(e.target.value)}>
            <option value="">Todos</option>
            {Array.from(new Set(drivers.flatMap((driver) => (driver.teams ? (Array.isArray(driver.teams) ? driver.teams : driver.teams.split(',')) : []))))

            
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
    currentDrivers.map((driver) => (
      <Card key={driver.id} driver={driver} />
    ))
  )}
</div>

      <Pagination totalDrivers={searchResults.length} driversPerPage={driversPerPage} paginate={paginate} />
    </div>
  );
};

export default Home;
