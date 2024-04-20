import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export const CvesList = () => {
  const [cves, setCves] = useState([]);
  const [filteredCves, setFilteredCves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState(10); // Default value
  const navigate = useNavigate(); // navigation to respective cve

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const lastIndex = currentPage * resultsPerPage;
  const firstIndex = lastIndex - resultsPerPage;
  const records = filteredCves.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredCves.length / resultsPerPage);
  const start = Math.floor((currentPage - 1) / 5) * 5;
  const numbers = Array.from({ length: 5 }, (_, i) => start + i + 1);

  useEffect(() => {
    axios.get('http://localhost:8000/cveslist')
      .then(response => {
        setCves(response.data);
        setFilteredCves(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    const filtered = cves.filter(cve =>
      cve.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      cve.published.includes(yearFilter)
    );
    setFilteredCves(filtered);
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name === 'searchTerm') {
      setSearchTerm(value);
    } else if (name === 'yearFilter') {
      setYearFilter(value);
    }
  };

  const handleResultsPerPageChange = event => {
    setResultsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when changing results per page
  };

  function handleRowClick(id) {
    navigate(`/cveslist/${id}`); // Navigate to the details page for the clicked CVE
  }

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCpage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <>
      <div className='w-100 vh-100 d-flex justify-content-center'>
        <div>
          <h2 className='mb-4'>CVE LIST</h2>
          <div className="row">
            <div className="mb-3 row col">
              <label htmlFor="searchInput" className="form-label text-start"><b>Filter by CVE ID:</b></label>
              <div className="d-flex align-items-center">
                <input type="text" className="form-control me-2" id="searchInput" name="searchTerm" value={searchTerm} onChange={handleInputChange} />
                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
              </div>
            </div>

            <div className="mb-3 row col">
              <label htmlFor="yearFilterInput" className="form-label text-start"><b>Filter by Year:</b></label>
              <div className="d-flex align-items-center">
                <input type="text" className="form-control me-2" id="yearFilterInput" name="yearFilter" value={yearFilter} onChange={handleInputChange} placeholder="YYYY" />
                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
              </div>
            </div>
          </div>

          <table className='table table-bordered '>
            <thead className="table-secondary">
              <tr>
                <th>CVE ID</th>
                <th>IDENTIFIER</th>
                <th>PUBLISHED DATE</th>
                <th>LAST MODIFIED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {records.map(cve => (
                <tr key={cve.id} onClick={() => handleRowClick(cve.id)}>
                  <td>{cve.id}</td>
                  <td>{cve.sourceIdentifier}</td>
                  <td>{cve.published}</td>
                  <td>{cve.lastModified}</td>
                  <td>{cve.vulnStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

      <div className="d-flex justify-content-between align-items-center">
          {/* Pagination */}
          <nav>
            <ul className='pagination'>
              <li className='page-item'>
                <button className='page-link' onClick={prevPage} disabled={currentPage === 1}>Prev</button>
              </li>
              {numbers.map(n => (
                <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
                  <button className='page-link' onClick={() => changeCpage(n)}>{n}</button>
                </li>
              ))}
              <li className='page-item'>
                <button className='page-link' onClick={nextPage} disabled={currentPage === npage}>Next</button>
              </li>
            </ul>
          </nav>

          <div className=" row mb-3">
            <label htmlFor="resultsPerPageSelect" className="form-label text-start me-2"><b>Results Per Page:</b></label>
            <select className="form-select" id="resultsPerPageSelect" value={resultsPerPage} onChange={handleResultsPerPageChange}>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
