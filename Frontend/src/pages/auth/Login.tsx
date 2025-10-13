import { useAuth } from '../../Context/AuthProvider';
import type { LoginFormFields } from '../../types/FormType';
import api from '../../utils/axiosInstance';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({ mode: 'onChange' });
  const onSubmit: SubmitHandler<LoginFormFields> = async (inputData) => {
    try {
      const response = await api.post('/users/login', {
        email: inputData.email,
        password: inputData.password,
      });
      const user = response.data.user;
      login(user);
      navigate('/home');
    } catch (error) {
      setError('root', { message: `Error Occurred: ${error}` });
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/users/auth/google';
  };
  const navigate = useNavigate();
  const { login } = useAuth();
  const navigateToRegister = () => {
    navigate('/register');
  };
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      {/* Card */}
      <div className="flex w-[480px] flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-10 shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2"></div>
          <p className="text-lg text-gray-500">Log in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1">
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <label className="text-sm text-gray-700">Email</label>
            <input
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.',
                },
              })}
              type="email"
              placeholder="Enter your email"
              className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              {...register('password', {
                required: 'Password is required.',
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) || 'Must contain at least one uppercase letter',
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) || 'Must contain at least one lowercase letter',
                  hasNumber: (value) => /[0-9]/.test(value) || 'Must contain at least one number',
                  hasSpecialChar: (value) =>
                    /[^a-zA-Z0-9]/.test(value) || 'Must contain at least one special character',
                },
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              type="password"
              placeholder="Enter your password"
              className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-red-600 py-2 text-white transition hover:bg-red-700"
          >
            {isSubmitting ? 'Logging you in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Secondary option */}
        <button onClick={handleGoogleLogin}>Log in with Google</button>
        <button className="font-medium text-red-600 hover:underline" onClick={navigateToRegister}>
          Create an account
        </button>
      </div>
    </div>
  );
}
