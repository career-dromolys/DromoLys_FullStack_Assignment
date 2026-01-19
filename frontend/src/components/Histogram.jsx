import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
import { FiBarChart2, FiAlertCircle } from 'react-icons/fi';

const Histogram = ({ data, isLoading, error }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading histogram...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12 text-red-600">
          <FiAlertCircle className="w-8 h-8 mb-2" />
          <span className="text-center">{error}</span>
        </div>
      </div>
    );
  }

  // No data / invalid data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FiBarChart2 className="w-8 h-8 mb-2" />
          <p>No histogram data available</p>
          <p className="text-sm mt-2 text-center">
            Select a numeric column and click "Generate Histogram"
          </p>
        </div>
      </div>
    );
  }

  // Normalize backend formats safely
  const chartData = data
    .map(item => ({
      bin: String(item.bin ?? item.label ?? item.x ?? ''),
      count: Number(item.count ?? item.value ?? item.y ?? 0),
    }))
    .filter(d => d.bin !== '' && !isNaN(d.count));

  // If after normalization data is empty
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FiBarChart2 className="w-8 h-8 mb-2" />
          <p>Histogram data not in valid format</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Histogram</h3>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="bin"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />

            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />

            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histogram;
