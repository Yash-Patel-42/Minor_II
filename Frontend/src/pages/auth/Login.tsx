import { isAxiosError } from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import AnimatedShapeBackground from '../../components/AnimatedShapeBackground';
import { useAuth } from '../../context/AuthProvider';
import type { LoginFormFields } from '../../types/FormType';
import api from '../../utils/axiosInstance';

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({ mode: 'onChange' });

  const navigate = useNavigate();
  const { login } = useAuth();

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
      if (isAxiosError(error)) {
        setError('root', {
          message: `Error: ${error?.response?.data?.message || 'Network Error Occured.'}`,
        });
      }
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const navigateToRegister = () => {
    navigate('/register');
  };
  return (
    <AnimatedShapeBackground className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      {/* {shapes} */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-gray-700 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-lg md:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-sm uppercase tracking-widest text-cyan-400 shadow-cyan-400/50 [text-shadow:_0_0_8px_var(--tw-shadow-color)]">
            // Authentication Required //
          </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Access Your <span className="font-serif italic text-purple-400">Empire</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          {errors.root && (
            <p className="text-sm font-semibold text-red-400">{errors.root.message}</p>
          )}
          <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Email Protocol</label>
            <input
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.',
                },
              })}
              type="email"
              placeholder="editor@your-empire.com"
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 outline-none ring-2 ring-transparent transition-all placeholder:text-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:ring-purple-500/50"
            />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Security Key</label>
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
              placeholder="••••••••••••"
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 outline-none ring-2 ring-transparent transition-all placeholder:text-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:ring-purple-500/50"
            />
            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-purple-500 px-8 py-3 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/50 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate'}
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
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 bg-white px-6 py-3 text-lg font-bold text-gray-900 transition-all hover:scale-105 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Log in with Google{<FcGoogle size={30} />}
          </button>
          <div className="text-center text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={navigateToRegister}
              className="font-medium text-cyan-400 transition-all hover:text-cyan-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start Your Empire
            </button>
          </div>
        </div>
      </div>
    </AnimatedShapeBackground>
  );
}
