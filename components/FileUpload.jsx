'use client';
import { Buffer } from 'buffer';
import { useState } from 'react';

export default function FileUpload({ setFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  async function handleFileUpload(file) {
    try {
      const fileUpload = await file.arrayBuffer();
      const uploadedFile = {
        type: file.type,
        name: file.name,
        file: Buffer.from(fileUpload).toString('base64'),
        imageUrl: file.type.includes('pdf')
          ? '/document-icon.png'
          : URL.createObjectURL(file),
      };
      
      setFileName(file.name);
      setFileType(file.type);
      setFile(uploadedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('pdf') || file.type.includes('image'))) {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <section className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload Your Document</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              {fileType.includes('pdf') ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              )}
            </div>
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="text-sm text-gray-500 mt-1">File uploaded successfully</p>
            <button
              onClick={() => {
                setFileName('');
                setFileType('');
                setFile(null);
              }}
              className="mt-4 text-sm text-red-600 hover:text-red-800"
            >
              Remove file and upload another
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-medium text-gray-700">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, JPG, JPEG, PNG files
                </p>
              </div>
            </label>
          </>
        )}
      </div>
    </section>
  );
}