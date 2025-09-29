import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { LoginFormFields } from '../../types/FormType';
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
      setError("root", {message:`Error Occurred: ${error}`})
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/users/auth/google';
  };
  const navigateToRegister = () => {
    navigate('/register');
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Card */}
      <div className="w-[480px] rounded-xl shadow-xl border border-gray-200 bg-white flex flex-col items-center p-10 gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2"></div>
          <p className="text-gray-500 text-lg">Log in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
            <label className="text-sm text-gray-700">Email</label>
            <input
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email.',
                },
              })}
              // type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            {isSubmitting ? 'Logging you in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full gap-3">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Secondary option */}
        <button onClick={handleGoogleLogin}>Log in with Google</button>
        <button className="text-red-600 font-medium hover:underline" onClick={navigateToRegister}>
          Create an account
        </button>
      </div>
    </div>
  );
}
