import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthProvider';
import type { RegisterFormFields } from '../../types/FormType';
import api from '../../utils/axiosInstance';
export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({ mode: 'onChange' });
  const onSubmit: SubmitHandler<RegisterFormFields> = async (inputData) => {
    try {
      const response = await api.post('/users/register', {
        email: inputData.email,
        password: inputData.password,
        name: inputData.name,
      });
      const user = response.data.user;
      registerUser(user);
      navigate('/home');
    } catch (error) {
      setError('root', { message: `Error Occurred: ${error}` });
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/users/auth/google';
  };
  const navigateToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      {/* Card */}
      <div className="flex w-[480px] flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-10 shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2"></div>
          <p className="text-lg text-gray-500">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1">
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="name"
              placeholder="Enter your name"
              {...register('name', {
                required: 'Name is required.',
                pattern: {
                  value: /^[a-zA-Z ]*$/,
                  message: 'Name can only contain letters and spaces',
                },
              })}
              className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.',
                },
              })}
              className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
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
              className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-red-600 py-2 text-white transition hover:bg-red-700"
          >
            {isSubmitting ? 'Registering you ...' : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Secondary option */}
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        <button className="font-medium text-red-600 hover:underline" onClick={navigateToLogin}>
          Log In
        </button>
      </div>
    </div>
  );
}
