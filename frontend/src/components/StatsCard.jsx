import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiHash, FiAlertCircle} from 'react-icons/fi';

const StatsCard = ({ stats, isLoading, error }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8 text-red-600">
          <FiAlertCircle className="w-6 h-6 mr-2" />
          <span className="text-center">{error}</span>
        </div>
      </div>
    );
  }

  // No stats yet
  if (!stats || typeof stats !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-8">
          <p>No statistics available</p>
          <p className="text-sm mt-2">
            Select a column and click "Get Statistics"
          </p>
        </div>
      </div>
    );
  }

  // 🔒 Safe formatter (prevents object rendering crash)
  const safeValue = (value) => {
    if (value === null || value === undefined) return 'N/A';

    // Strings like "Not applicable"
    if (typeof value === 'string') return value;

    // Numbers
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value : value.toFixed(2);
    }

    // Objects (this was causing your crash)
    if (typeof value === 'object') {
      if (value.name) return String(value.name);
      if (value.value) return String(value.value);
      return JSON.stringify(value);
    }

    return String(value);
  };

  const statItems = [
    { label: 'Minimum', value: stats.min, icon: FiTrendingDown, color: 'text-blue-600' },
    { label: 'Maximum', value: stats.max, icon: FiTrendingUp, color: 'text-green-600' },
    { label: 'Mean', value: stats.mean, icon: FiBarChart2, color: 'text-purple-600' },
    { label: 'Median', value: stats.median, icon: FiBarChart2, color: 'text-indigo-600' },
    { label: 'Mode', value: stats.mode, icon: FiHash, color: 'text-pink-600' },
    {
      label: 'Missing Count',
      value: stats.missing_count ?? stats.missing ?? stats.missingCount,
      icon: FiAlertCircle,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {safeValue(item.value)}
                  </p>
                </div>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCard;
