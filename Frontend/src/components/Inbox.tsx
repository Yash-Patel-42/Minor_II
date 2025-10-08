// import { useAuth } from '../Context/AuthProvider';

import { useState } from 'react';
import api from '../utils/axiosInstance';
import type { IInbox } from '../types/InboxType';

function Inbox() {
  const [inbox, setInbox] = useState<IInbox>();
  //   const { user } = useAuth();
  const fetchInbox = async () => {
    try {
      const response = await api('/inbox/user/invite');
      setInbox(response.data.inbox);
      console.log('Inbox is Here: ', response.data.inbox);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={fetchInbox} className="bg-green-400 p-2 rounded-lg">
        Inbox
      </button>
      {inbox && (
        <div>
          <p>Sender Email{inbox._id}</p>
          <p>Sender Email{inbox.sender.email}</p>
          <p>Sender Name{inbox.sender.name}</p>
          <p>Role{inbox.payload.role}</p>
          <button className="bg-green-300 p-1">Accept</button>
          <button className="bg-red-300 p-1">Decline</button>
        </div>
      )}
    </div>
  );
}

export default Inbox;
