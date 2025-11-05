import { isAxiosError, type AxiosProgressEvent } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiImage, FiTag, FiUploadCloud } from 'react-icons/fi';
import { useParams } from 'react-router';
import api from '../../utils/axiosInstance';

const VIDEO_CATEGORIES = [
  { id: 1, name: 'Film & Animation' },
  { id: 2, name: 'Autos & Vehicles' },
  { id: 10, name: 'Music' },
  { id: 15, name: 'Pets & Animals' },
  { id: 17, name: 'Sports' },
  { id: 18, name: 'Short Movies' },
  { id: 19, name: 'Travel & Events' },
  { id: 20, name: 'Gaming' },
  { id: 21, name: 'Videoblogging' },
  { id: 22, name: 'People & Blogs' },
  { id: 23, name: 'Comedy' },
  { id: 24, name: 'Entertainment' },
  { id: 25, name: 'News & Politics' },
  { id: 26, name: 'Howto & Style' },
  { id: 27, name: 'Education' },
  { id: 28, name: 'Science & Technology' },
  { id: 29, name: 'Nonprofits & Activism' },
  { id: 30, name: 'Movies' },
  { id: 31, name: 'Anime/Animation' },
  { id: 32, name: 'Action/Adventure' },
  { id: 33, name: 'Classics' },
  { id: 34, name: 'Comedy' },
  { id: 35, name: 'Documentary' },
  { id: 36, name: 'Drama' },
  { id: 37, name: 'Family' },
  { id: 38, name: 'Foreign' },
  { id: 39, name: 'Horror' },
  { id: 40, name: 'Sci-Fi/Fantasy' },
  { id: 41, name: 'Thriller' },
  { id: 42, name: 'Shorts' },
  { id: 43, name: 'Shows' },
  { id: 44, name: 'Trailers' },
];

