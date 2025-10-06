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
    <div className="p-6 text-white">
      <h2 className="text-4xl font-semibold mb-5">
        Channel & Workspace Details:{' '}
        <span className="text-base italic text-gray-500">({workspace._id})</span>
      </h2>
      <h1 className="text-2xl font-semibold">{workspace.workspaceName}</h1>
      <p className="text-gray-400">{workspace.workspaceDescription}</p>
      <p className="text-gray-400">Owner Name: {workspace.ownerID.name}</p>
      <p className="text-gray-400">Owner Email: {workspace.ownerID.email}</p>
      <p className="text-gray-400">Channel Id: {workspace.youtubeChannelID?.channelID}</p>
      <p className="text-gray-400">Channel Email: {workspace.youtubeChannelID?.channelEmail}</p>
      <p className="text-gray-400">Channel Name: {workspace.youtubeChannelID?.channelName}</p>
      <div className="mt-6">----------------</div>
      <button>Add members to workspaces</button>
      <form onSubmit={addUserToWorkspace}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Role</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <button>Send Invite</button>
      </form>
    </div>
  );
}

export default Workspace;
