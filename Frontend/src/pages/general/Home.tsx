import Navbar from '../../components/Navbar';
import { useAuth } from '../../Context/AuthProvider';
import api from '../../utils/axiosInstance';
import type { CreateWorkspaceFormFields } from '../../types/FormType';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

export default function Home() {
  const { register, handleSubmit } = useForm<CreateWorkspaceFormFields>();
  const createWorkspace: SubmitHandler<CreateWorkspaceFormFields> = async (inputData) => {
    const response = await api.post('/workspace', {
      workspaceName: inputData.workspaceName,
      workspaceDescription: inputData.workspaceDescription,
      ownerID: user?._id,
    });
    const workspace = response.data.workspace;
    console.log(workspace);
  };
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };
  return (
    <>
      <Navbar />
      <div>Home</div>
      <button
        onClick={toggleFormVisibility}
        className="text-xl border-1 border-gray-400 p-2 hover:bg-green-200 hover:text-black"
      >
        Create Workspace
      </button>
      {showForm && (
        <form onSubmit={handleSubmit(createWorkspace)}>
          <label>Workspace Name</label>
          <input {...register('workspaceName', { required: true })} type="text" />
          <label>Workspace Description</label>
          <input {...register('workspaceDescription', { required: true })} type="text" />
          <button type="submit">Create Workspace</button>
        </form>
      )}
    </>
  );
}
