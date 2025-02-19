import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.length) return;

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      setResult(response.data.result);  // Ensure this matches the backend response format
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center relative">
          <div className="absolute left-1/2 -top-16 transform -translate-x-1/2">
            <Brain className="w-24 h-24 text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 pt-12">
            Brain Tumor Analysis
          </h1>
          <p className="text-lg text-gray-400 mb-12">by Team Error 404</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-purple-500 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected scan"
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-purple-400" />
                  <p className="text-gray-300">
                    Click to upload or drag and drop your brain scan
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {selectedImage && !loading && (
              <button
                onClick={handleAnalyze}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Analyze Scan
              </button>
            )}

            {loading && (
              <div className="flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            {result && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Analysis Result</h3>
                {result === "No Brain Tumor" ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    <p>Congratulations! No brain tumor detected.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-6 h-6" />
                      <p>Brain tumor detected</p>
                    </div>
                    <a
                      href="#find-physician"
                      className="inline-block bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Find a Physician
                    </a>
                  </div>
                )}
              </div>
            )}
            {error && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Error</h3>
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="w-6 h-6" />
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
