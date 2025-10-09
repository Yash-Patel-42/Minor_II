import Navbar from '../../components/Navbar';
import { useAuth } from '../../Context/AuthProvider';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { IWorkspace } from '../../types/WorkspaceType';
import type { CreateWorkspaceFormFields } from '../../types/FormType';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showYoutubeAuthButton, setShowYoutubeAuthButton] = useState(false);
  const [newWorkspaceId, setNewWorkspaceId] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };
  const { register, handleSubmit } = useForm<CreateWorkspaceFormFields>();
  const navigate = useNavigate();
  const createWorkspace: SubmitHandler<CreateWorkspaceFormFields> = async (inputData) => {
    const response = await api.post('/workspace/create', {
      workspaceName: inputData.workspaceName,
      workspaceDescription: inputData.workspaceDescription,
      ownerID: user?._id,
    });
    const workspace = response.data.workspace;
    if (response.status == 201) {
      setNewWorkspaceId(workspace._id);
      setShowYoutubeAuthButton(true);
    }
  };
  const handleChannelAuth = () => {
    window.location.href = `http://localhost:3000/api/workspace/auth/google?workspaceId=${newWorkspaceId}`;
  };
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data.workspaces);
        console.log('HomeHome :', response);
      } catch (error) {
        console.log('Failed to fetch workspaces: ', error);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div>Home</div>
      <button
        onClick={toggleFormVisibility}
        className="text-xl border-1 border-gray-400 p-2 hover:bg-green-200 hover:text-black"
      >
        Create Workspace
      </button>
      {showForm && (
        <form onSubmit={handleSubmit(createWorkspace)}>
          <label>Workspace Name</label>
          <input {...register('workspaceName', { required: true })} type="text" />
          <label>Workspace Description</label>
          <input {...register('workspaceDescription', { required: true })} type="text" />
          <button type="submit">Create Workspace</button>
        </form>
      )}
      {showYoutubeAuthButton && (
        <button onClick={handleChannelAuth} className="text-xl border-1 border-gray-400 p-2">
          Authenticate Your Channel
        </button>
      )}
      {workspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              onClick={() => {
                navigate(`/workspace/${workspace._id}`);
              }}
              className="bg-white rounded-lg shadow-lg p-6 border-3 border-white cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-900">{workspace.workspaceName}</h2>
              <p className="mt-2 text-gray-600">{workspace.workspaceDescription}</p>
              <p className="mt-2 text-sm text-gray-500">
                Owner: {workspace.ownerID.name} ({workspace.ownerID.email})
              </p>

              {/* Conditionally render channel details or a connect button */}
              {workspace.youtubeChannelID ? (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold">Channel Connected</p>
                  <p className="text-base text-white font-semibold">
                    Channel Email:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelEmail}</span>
                  </p>
                  <p className="text-base text-white font-semibold">
                    Channel Name:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelName}</span>
                  </p>
                  <p className="text-base text-white font-semibold">
                    Channel ID:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelID}</span>
                  </p>
                  <p className="text-base text-white font-semibold">
                    Your Role:{' '}
                    <span className="text-gray-400 capitalize">
                      {user?._id === workspace.ownerID._id
                        ? 'Owner'
                        : workspace.members?.find((member) => member.userID._id === user?._id)
                            ?.role || 'Not a member'}
                    </span>
                  </p>
                </div>
              ) : (
                <button>Connect YouTube Channel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
