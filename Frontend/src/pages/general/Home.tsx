import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../Context/AuthProvider';
import type { CreateWorkspaceFormFields } from '../../types/FormType';
import type { IWorkspace } from '../../types/WorkspaceType';
import api from '../../utils/axiosInstance';

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
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div>Home</div>
      <button
        onClick={toggleFormVisibility}
        className="border-1 border-gray-400 p-2 text-xl hover:bg-green-200 hover:text-black"
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
        <button onClick={handleChannelAuth} className="border-1 border-gray-400 p-2 text-xl">
          Authenticate Your Channel
        </button>
      )}
      {workspaces.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              onClick={() => {
                navigate(`/workspace/${workspace._id}`);
              }}
              className="cursor-pointer rounded-lg border-3 border-white bg-white p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900">{workspace.workspaceName}</h2>
              <p className="mt-2 text-gray-600">{workspace.workspaceDescription}</p>
              <p className="mt-2 text-sm text-gray-500">
                Owner: {workspace.ownerID.name} ({workspace.ownerID.email})
              </p>

              {/* Conditionally render channel details or a connect button */}
              {workspace.youtubeChannelID ? (
                <div className="mt-4">
                  <p className="font-semibold text-green-600">Channel Connected</p>
                  <p className="text-base font-semibold text-white">
                    Channel Email:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelEmail}</span>
                  </p>
                  <p className="text-base font-semibold text-white">
                    Channel Name:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelName}</span>
                  </p>
                  <p className="text-base font-semibold text-white">
                    Channel ID:{' '}
                    <span className="text-gray-400">{workspace.youtubeChannelID.channelID}</span>
                  </p>
                </div>
              ) : (
                <button>Connect YouTube Channel</button>
              )}
              <p className="text-base font-semibold text-white">
                Your Role:{' '}
                <span className="text-gray-400 capitalize">
                  {workspace.members?.find((member) => member.userID._id === user?._id)?.role ||
                    'Not a member'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
