import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { IWorkspace } from '../../types/WorkspaceType';
import api from '../../utils/axiosInstance';

function Workspace() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await api.get(`/workspace/${workspaceId}`, { withCredentials: true });
        setWorkspace(response.data.workspace);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  const addUserToWorkspace = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const response = await api.post(`/workspace/${workspaceId}/add/user`, {
    //   newMemberEmail: email,
    //   newMemberRole: role,
    // });
    const response = await api.post(`/workspace/${workspaceId}/invite/user`, {
      newMemberEmail: email,
      newMemberRole: role,
    });
    console.log(response);
  };

  if (!workspace) return <div>Loading</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 text-white">
      {/* Header */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="flex items-center gap-2 text-3xl font-bold">
          {workspace.workspaceName}
          <span className="text-sm text-gray-500 italic">({workspace._id})</span>
        </h2>
        <p className="mt-2 text-gray-400">{workspace.workspaceDescription}</p>
      </div>

      {/* Workspace Info */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm">
          <h3 className="mb-3 border-b border-gray-700 pb-1 text-lg font-semibold">
            Owner Details
          </h3>
          <p className="text-gray-300">{workspace.ownerID.name}</p>
          <p className="text-gray-400">{workspace.ownerID.email}</p>
        </div>

        {workspace.youtubeChannelID && (
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm">
            <h3 className="mb-3 border-b border-gray-700 pb-1 text-lg font-semibold">
              YouTube Channel
            </h3>
            <p className="text-gray-300">{workspace.youtubeChannelID.channelName}</p>
            <p className="text-gray-400">Channel ID: {workspace.youtubeChannelID.channelID}</p>
            <p className="text-gray-400">Email: {workspace.youtubeChannelID.channelEmail}</p>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="mb-10">
        <h3 className="mb-4 text-2xl font-semibold">Workspace Members</h3>
        {workspace.members && workspace.members.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspace.members.map((member, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-700 bg-gray-800/60 p-4 transition hover:bg-gray-800"
              >
                <p className="text-lg font-medium text-white">{member.userID.name}</p>
                <p className="text-sm text-gray-400">{member.userID.email}</p>
                <div className="mt-3 text-sm">
                  <p>
                    <span className="font-semibold text-gray-300">Role:</span>{' '}
                    <span
                      className={`${
                        member.role === 'admin'
                          ? 'text-red-400'
                          : member.role === 'manager'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                      } font-medium`}
                    >
                      {member.role}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Status:</span>{' '}
                    <span
                      className={`${
                        member.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Invited by: {member.invitedBy?.email || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No members added yet.</p>
        )}
      </div>

      {/* Add Member Form */}
      <div className="max-w-md rounded-2xl border border-gray-700 bg-gray-800/50 p-5 shadow-xl">
        <h3 className="mb-3 text-xl font-semibold">Add Member</h3>
        <form onSubmit={addUserToWorkspace} className="flex flex-col gap-3 text-gray-300">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              required
              className="rounded-lg border border-gray-700 bg-gray-900 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-gray-900 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-blue-600 py-2 font-semibold transition hover:bg-blue-700"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}

export default Workspace;