const VideoUpload: React.FC = () => {
  //Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('1');
  const [currentTag, setCurrentTag] = useState('');

  //UI & Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { workspaceId } = useParams();

  //Cleanup for Video Preview
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Add thumbnail cleanup
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  //File Change Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setUploadProgress(0);

      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  //Cancel/Change File
  const handleCancel = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);
    setTitle('');
    setDescription('');
    setPrivacy('private');
    setThumbnail(null);
    setThumbnailPreview(null);
    setTags([]);
    setCategory('1');
    setCurrentTag('');

    // Clear the file input
    const fileInput = document.getElementById('video-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    const thumbnailInput = document.getElementById('thumbnail-upload-input') as HTMLInputElement;
    if (thumbnailInput) thumbnailInput.value = '';
  };

  //Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !title || !description || !privacy) {
      // NEW: Added privacy check
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
    formData.append('privacy', privacy);
    formData.append('video', file);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      },
    };

    try {
      const response = await api.post(`/workspace/${workspaceId}/video/upload`, formData, config);
      setSuccess(response.data.message || 'Upload successful!');

      // Reset form after a short delay
      setTimeout(() => {
        handleCancel();
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during upload.');
      } else {
        setError('An unexpected error occurred.');
      }
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-4 pt-8 text-gray-300 md:p-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-neutral-800 shadow-xl ring-1 ring-white/10">
        <div className="border-b border-white/10 p-6">
          <h2 className="font-display text-4xl font-bold text-white">Upload Video</h2>
          <p className="mt-1 text-gray-400">Send a new video for review in this workspace.</p>
        </div>
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!file && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <label
                  htmlFor="video-upload-input"
                  className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed border-neutral-700 p-16 text-center transition-all duration-300 hover:border-indigo-500 hover:bg-neutral-700/30"
                >
                  <FiUploadCloud className="mb-4 h-16 w-16 text-indigo-400" />
                  <span className="block text-2xl font-semibold text-white">
                    Drag & drop video files to upload
                  </span>
                  <p className="mt-2 text-gray-400">
                    Your videos will be private until they are approved.
                  </p>
                  <input
                    id="video-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept="video/mp4,video/mov,video/wmv,video/avi,video/*"
                    className="sr-only"
                  />
                </label>
              </motion.div>
            )}
            {file && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                  <div className="space-y-8 lg:col-span-8">
                    {error && (
                      <div className="flex items-center gap-3 rounded-md bg-red-900/50 p-4 text-red-300 ring-1 ring-red-500/30">
                        <FiAlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
                      </div>
                    )}
                    {success && (
                      <div className="flex items-center gap-3 rounded-md bg-green-900/50 p-4 text-green-300 ring-1 ring-green-500/30">
                        <FiCheckCircle className="h-5 w-5 flex-shrink-0" /> {success}
                      </div>
                    )}
                    <div>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading || !!success}
                        className="font-display w-full border-0 border-b-2 border-neutral-700 bg-transparent p-2 text-4xl font-bold text-white placeholder-neutral-600 transition-all focus:border-indigo-500 focus:ring-0"
                        placeholder="Give your video a title..."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="mb-2 block text-lg font-medium text-gray-400"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading || !!success}
                        className="w-full rounded-md border-0 bg-neutral-700 p-4 text-white placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tell viewers about your video..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-lg font-medium text-gray-400">
                        Thumbnail
                      </label>
                      <label
                        htmlFor="thumbnail-upload"
                        className="group relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-neutral-700 p-4 transition-all hover:border-indigo-500"
                      >
                        <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                          {thumbnailPreview ? (
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FiImage className="h-8 w-8 text-neutral-600" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-neutral-400">
                          <span className="font-semibold text-white group-hover:text-indigo-400">
                            Upload a custom thumbnail
                          </span>
                          <p>Drag and drop, or click to select. (Optional)</p>
                          <p className="text-xs text-neutral-500">16:9 aspect ratio recommended</p>
                        </div>
                        <input
                          id="thumbnail-upload"
                          type="file"
                          onChange={handleThumbnailChange}
                          accept="image/*"
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                    <div className="space-y-6 rounded-xl bg-neutral-700/50 p-6 ring-1 ring-white/10">
                      <h3 className="font-display text-2xl font-semibold text-white">
                        Advanced Options
                      </h3>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-400">Tags</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add tags (press Enter)"
                            className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white"
                          />
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1 rounded-full bg-indigo-500/30 px-3 py-1 text-sm text-indigo-200"
                              >
                                <FiTag className="h-3 w-3" />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 text-indigo-300 hover:text-white"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="category"
                          className="mb-1 block text-sm font-medium text-gray-400"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white"
                        >
                          {VIDEO_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="h-max space-y-6 lg:sticky lg:top-10 lg:col-span-4">
                    <div className="space-y-4 rounded-xl bg-neutral-700/50 p-4 ring-1 ring-white/10">
                      <h3 className="font-display text-2xl font-semibold text-white">Preview</h3>
                      <div className="aspect-video w-full">
                        {previewUrl && (
                          <video src={previewUrl} controls className="w-full rounded-lg bg-black" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="truncate font-medium text-gray-300">
                          <span className="text-gray-500">File:</span> {file.name}
                        </p>
                        <p className="text-gray-400">
                          <span className="text-gray-500">Size:</span>{' '}
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {loading && (
                      <div className="space-y-2 rounded-xl bg-neutral-700/50 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-medium text-indigo-300">
                          Uploading: {file.name}
                        </p>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-700">
                          <motion.div
                            className="h-2.5 rounded-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-right font-mono text-lg font-bold text-white">
                          {uploadProgress}%
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl bg-neutral-700/50 p-4 ring-1 ring-white/10">
                      <label
                        htmlFor="privacy"
                        className="mb-2 block text-lg font-medium text-white"
                      >
                        Privacy
                      </label>
                      <select
                        id="privacy"
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                        required
                        disabled={loading || !!success}
                        className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                      </select>
                    </div>
                    {!success && (
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/40 transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                        whileHover={{ scale: loading ? 1 : 1.03 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Uploading...' : 'Upload and Send for Review'}
                      </motion.button>
                    )}
                    {!loading && !success && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full rounded-md py-2 text-sm font-medium text-gray-400 transition-all hover:bg-red-900/50 hover:text-red-300"
                      >
                        Cancel and select new file
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
