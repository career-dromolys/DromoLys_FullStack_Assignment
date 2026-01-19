import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a CSV file to the backend
 * @param {File} file - The CSV file to upload
 * @returns {Promise} Response with dataset_id and schema
 */
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Fetch table data for a dataset
 * @param {string} datasetId - The dataset ID
 * @returns {Promise} Response with table data
 */
export const fetchTableData = async (datasetId) => {
  const response = await api.get(`/api/dataset/${datasetId}/table`);
  return response.data;
};

/**
 * Fetch statistics for a specific column
 * @param {string} datasetId - The dataset ID
 * @param {string} columnName - The column name
 * @returns {Promise} Response with statistics
 */
export const fetchColumnStats = async (datasetId, columnName) => {
  const response = await api.get(`/api/dataset/${datasetId}/column/${columnName}/stats`);
  return response.data;
};

/**
 * Fetch histogram data for a specific column
 * @param {string} datasetId - The dataset ID
 * @param {string} columnName - The column name
 * @returns {Promise} Response with histogram data
 */
export const fetchHistogramData = async (datasetId, columnName) => {
  const response = await api.get(`/api/dataset/${datasetId}/column/${columnName}/hist`);
  return response.data;
};

export default api;
