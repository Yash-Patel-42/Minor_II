import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { IApprovalRequest } from '../../types/ApprovalRequest';
import api from '../../utils/axiosInstance';

const UploadRequests = () => {
  const { workspaceId } = useParams();
  const [uploadRequests, setUploadRequests] = useState<IApprovalRequest[] | null>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUploadRequests = async () => {
      if (!workspaceId) return;
      setLoading(true);
      try {
        const response = await api.get(`/workspace/${workspaceId}/upload-requests`, {
          withCredentials: true,
        });
        setUploadRequests(response.data.approvalRequests);
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUploadRequests();
  }, [workspaceId]);

  const handleApprove = async (req: IApprovalRequest) => {
    if (!req) return console.error('No request found');
    console.log('Sent for Upload:', req);
    try {
      const response = await api.post(
        `workspace/${workspaceId}/approval-requests/approve`,
        { req },
        { withCredentials: true }
      );
      console.log('Sent for Upload after:', response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (req: IApprovalRequest) => {
    if (!req) return;
    try {
      await api.post(
        `workspace/${workspaceId}/approval-requests/reject`,
        { req },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReupload = async (req: IApprovalRequest) => {
    if (!req) return;
    try {
      await api.post(
        `workspace/${workspaceId}/approval-requests/request-reupload`,
        { req },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading upload requests...</p>;
  return (
    <div>
      <h1>Upload Requests</h1>
      {uploadRequests === null || uploadRequests?.length === 0 ? (
        <p>No upload requests.</p>
      ) : (
        uploadRequests.map((req) => {
          const id = req._id;
          return (
            <div
              key={id ?? Math.random()}
              style={{
                border: '1px solid #ddd',
                padding: 12,
                margin: 10,
                borderRadius: 6,
                opacity: req.status !== 'pending' ? 0.7 : 1,
              }}
            >
              <h3>{req.video?.title}</h3>
              <p style={{ margin: '6px 0' }}>{req.video?.description}</p>
              <p>
                Requested by: {req.requester?.name} ({req.requester?.email})
              </p>
              <p>
                Approvers:{' '}
                {Array.isArray(req.approvers) && req.approvers.length > 0
                  ? req.approvers.map((a) => a.name).join(', ')
                  : 'None'}
              </p>
              <p>
                Status:{' '}
                <strong style={{ textTransform: 'capitalize' }}>{req.status || 'pending'}</strong>
              </p>
              {req.response && <p>Response: {req.response}</p>}
              {req.status === 'pending' ? (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => {
                      handleApprove(req);
                    }}
                    style={{
                      marginRight: 8,
                      padding: '6px 10px',
                      background: '#4caf50',
                      color: '#fff',
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req)}
                    style={{
                      marginRight: 8,
                      padding: '6px 10px',
                      background: '#f44336',
                      color: '#fff',
                    }}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleRequestReupload(req)}
                    style={{ padding: '6px 10px', background: '#ff9800', color: '#fff' }}
                  >
                    Request Reupload
                  </button>
                </div>
              ) : (
                <p style={{ marginTop: 8, fontWeight: 600 }}>
                  Final status: <span style={{ textTransform: 'capitalize' }}>{req.status}</span>
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default UploadRequests;
