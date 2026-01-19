import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DataTable = ({ data, columns, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Safe pagination
  const paginatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return 1;
    return Math.ceil(data.length / itemsPerPage);
  }, [data]);

  // Safe value renderer (prevents object crash)
  const renderValue = (value) => {
    if (value === null || value === undefined) return '—';

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'object') {
      if (value.name) return String(value.name);
      if (value.value) return String(value.value);
      return JSON.stringify(value);
    }

    return String(value);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  // No data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg">No data available</p>
          <p className="text-sm mt-2">Upload a CSV file to view data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {Array.isArray(columns) &&
                columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {Array.isArray(columns) &&
                  columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {renderValue(row[col])}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          {/* Mobile */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 text-sm rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 text-sm rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>

            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-2 border border-gray-300 bg-white text-sm disabled:opacity-50"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>

              <span className="px-4 py-2 border border-gray-300 bg-white text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-2 border border-gray-300 bg-white text-sm disabled:opacity-50"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
