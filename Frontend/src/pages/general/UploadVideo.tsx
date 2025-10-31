import { isAxiosError, type AxiosProgressEvent } from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import api from '../../utils/axiosInstance';

const VideoUpload: React.FC = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // State for UI feedback
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { workspaceId } = useParams();

  //File change in UI
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handles the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check required fields
    if (!file || !title || !description) {
      setError('Please fill out all fields and select a video file.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percentCompleted);
      },
    };

    //Send Req to backend for video upload handling.
    try {
      const response = await api.post(`/workspace/${workspaceId}/video/upload`, formData, config);

      setSuccess(response.data.message || 'Upload successful!');

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Upload error:', error);
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during upload.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      if (error) setUploadProgress(0);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Upload New Video</h2>

      {/*Error/Success Message*/}
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-green-800">
          {success}
        </div>
      )}

      {/* Video Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 'Weekly Project Update'"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            placeholder="A brief summary of the video content..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Video File</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept="video/mp4,video/mov,video/wmv,video/avi,video/*"
            className="mt-1 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-indigo-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? `Uploading (${uploadProgress}%)` : 'Upload and Send for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
