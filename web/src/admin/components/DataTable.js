import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({ 
  title, 
  columns, 
  data, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  loading,
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  
  const itemsPerPage = 10;
  
  // Filter data based on search term
  const filteredData = data.filter(item => {
    return columns.some(column => {
      const value = item[column.key];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
  
  // Sort data based on sortConfig
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });
  
  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Generate page numbers
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <h2>{title}</h2>
        <div className="data-table-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {onAdd && (
            <button className="add-button" onClick={onAdd}>
              <i className="fas fa-plus"></i> Add New
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key} 
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={column.sortable !== false ? 'sortable' : ''}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="sort-icon">
                      {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="loading-cell">
                  Loading data...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="no-data-cell">
                  No data found
                </td>
              </tr>
            ) : (
              currentItems.map(item => (
                <tr key={item.id}>
                  {columns.map(column => (
                    <td key={`${item.id}-${column.key}`}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  <td className="actions-cell">
                    {onView && (
                      <button 
                        className="action-button view" 
                        onClick={() => onView(item)}
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        className="action-button edit" 
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="action-button delete" 
                        onClick={() => onDelete(item)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-left"></i>
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
          
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable; 