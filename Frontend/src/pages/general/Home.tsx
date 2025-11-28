import Navbar from "@components/ui/Navbar";
import { useAuth } from "@context/AuthProvider";
import api from "@utils/axiosInstance";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import {
  FaClock,
  FaCrown,
  FaEllipsisV,
  FaPlus,
  FaUsers,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { HiSparkles, HiViewGrid, HiViewList } from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router";
import type { CreateWorkspaceFormFields } from "../../types/FormType";
import type { IVideo } from "../../types/VideoType";
import type { IWorkspace } from "../../types/WorkspaceType";

type ViewMode = "grid" | "list";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showYoutubeAuthButton, setShowYoutubeAuthButton] = useState(false);
  const [newWorkspaceId, setNewWorkspaceId] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

  const createWorkspace: SubmitHandler<CreateWorkspaceFormFields> = async (
    inputData
  ) => {
    setIsCreating(true);
    const loadingToast = toast.loading("Creating workspace...");
    try {
      const response = await api.post("/workspace/create", {
        workspaceName: inputData.workspaceName,
        workspaceDescription: inputData.workspaceDescription,
        ownerID: user?._id,
      });

      if (response.status === 201) {
        const workspace = response.data.workspace;
        setNewWorkspaceId(workspace._id);
        setShowYoutubeAuthButton(true);
        setWorkspaces((prev) => [...prev, workspace]);
        toast.success("Workspace created successfully!", {
          id: loadingToast,
        });
        setShowForm(false);
        reset();
      }
    } catch (error) {
      console.error("Failed to create workspace:", error);
      toast.error("Failed to create workspace.", {
        id: loadingToast,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleChannelAuth = () => {
    if (newWorkspaceId) {
      window.location.href = `http://localhost:3000/api/workspace/auth/google?workspaceId=${newWorkspaceId}`;
    } else {
      toast.error("Workspace ID missing. Please try again.");
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get("/workspaces");
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error("Failed to fetch workspaces: ", error);
        toast.error("Failed to load workspaces.");
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Failed to fetch videos: ", error);
        toast.error("Failed to load videos.");
      }
    };
    fetchVideos();
  }, []);

  const ownedWorkspaces = workspaces.filter((w) => w.ownerID._id === user?._id);
  const sharedWorkspaces = workspaces.filter(
    (w) => w.ownerID._id !== user?._id
  );
  const recentWorkspaces = [...workspaces].slice(0, 3);

  if (loading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="relative">
          <div className="border-border h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="border-t-primary animate-duration-1000 absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-background text-text border border-border rounded-xl",
        }}
      />

      <Navbar />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Top Stats Bar */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border-border bg-background rounded-xl border p-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <FaCrown className="text-background h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-text text-2xl font-bold">
                      {ownedWorkspaces.length}
                    </p>
                    <p className="text-text-muted text-xs">Owned Workspaces</p>
                  </div>
                </div>
              </div>

              <div className="border-border bg-background rounded-xl border p-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg">
                    <FaUsers className="text-background h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-text text-2xl font-bold">
                      {sharedWorkspaces.length}
                    </p>
                    <p className="text-text-muted text-xs">Shared With Me</p>
                  </div>
                </div>
              </div>

              <div className="border-border bg-background rounded-xl border p-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-background-muted text-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                    <FaVideo className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-text text-2xl font-bold">
                      {workspaces.length}
                    </p>
                    <p className="text-text-muted text-xs">Total Workspaces</p>
                  </div>
                </div>
              </div>

              <div className="border-border bg-background rounded-xl border p-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-background-muted text-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                    <FaVideo className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-text text-2xl font-bold">
                      {videos.length}
                    </p>
                    <p className="text-text-muted text-xs">
                      Total Videos Uploaded
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Auth Banner */}
            {showYoutubeAuthButton && (
              <div className="border-border border-l-accent bg-background mb-6 overflow-hidden rounded-xl border border-l-4 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <HiSparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-text text-sm font-bold">
                        Workspace Created Successfully!
                      </h3>
                      <p className="text-text-muted text-xs">
                        Connect your YouTube channel to unlock content
                        management features.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleChannelAuth}
                    className="bg-error flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
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
                    <FaClock className="text-text-muted h-4 w-4" />
                    <h2 className="text-text text-sm font-semibold">
                      Quick Access
                    </h2>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {recentWorkspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      onClick={() => navigate(`/workspace/${workspace._id}`)}
                      className="border-border bg-background hover:border-primary group flex min-w-[280px] cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all"
                    >
                      <div className="bg-primary text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                        {workspace.workspaceName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-text truncate text-sm font-semibold">
                          {workspace.workspaceName}
                        </h3>
                        <p className="text-text-muted truncate text-xs">
                          {workspace.workspaceDescription}
                        </p>
                      </div>
                      <MdOpenInNew className="text-primary h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workspaces Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text text-lg font-bold">All Workspaces</h2>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div className="border-border flex rounded-lg border p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded p-1.5 transition-all ${
                        viewMode === "grid"
                          ? "bg-primary text-background"
                          : "text-text-muted bg-transparent"
                      }`}
                    >
                      <HiViewGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded p-1.5 transition-all ${
                        viewMode === "list"
                          ? "bg-primary text-background"
                          : "text-text-muted bg-transparent"
                      }`}
                    >
                      <HiViewList className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={toggleFormVisibility}
                    className="bg-primary text-background flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
                  >
                    <FaPlus className="h-3.5 w-3.5" />
                    New
                  </button>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && workspaces.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      onClick={() => navigate(`/workspace/${workspace._id}`)}
                      className={`border-border bg-background group cursor-pointer overflow-hidden rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                        workspace.ownerID._id === user?._id
                          ? "hover:border-primary"
                          : "hover:border-accent"
                      }`}
                    >
                      <div className="p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold ${
                              workspace.ownerID._id === user?._id
                                ? "bg-primary text-background"
                                : "bg-background-muted text-accent"
                            }`}
                          >
                            {workspace.workspaceName.charAt(0).toUpperCase()}
                          </div>
                          <button
                            className="text-text-muted rounded p-1 opacity-0 transition-all group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEllipsisV className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3 className="text-text mb-1 truncate text-sm font-bold">
                          {workspace.workspaceName}
                        </h3>
                        <p className="text-text-muted mb-3 line-clamp-2 text-xs leading-relaxed">
                          {workspace.workspaceDescription}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {workspace.youtubeChannelID && (
                              <span className="bg-success-bg text-success rounded px-2 py-0.5 text-xs font-medium">
                                Connected
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              workspace.ownerID._id === user?._id
                                ? "text-primary"
                                : "text-accent"
                            }`}
                          >
                            {workspace.ownerID._id === user?._id
                              ? "Owner"
                              : "Member"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && workspaces.length > 0 && (
                <div className="border-border bg-background overflow-hidden rounded-xl border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-border bg-background-muted text-text-muted border-b text-left text-xs font-semibold">
                        <th className="px-4 py-3">Workspace</th>
                        <th className="hidden px-4 py-3 lg:table-cell">
                          Description
                        </th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaces.map((workspace) => (
                        <tr
                          key={workspace._id}
                          onClick={() =>
                            navigate(`/workspace/${workspace._id}`)
                          }
                          className="border-border hover:bg-background-hover cursor-pointer border-b transition-colors last:border-0"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                  workspace.ownerID._id === user?._id
                                    ? "bg-primary text-background"
                                    : "bg-background-muted text-accent"
                                }`}
                              >
                                {workspace.workspaceName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span className="text-text text-sm font-semibold">
                                {workspace.workspaceName}
                              </span>
                            </div>
                          </td>
                          <td className="text-text-muted hidden max-w-xs truncate px-4 py-3 text-sm lg:table-cell">
                            {workspace.workspaceDescription}
                          </td>
                          <td className="px-4 py-3">
                            {workspace.youtubeChannelID ? (
                              <span className="bg-success-bg text-success inline-flex rounded px-2 py-1 text-xs font-medium">
                                Connected
                              </span>
                            ) : (
                              <span className="bg-background-muted text-text-muted inline-flex rounded px-2 py-1 text-xs font-medium">
                                Not Connected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold ${
                                workspace.ownerID._id === user?._id
                                  ? "text-primary"
                                  : "text-accent"
                              }`}
                            >
                              {workspace.ownerID._id === user?._id
                                ? "Owner"
                                : "Member"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              className="text-text-muted rounded p-1 transition-colors"
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
                <div className="border-border bg-background flex flex-col items-center justify-center rounded-xl border py-16 text-center">
                  <div className="bg-background-muted mb-4 rounded-full p-4">
                    <FaVideo className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-text text-base font-bold">
                    No workspaces yet
                  </h3>
                  <p className="text-text-muted mb-4 mt-1 max-w-sm text-sm">
                    Create your first workspace to start managing YouTube
                    content
                  </p>
                  <button
                    onClick={toggleFormVisibility}
                    className="bg-primary text-background rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
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
          <div className="border-border bg-background w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl">
            <div className="bg-primary text-background border-b px-6 py-5">
              <h2 className="text-xl font-bold">Create New Workspace</h2>
              <p className="mt-1 text-sm opacity-80">
                Set up a new workspace for your YouTube content
              </p>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleSubmit(createWorkspace)}
                className="space-y-5"
              >
                <div>
                  <label className="text-text mb-2 block text-sm font-semibold">
                    Workspace Name <span className="text-error">*</span>
                  </label>
                  <input
                    {...register("workspaceName", {
                      required: "Workspace name is required",
                    })}
                    type="text"
                    disabled={isCreating}
                    className={`bg-background text-text w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.workspaceName
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="e.g., Marketing Campaign 2024"
                  />
                  {errors.workspaceName && (
                    <p className="text-error mt-1.5 text-xs">
                      {errors.workspaceName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-text mb-2 block text-sm font-semibold">
                    Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    {...register("workspaceDescription", {
                      required: "Description is required",
                    })}
                    disabled={isCreating}
                    rows={4}
                    className={`bg-background text-text w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.workspaceDescription
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="Briefly describe this workspace and its purpose..."
                  />
                  {errors.workspaceDescription && (
                    <p className="text-error mt-1.5 text-xs">
                      {errors.workspaceDescription.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-primary text-background flex-1 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Creating...
                      </span>
                    ) : (
                      "Create Workspace"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={isCreating}
                    className="border-border bg-background text-text flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
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
