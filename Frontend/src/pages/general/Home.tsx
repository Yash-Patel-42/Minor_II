import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Navbar from '../../components/ui/Navbar';
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
        console.log('HomeHome :', response.data.workspaces);
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
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }
  return (
    <section className="bg-neutral-900">
      <Navbar />
      <div className="min-h-screen bg-neutral-900 p-4 pt-8 text-gray-300 md:p-10">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="font-display text-5xl font-bold text-white">Your Workspaces</h1>
          <button
            onClick={toggleFormVisibility}
            className="relative rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/40"
          >
            Create Workspace
          </button>
        </div>
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-xl bg-neutral-800 p-6 shadow-2xl ring-1 ring-white/10">
            <form onSubmit={handleSubmit(createWorkspace)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Workspace Name
                </label>
                <input
                  {...register('workspaceName', { required: true })}
                  type="text"
                  className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 'Main Channel'"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Workspace Description
                </label>
                <input
                  {...register('workspaceDescription', { required: true })}
                  type="text"
                  className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 'All content for the main..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-2 font-bold text-white"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                  }}
                  className="rounded-lg bg-red-600 px-5 py-2 font-bold text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {showYoutubeAuthButton && (
          <button
            onClick={handleChannelAuth}
            className="mb-8 w-full rounded-lg border-2 border-dashed border-yellow-500/50 p-4 text-xl font-semibold text-yellow-400 transition-all duration-300 hover:border-solid hover:border-yellow-500 hover:bg-yellow-500/10"
          >
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
                className="cursor-pointer overflow-hidden rounded-xl bg-neutral-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:shadow-indigo-500/20"
              >
                <div className="bg-neutral-800/50 p-6">
                  <h2 className="font-display truncate text-3xl font-bold text-white">
                    {workspace.workspaceName}
                  </h2>
                  <p className="mt-2 text-gray-400">{workspace.workspaceDescription}</p>
                </div>
                <div className="border-t border-white/10 bg-neutral-900/50 px-6 py-4">
                  {workspace.youtubeChannelID ? (
                    <div>
                      <p className="mb-2 font-semibold text-green-500">Channel Connected</p>
                      <p className="text-sm font-medium text-gray-300">
                        {workspace.youtubeChannelID.channelName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {workspace.youtubeChannelID.channelEmail}
                      </p>
                    </div>
                  ) : (
                    <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
                      Connect YouTube Channel
                    </button>
                  )}
                </div>
                <div className="flex justify-between border-t border-white/10 bg-neutral-800/50 px-6 py-3">
                  <div className="text-xs">
                    <span className="text-gray-500">Owner: </span>
                    <span className="font-medium text-gray-300">{workspace.ownerID.name}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">Your Role: </span>
                    <span className="font-medium capitalize text-indigo-400">
                      {workspace.members?.find((member) => member.userID?._id === user?._id)
                        ?.role || 'Not a member'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
