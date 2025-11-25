import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { FaClock, FaCrown, FaEllipsisV, FaPlus, FaUsers, FaVideo, FaYoutube } from 'react-icons/fa';
import { HiSparkles, HiViewGrid, HiViewList } from 'react-icons/hi';
import { MdOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router';
import Navbar from '../../components/ui/Navbar';
import { useAuth } from '../../Context/AuthProvider';
import type { CreateWorkspaceFormFields } from '../../types/FormType';
import type { IWorkspace } from '../../types/WorkspaceType';
import api from '../../utils/axiosInstance';

type ViewMode = 'grid' | 'list';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showYoutubeAuthButton, setShowYoutubeAuthButton] = useState(false);
  const [newWorkspaceId, setNewWorkspaceId] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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
  const recentWorkspaces = [...workspaces].slice(0, 3);

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="relative">
          <div
            className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: 'var(--color-border)', borderTopColor: 'transparent' }}
          ></div>
          <div
            className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: 'transparent',
              borderTopColor: 'var(--color-primary)',
              animationDuration: '1s',
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-content)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />

      <Navbar />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Top Stats Bar */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div
                className="rounded-xl border p-4 transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    }}
                  >
                    <FaCrown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-content)' }}>
                      {ownedWorkspaces.length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
                      Owned Workspaces
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl border p-4 transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
                    }}
                  >
                    <FaUsers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-content)' }}>
                      {sharedWorkspaces.length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
                      Shared With Me
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl border p-4 transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-background-secondary)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    <FaVideo className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-content)' }}>
                      {workspaces.length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
                      Total Workspaces
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Auth Banner */}
            {showYoutubeAuthButton && (
              <div
                className="mb-6 overflow-hidden rounded-xl border px-5 py-4 shadow-sm"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  borderLeft: '4px solid var(--color-accent)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
                      }}
                    >
                      <HiSparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--color-content)' }}>
                        Workspace Created Successfully!
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--color-content-tertiary)' }}>
                        Connect your YouTube channel to unlock content management features.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleChannelAuth}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                    }}
                  >
                    <FaYoutube className="h-4 w-4" />
                    Connect
                  </button>
                </div>
              </div>
            )}

            {/* Quick Access Section */}
            {recentWorkspaces.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaClock
                      className="h-4 w-4"
                      style={{ color: 'var(--color-content-tertiary)' }}
                    />
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--color-content)' }}>
                      Quick Access
                    </h2>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {recentWorkspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      onClick={() => navigate(`/workspace/${workspace._id}`)}
                      className="group flex min-w-[280px] cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                      }}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        }}
                      >
                        {workspace.workspaceName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3
                          className="truncate text-sm font-semibold"
                          style={{ color: 'var(--color-content)' }}
                        >
                          {workspace.workspaceName}
                        </h3>
                        <p
                          className="truncate text-xs"
                          style={{ color: 'var(--color-content-tertiary)' }}
                        >
                          {workspace.workspaceDescription}
                        </p>
                      </div>
                      <MdOpenInNew
                        className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: 'var(--color-primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workspaces Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-content)' }}>
                  All Workspaces
                </h2>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div
                    className="flex rounded-lg border p-0.5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <button
                      onClick={() => setViewMode('grid')}
                      className="rounded p-1.5 transition-all"
                      style={{
                        backgroundColor:
                          viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'grid' ? 'white' : 'var(--color-content-tertiary)',
                      }}
                    >
                      <HiViewGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className="rounded p-1.5 transition-all"
                      style={{
                        backgroundColor:
                          viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'list' ? 'white' : 'var(--color-content-tertiary)',
                      }}
                    >
                      <HiViewList className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={toggleFormVisibility}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    }}
                  >
                    <FaPlus className="h-3.5 w-3.5" />
                    New
                  </button>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && workspaces.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      onClick={() => navigate(`/workspace/${workspace._id}`)}
                      className="group cursor-pointer overflow-hidden rounded-xl border transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          workspace.ownerID._id === user?._id
                            ? 'var(--color-primary)'
                            : 'var(--color-accent)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{
                              background:
                                workspace.ownerID._id === user?._id
                                  ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'
                                  : 'var(--color-background-secondary)',
                              color:
                                workspace.ownerID._id === user?._id
                                  ? 'white'
                                  : 'var(--color-accent)',
                            }}
                          >
                            {workspace.workspaceName.charAt(0).toUpperCase()}
                          </div>
                          <button
                            className="rounded p-1 opacity-0 transition-all group-hover:opacity-100"
                            style={{ color: 'var(--color-content-tertiary)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEllipsisV className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3
                          className="mb-1 truncate text-sm font-bold"
                          style={{ color: 'var(--color-content)' }}
                        >
                          {workspace.workspaceName}
                        </h3>
                        <p
                          className="mb-3 line-clamp-2 text-xs leading-relaxed"
                          style={{ color: 'var(--color-content-tertiary)' }}
                        >
                          {workspace.workspaceDescription}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {workspace.youtubeChannelID && (
                              <span
                                className="rounded px-2 py-0.5 text-xs font-medium"
                                style={{
                                  backgroundColor: 'var(--color-success-bg)',
                                  color: 'var(--color-success)',
                                }}
                              >
                                Connected
                              </span>
                            )}
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{
                              color:
                                workspace.ownerID._id === user?._id
                                  ? 'var(--color-primary)'
                                  : 'var(--color-accent)',
                            }}
                          >
                            {workspace.ownerID._id === user?._id ? 'Owner' : 'Member'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && workspaces.length > 0 && (
                <div
                  className="overflow-hidden rounded-xl border"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <table className="w-full">
                    <thead>
                      <tr
                        className="border-b text-left text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--color-background-secondary)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-content-tertiary)',
                        }}
                      >
                        <th className="px-4 py-3">Workspace</th>
                        <th className="hidden px-4 py-3 lg:table-cell">Description</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaces.map((workspace) => (
                        <tr
                          key={workspace._id}
                          onClick={() => navigate(`/workspace/${workspace._id}`)}
                          className="cursor-pointer border-b transition-colors last:border-0"
                          style={{
                            borderColor: 'var(--color-border)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                                style={{
                                  background:
                                    workspace.ownerID._id === user?._id
                                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'
                                      : 'var(--color-background-secondary)',
                                  color:
                                    workspace.ownerID._id === user?._id
                                      ? 'white'
                                      : 'var(--color-accent)',
                                }}
                              >
                                {workspace.workspaceName.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className="text-sm font-semibold"
                                style={{ color: 'var(--color-content)' }}
                              >
                                {workspace.workspaceName}
                              </span>
                            </div>
                          </td>
                          <td
                            className="hidden max-w-xs truncate px-4 py-3 text-sm lg:table-cell"
                            style={{ color: 'var(--color-content-tertiary)' }}
                          >
                            {workspace.workspaceDescription}
                          </td>
                          <td className="px-4 py-3">
                            {workspace.youtubeChannelID ? (
                              <span
                                className="inline-flex rounded px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: 'var(--color-success-bg)',
                                  color: 'var(--color-success)',
                                }}
                              >
                                Connected
                              </span>
                            ) : (
                              <span
                                className="inline-flex rounded px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: 'var(--color-background-secondary)',
                                  color: 'var(--color-content-muted)',
                                }}
                              >
                                Not Connected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold"
                              style={{
                                color:
                                  workspace.ownerID._id === user?._id
                                    ? 'var(--color-primary)'
                                    : 'var(--color-accent)',
                              }}
                            >
                              {workspace.ownerID._id === user?._id ? 'Owner' : 'Member'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              className="rounded p-1 transition-colors"
                              style={{ color: 'var(--color-content-tertiary)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaEllipsisV className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty State */}
              {workspaces.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border py-16 text-center"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div
                    className="mb-4 rounded-full p-4"
                    style={{ backgroundColor: 'var(--color-background-secondary)' }}
                  >
                    <FaVideo className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-content)' }}>
                    No workspaces yet
                  </h3>
                  <p
                    className="mb-4 mt-1 max-w-sm text-sm"
                    style={{ color: 'var(--color-content-tertiary)' }}
                  >
                    Create your first workspace to start managing YouTube content
                  </p>
                  <button
                    onClick={toggleFormVisibility}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    }}
                  >
                    Create Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Workspace Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              className="border-b px-6 py-5"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              }}
            >
              <h2 className="text-xl font-bold text-white">Create New Workspace</h2>
              <p className="mt-1 text-sm text-white/80">
                Set up a new workspace for your YouTube content
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(createWorkspace)} className="space-y-5">
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: 'var(--color-content)' }}
                  >
                    Workspace Name <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    {...register('workspaceName', { required: 'Workspace name is required' })}
                    type="text"
                    disabled={isCreating}
                    className="w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: errors.workspaceName
                        ? 'var(--color-error)'
                        : 'var(--color-border)',
                      color: 'var(--color-content)',
                    }}
                    onFocus={(e) => {
                      if (!errors.workspaceName) {
                        e.target.style.borderColor = 'var(--color-border-focus)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="e.g., Marketing Campaign 2024"
                  />
                  {errors.workspaceName && (
                    <p className="mt-1.5 text-xs" style={{ color: 'var(--color-error)' }}>
                      {errors.workspaceName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: 'var(--color-content)' }}
                  >
                    Description <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <textarea
                    {...register('workspaceDescription', {
                      required: 'Description is required',
                    })}
                    disabled={isCreating}
                    rows={4}
                    className="w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: errors.workspaceDescription
                        ? 'var(--color-error)'
                        : 'var(--color-border)',
                      color: 'var(--color-content)',
                    }}
                    onFocus={(e) => {
                      if (!errors.workspaceDescription) {
                        e.target.style.borderColor = 'var(--color-border-focus)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Briefly describe this workspace and its purpose..."
                  />
                  {errors.workspaceDescription && (
                    <p className="mt-1.5 text-xs" style={{ color: 'var(--color-error)' }}>
                      {errors.workspaceDescription.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    }}
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
                    className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-content)',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
