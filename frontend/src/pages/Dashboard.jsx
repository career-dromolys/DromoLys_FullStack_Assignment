import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import UploadCSV from '../components/UploadCSV';
import DataTable from '../components/DataTable';
import SidePanel from '../components/SidePanel';
import {uploadCSV,fetchTableData,fetchColumnStats,fetchHistogramData} from '../services/api';

const Dashboard = () => {
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [stats, setStats] = useState(null);
  const [histogramData, setHistogramData] = useState([]);

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isHistogramLoading, setIsHistogramLoading] = useState(false);

  // Error states
  const [uploadError, setUploadError] = useState(null);
  const [tableError, setTableError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [histogramError, setHistogramError] = useState(null);


  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    setStats(null);
    setHistogramData([]);
    setSelectedColumn('');
    setTableData([]);
    setColumns([]);

    try {
      const response = await uploadCSV(file);

      setDatasetId(response?.dataset_id || null);

      // Normalize schema columns so that components always receive plain strings
      const rawColumns =
        response?.schema?.columns ||
        response?.schema ||
        [];

      const normalizedColumns = Array.isArray(rawColumns)
        ? rawColumns
            .map((col) => {
              if (typeof col === 'string') return col;
              if (col && typeof col === 'object') return col.name || col.field || '';
              return '';
            })
            .filter(Boolean)
        : [];

      setColumns(normalizedColumns);

      // Auto fetch table
      if (response?.dataset_id) {
        await fetchTableDataHandler(response.dataset_id);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error.response?.data?.error ||
        error.message ||
        'Failed to upload CSV file.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const fetchTableDataHandler = async (id = datasetId) => {
    if (!id) return;

    setIsLoadingTable(true);
    setTableError(null);

    try {
      const response = await fetchTableData(id);

      if (Array.isArray(response)) {
        setTableData(response);
      } else if (Array.isArray(response?.rows)) {
        setTableData(response.rows);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Table data error:', error);
      setTableError(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch table data.'
      );
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleGetStats = async () => {
    if (!datasetId || !selectedColumn) return;

    setIsStatsLoading(true);
    setStats(null);
    setStatsError(null);

    try {
      const response = await fetchColumnStats(datasetId, selectedColumn);
      setStats(response || null);
    } catch (error) {
      console.error('Stats error:', error);
      setStatsError(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch statistics.'
      );
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleGetHistogram = async () => {
    if (!datasetId || !selectedColumn) return;

    setIsHistogramLoading(true);
    setHistogramData([]);
    setHistogramError(null);

    try {
      const response = await fetchHistogramData(datasetId, selectedColumn);

      if (Array.isArray(response)) {
        setHistogramData(response);
      } else if (Array.isArray(response?.bins)) {
        setHistogramData(response.bins);
      } else {
        setHistogramData([]);
      }
    } catch (error) {
      console.error('Histogram error:', error);
      setHistogramError(
        error.response?.data?.error ||
        error.message ||
        'Failed to generate histogram.'
      );
    } finally {
      setIsHistogramLoading(false);
    }
  };

  const handleColumnChange = (column) => {
    setSelectedColumn(column);
    setStats(null);
    setHistogramData([]);
    setStatsError(null);
    setHistogramError(null);
  };

  const isDisabled = !datasetId || columns.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FiFileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CSV Analyzer</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
            <UploadCSV
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
            {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
            <DataTable
              data={tableData}
              columns={columns}
              isLoading={isLoadingTable}
            />
            {tableError && <p className="text-red-600 mt-2">{tableError}</p>}
          </div>
        </div>

        {/* Right */}
        <SidePanel
          columns={columns}
          selectedColumn={selectedColumn}
          onColumnChange={handleColumnChange}
          onGetStats={handleGetStats}
          onGetHistogram={handleGetHistogram}
          stats={stats}
          histogramData={histogramData}
          isStatsLoading={isStatsLoading}
          isHistogramLoading={isHistogramLoading}
          statsError={statsError}
          histogramError={histogramError}
          isDisabled={isDisabled}
        />
      </main>
    </div>
  );
};

export default Dashboard;
