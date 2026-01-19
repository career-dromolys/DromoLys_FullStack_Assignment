import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import StatsCard from './StatsCard';
import Histogram from './Histogram';

const SidePanel = ({ columns,
  selectedColumn,onColumnChange,onGetStats, onGetHistogram, stats, histogramData, isStatsLoading, isHistogramLoading, statsError, histogramError, isDisabled,}) => {
  const safeColumns = Array.isArray(columns) ? columns : [];

  return (
    <div className="w-full lg:w-96 space-y-6">
      {/* Column Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Column Selection
        </h3>

        <select
          value={selectedColumn || ''}
          onChange={(e) => onColumnChange(e.target.value)}
          disabled={isDisabled || safeColumns.length === 0}
          className="
            w-full px-4 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          <option value="">Select a column...</option>

          {safeColumns.map((col, index) => (
            <option key={index} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>

        <div className="space-y-3">
          <button
            onClick={onGetStats}
            disabled={isDisabled || !selectedColumn || isStatsLoading}
            className={`
              w-full flex items-center justify-center px-4 py-3
              rounded-lg font-medium transition-all duration-200
              ${isDisabled || !selectedColumn || isStatsLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
              }
            `}
          >
            <FiTrendingUp className="w-5 h-5 mr-2" />
            {isStatsLoading ? 'Loading...' : 'Get Statistics'}
          </button>

          <button
            onClick={onGetHistogram}
            disabled={isDisabled || !selectedColumn || isHistogramLoading}
            className={`
              w-full flex items-center justify-center px-4 py-3
              rounded-lg font-medium transition-all duration-200
              ${isDisabled || !selectedColumn || isHistogramLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-md hover:shadow-lg'
              }
            `}
          >
            <FiBarChart2 className="w-5 h-5 mr-2" />
            {isHistogramLoading ? 'Loading...' : 'Generate Histogram'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <StatsCard
        stats={stats}
        isLoading={isStatsLoading}
        error={statsError}
      />

      {/* Histogram */}
      <Histogram
        data={histogramData}
        isLoading={isHistogramLoading}
        error={histogramError}
      />
    </div>
  );
};

export default SidePanel;
