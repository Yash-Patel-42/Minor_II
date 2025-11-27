import { useForm, type SubmitHandler } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import AnimatedShapeBackground from '../../components/AnimatedShapeBackground';
import { useAuth } from '../../context/AuthProvider';
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
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };
  const navigateToLogin = () => {
    navigate('/login');
  };
  return (
    <AnimatedShapeBackground className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-gray-700 bg-gray-900/50 px-8 py-6 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-sm uppercase tracking-widest text-cyan-400 shadow-cyan-400/50 [text-shadow:_0_0_8px_var(--tw-shadow-color)]">
            // New User Protocol //
          </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Build Your <span className="font-serif italic text-purple-400">Empire</span>
          </h1>
          <p className="text-lg text-gray-400">Create your account to begin</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          {errors.root && <p className="text-sm text-red-400">{errors.root.message}</p>}
          <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Display Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register('name', {
                required: 'Name is required.',
                pattern: {
                  value: /^[a-zA-Z ]*$/,
                  message: 'Name can only contain letters and spaces',
                },
              })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 outline-none ring-2 ring-transparent transition-all placeholder:text-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:ring-purple-500/50"
            />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Email Protocol</label>
            <input
              type="email"
              placeholder="editor@your-empire.com"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.',
                },
              })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 outline-none ring-2 ring-transparent transition-all placeholder:text-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:ring-purple-500/50"
            />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Security Key</label>
            <input
              type="password"
              placeholder="••••••••••••"
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
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 outline-none ring-2 ring-transparent transition-all placeholder:text-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:ring-purple-500/50"
            />
            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-purple-600 px-8 py-2 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/50 disabled:scale-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Initiating Protocol...' : 'Build Empire'}
          </button>
        </form>
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 bg-white px-6 py-2 text-lg font-bold text-gray-900 transition-all hover:scale-105 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign in with Google{<FcGoogle size={30} />}
          </button>
          <div className="text-center text-gray-400">
            Already have an Empire?{' '}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={navigateToLogin}
              className="font-medium text-cyan-400 transition-all hover:text-cyan-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </AnimatedShapeBackground>
  );
}
