import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { FaCrown, FaPlus, FaUserFriends } from 'react-icons/fa';
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
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormFields>();

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
    if (!showForm) reset();
  };

  const createWorkspace: SubmitHandler<CreateWorkspaceFormFields> = async (inputData) => {
    setIsCreating(true);
    const loadingToast = toast.loading('Creating workspace...');
    try {
      const response = await api.post('/workspace/create', {
        workspaceName: inputData.workspaceName,
        workspaceDescription: inputData.workspaceDescription,
        ownerID: user?._id,
      });

      if (response.status === 201) {
        const workspace = response.data.workspace;
        setNewWorkspaceId(workspace._id);
        setShowYoutubeAuthButton(true);
        setWorkspaces((prev) => [...prev, workspace]);
        toast.success('Workspace created successfully!', { id: loadingToast });
        setShowForm(false);
        reset();
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace.', { id: loadingToast });
    } finally {
      setIsCreating(false);
    }
  };

  const handleChannelAuth = () => {
    if (newWorkspaceId) {
      window.location.href = `http://localhost:3000/api/workspace/auth/google?workspaceId=${newWorkspaceId}`;
    } else {
      toast.error('Workspace ID missing. Please try again.');
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error('Failed to fetch workspaces: ', error);
        toast.error('Failed to load workspaces.');
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const ownedWorkspaces = workspaces.filter((w) => w.ownerID._id === user?._id);
  const sharedWorkspaces = workspaces.filter((w) => w.ownerID._id !== user?._id);

  if (loading) {
    return (
      <div className="bg-surface-base dark:bg-surface-base flex h-screen items-center justify-center">
        <div className="border-border-default dark:border-border-default border-t-primary-600 h-16 w-16 animate-spin rounded-full border-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-content)',
            border: '1px solid var(--color-muted)',
          },
        }}
      />

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-content text-3xl font-bold sm:text-4xl">Workspaces</h1>
              <p className="text-tertiary mt-2 text-sm">
                Manage and organize your workspace projects
              </p>
            </div>

            <button
              onClick={toggleFormVisibility}
              className="bg-primary hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 sm:px-5"
              title="Create a new workspace"
            >
              <FaPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Workspace</span>
            </button>
          </div>
        </div>

        {/* Create Workspace Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="bg-surface border-muted w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl">
              <div className="bg-surface border-muted border-b px-6 py-4">
                <h2 className="text-content text-xl font-bold">Create New Workspace</h2>
                <p className="text-tertiary mt-1 text-sm">
                  Set up a new workspace for your project
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit(createWorkspace)} className="space-y-5">
                  <div>
                    <label className="text-content mb-1.5 block text-sm font-medium">
                      Workspace Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      {...register('workspaceName', { required: 'Workspace name is required' })}
                      type="text"
                      disabled={isCreating}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.workspaceName
                          ? 'bg-surface text-content border-red-500 focus:ring-red-500/30'
                          : 'border-muted bg-surface text-content focus:border-primary focus:ring-primary/30'
                      } placeholder:text-tertiary disabled:cursor-not-allowed disabled:opacity-60`}
                      placeholder="e.g., Marketing Campaign"
                    />

                    {errors.workspaceName && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.workspaceName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-content mb-1.5 block text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      {...register('workspaceDescription', {
                        required: 'Description is required',
                      })}
                      disabled={isCreating}
                      rows={3}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.workspaceDescription
                          ? 'bg-surface text-content border-red-500 focus:ring-red-500/30'
                          : 'border-muted bg-surface text-content focus:border-primary focus:ring-primary/30'
                      } placeholder:text-tertiary resize-none disabled:cursor-not-allowed disabled:opacity-60`}
                      placeholder="Briefly describe this workspace..."
                    />

                    {errors.workspaceDescription && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.workspaceDescription.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="bg-primary hover:bg-accent flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Creating...
                        </span>
                      ) : (
                        'Create Workspace'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={isCreating}
                      className="border-muted bg-surface text-content hover:bg-secondary flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Auth Banner */}
        {showYoutubeAuthButton && (
          <div className="border-accent bg-secondary mb-8 rounded-lg border p-5">
            <div className="flex items-start gap-4">
              <div className="bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-content text-sm font-semibold">
                  Workspace Created Successfully
                </h3>
                <p className="text-tertiary mt-1 text-sm">
                  Connect your YouTube channel to enable content management features.
                </p>

                <button
                  onClick={handleChannelAuth}
                  className="bg-accent hover:bg-primary mt-3 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95"
                >
                  Connect YouTube Channel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Workspaces */}
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg text-white">
              <FaCrown className="h-4 w-4" />
            </div>

            <h2 className="text-content text-lg font-semibold">My Workspaces</h2>

            <span className="bg-secondary text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              {ownedWorkspaces.length}
            </span>
          </div>

          {ownedWorkspaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ownedWorkspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  onClick={() => navigate(`/workspace/${workspace._id}`)}
                  className="bg-surface hover:border-primary border-muted hover:shadow-primary/20 group cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-sm">
                        <span className="text-lg font-bold">
                          {workspace.workspaceName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {workspace.youtubeChannelID && (
                        <span className="bg-secondary text-primary border-muted rounded-full border px-2.5 py-1 text-xs font-medium">
                          Connected
                        </span>
                      )}
                    </div>

                    <h3 className="text-content group-hover:text-primary mb-1.5 truncate text-base font-semibold transition-colors">
                      {workspace.workspaceName}
                    </h3>

                    <p className="text-tertiary line-clamp-2 text-sm">
                      {workspace.workspaceDescription}
                    </p>
                  </div>

                  <div className="bg-surface border-muted border-t px-5 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tertiary">Owner</span>
                      <span className="text-primary font-medium">You</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface border-muted flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center">
              <div className="bg-secondary text-primary mb-4 rounded-full p-4">
                <FaCrown className="h-8 w-8" />
              </div>

              <h3 className="text-content text-base font-semibold">No workspaces yet</h3>

              <p className="text-tertiary mb-5 mt-1.5 max-w-sm text-sm">
                Create your first workspace to start organizing your projects
              </p>

              <button
                onClick={toggleFormVisibility}
                className="text-primary hover:text-accent cursor-pointer text-sm font-medium hover:underline"
              >
                Create workspace
              </button>
            </div>
          )}
        </section>

        {/* Shared Workspaces */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-secondary text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <FaUserFriends className="h-4 w-4" />
            </div>

            <h2 className="text-content text-lg font-semibold">Shared With Me</h2>

            <span className="bg-secondary text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              {sharedWorkspaces.length}
            </span>
          </div>

          {sharedWorkspaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sharedWorkspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  onClick={() => navigate(`/workspace/${workspace._id}`)}
                  className="bg-surface hover:border-secondary border-muted hover:shadow-secondary/20 group cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="bg-secondary text-primary flex h-12 w-12 items-center justify-center rounded-lg shadow-sm">
                        <span className="text-lg font-bold">
                          {workspace.workspaceName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-content group-hover:text-secondary mb-1.5 truncate text-base font-semibold transition-colors">
                      {workspace.workspaceName}
                    </h3>

                    <p className="text-tertiary line-clamp-2 text-sm">
                      {workspace.workspaceDescription}
                    </p>
                  </div>

                  <div className="bg-surface border-muted border-t px-5 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tertiary">By {workspace.ownerID.name}</span>

                      <span className="text-secondary font-medium">
                        {workspace.members?.find((m) => m.userID?._id === user?._id)?.role ||
                          'Member'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface border-muted flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
              <p className="text-tertiary text-sm">No shared workspaces yet</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
