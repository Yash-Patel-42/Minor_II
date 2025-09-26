import { useState } from 'react';
import api from '../../utils/axoisInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/register', { email, password, name });
      // .then((result) => console.log(result))
      // .catch((error) => console.log(error));
      const user = response.data.user;
      login(user);
      navigate('/home');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Card */}
      <div className="w-[480px] rounded-xl shadow-xl border border-gray-200 bg-white flex flex-col items-center p-10 gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2"></div>
          <p className="text-gray-500 text-lg">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="name"
              placeholder="Enter your name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        {/* <div className="flex items-center w-full gap-3">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div> */}

        {/* Secondary option */}
        {/* <button className="text-red-600 font-medium hover:underline">Create an account</button> */}
      </div>
    </div>
  );
}
