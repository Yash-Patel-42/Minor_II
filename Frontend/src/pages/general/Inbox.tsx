import { useEffect, useState } from 'react';
import type { IInbox } from '../../types/InboxType';
import api from '../../utils/axiosInstance';

function Inbox() {
  const [inbox, setInbox] = useState<IInbox[]>([]);
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const response = await api('/inbox/user/invite');
        setInbox(response.data.inbox);
        console.log('Inbox is Here: ', response.data.inbox);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInbox();
  }, []);
  const handleAcceptInvite = async (invite: IInbox) => {
    try {
      const response = await api.post('/inbox/user/invite/accept', { invite });
      console.log('Response: ', response);
      console.log(invite);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeclineInvite = async (invite: IInbox) => {
    try {
      const response = await api.post('/inbox/user/invite/decline', { invite });
      console.log('Response: ', response);
      console.log(invite);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {inbox && inbox.length > 0 ? (
        inbox.map((invite) => (
          <div
            key={invite._id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              opacity: invite.response !== 'pending' ? 0.6 : 1,
            }}
          >
            <p>
              Invite from: {invite.sender.name} ({invite.sender.email})
            </p>
            <p>Workspace Named: {invite.payload.workspaceName}</p>
            <p>Workspace Description: {invite.payload.workspaceDescription}</p>
            <p>Requested Role: {invite.payload.role}</p>
            {invite.type === 'workspace-invite' &&
            invite.response === 'pending' ? (
              <div>
                <button
                  onClick={() => handleAcceptInvite(invite)}
                  className="mr-2 bg-green-300 p-1"
                >
                  Accept
                </button>
                <button onClick={() => handleDeclineInvite(invite)} className="bg-red-300 p-1">
                  Decline
                </button>
              </div>
            ) : (
              <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                Status:{' '}
                <span
                  style={{
                    color: invite.response === 'accepted' ? 'green' : 'red',
                    textTransform: 'capitalize',
                  }}
                >
                  {invite.response}
                </span>
              </p>
            )}
          </div>
        ))
      ) : (
        <p>Your inbox is empty.</p>
      )}
    </div>
  );
}

export default Inbox;
