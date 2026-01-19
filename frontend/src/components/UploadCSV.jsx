import { useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const UploadCSV = ({ onFileUpload, isUploading }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndUpload = (file) => {
    if (!file || isUploading) return;

    const fileName = file.name.toLowerCase();
    const isValidCSV =
      fileName.endsWith('.csv') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel';

    if (!isValidCSV) {
      alert('Please upload a valid CSV file (.csv)');
      return;
    }

    if (typeof onFileUpload === 'function') {
      onFileUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndUpload(file);
    e.target.value = ''; // allows re-uploading same file
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 
          transition-all duration-200 cursor-pointer
          ${
            isUploading
              ? 'border-blue-400 bg-blue-50'
              : isDragging
              ? 'border-blue-500 bg-blue-100 scale-105'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-blue-600 font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-100 rounded-full">
                <FiUpload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">CSV files only</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
