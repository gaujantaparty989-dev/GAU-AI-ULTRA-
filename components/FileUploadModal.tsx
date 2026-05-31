import React, { useState } from 'react';
import { PlusIcon } from './icons/Icons';

interface FileUploadModalProps {
  onClose: () => void;
  onFileUpload: (content: string) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose, onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
      onClose();
    };
    reader.onerror = () => {
        alert("Failed to read the file.");
        onClose();
    }
    reader.readAsText(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Upload File</h2>
        <p className="text-gray-600 mb-6">Upload a text file to add context to your prompt.</p>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".txt,.js,.html,.css,.json,.md,.csv"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <PlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="font-semibold text-gray-700">Drag & drop a file here or <span className="text-orange-600">browse</span></p>
            <p className="text-xs text-gray-500 mt-1">Supports: TXT, JS, HTML, CSS, JSON, MD, CSV</p>
          </label>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};
