import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import type { IWorkspace } from '../../types/WorkspaceType';

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
    const response = await api.post(`/workspace/${workspaceId}/add/user`, {
      newMemberEmail: email,
      newMemberRole: role,
    });
    console.log(response);
  };

  if (!workspace) return <div>Loading</div>;
  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          {workspace.workspaceName}
          <span className="text-sm italic text-gray-500">({workspace._id})</span>
        </h2>
        <p className="text-gray-400 mt-2">{workspace.workspaceDescription}</p>
      </div>

      {/* Workspace Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
            Owner Details
          </h3>
          <p className="text-gray-300">{workspace.ownerID.name}</p>
          <p className="text-gray-400">{workspace.ownerID.email}</p>
        </div>

        {workspace.youtubeChannelID && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
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
        <h3 className="text-2xl font-semibold mb-4">Workspace Members</h3>
        {workspace.members && workspace.members.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.members.map((member, idx: number) => (
              <div
                key={idx}
                className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition"
              >
                <p className="text-lg font-medium text-white">{member.userID.name}</p>
                <p className="text-gray-400 text-sm">{member.userID.email}</p>
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
                  <p className="text-gray-500 text-xs mt-1">
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
      <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-2xl max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-3">Add Member</h3>
        <form onSubmit={addUserToWorkspace} className="flex flex-col gap-3 text-gray-300">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              required
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-semibold"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}

export default Workspace;
