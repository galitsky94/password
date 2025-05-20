interface LoginFormProps {
  username: string;
  password: string;
  showPassword: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
}

const LoginForm = ({
  username,
  password,
  showPassword,
  onUsernameChange,
  onPasswordChange,
  onLogin
}: LoginFormProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-1">Login Credentials</h2>

      <div className="space-y-1">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your username"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Fire shots to set password"
            readOnly
          />
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={onLogin}
          className="w-full flex justify-center py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
