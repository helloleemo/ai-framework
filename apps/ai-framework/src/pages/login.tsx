import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { validateField } from '../utils/validators';
// import { login as loginApi } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { decodeTokenAPI, loginAPI } from '@/api/auth';
import { useSpinner } from '@/hooks/use-spinner';

function Login() {
  // login -> dashboard
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // check token
    decodeTokenAPI(token)
      .then((res) => {
        const expStr = res.data?.tokenInfo?.exp;
        const expirationTime = Number(expStr) * 1000;
        const currentTime = Date.now();
        if (res.success && expStr && expirationTime > currentTime) {
          navigate('/dashboard');
        }
      })
      .catch(() => console.log('Token validation failed'));
  }, [navigate]);

  // user login
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<{ userName?: string; password?: string }>(
    {}
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const { loading, setLoading, Spinner } = useSpinner();

  const validate = () => {
    const userNameError = validateField('userName', userName);
    const passwordError = validateField('password', password);
    setError({ userName: userNameError, password: passwordError });
    return !userNameError && !passwordError;
  };

  const handleLogin = () => {
    setLoginError(null);

    setLoading(true);
    if (validate()) {
      loginAPI(userName, password)
        .then((res) => {
          if (res.success) {
            console.log('Login successful:', res);
            localStorage.setItem('code', res.data.code);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('accessToken', res.data.accessToken);

            navigate('/dashboard');
          } else {
            console.log('Login failed:', res.message);
          }
        })
        .catch((err) => {
          console.log('Login error:', err);
          // setLoginError(err.message);
          setLoginError('Login failed. Please check your credentials.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center">
      {/* Background */}
      <div className="bg">
        <div className="alpha bg-neutral-800 opacity-60 absolute inset-0 object-cover w-full h-full -z-10"></div>
        <img
          className="absolute inset-0 object-cover w-full h-full -z-20"
          src="/login/dashboard-1.png"
          alt=""
        />
      </div>
      <div className="bg-white w-[520px] px-20 pt-20 pb-30 m-5 rounded-lg shadow-lg">
        <div className="w-full h-full align-middle text-center animate__animated animate__fadeIn">
          {/* Logo */}
          <div className="logo mb-3">
            <img className="mx-auto w-[110px]" src="logo.svg" alt="Logo" />
          </div>
          {/* Greeting */}
          <div className="greeting mb-3">
            <p className="text-2xl font-bold text-slate-800">Welcome back</p>
            <p className="text-slate-400 text-sm">
              Please enter your credentials to continue.
            </p>
          </div>
          {/* User Name */}
          <div className="userName pt-5">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              type="text"
              className={`rounded-sm px-3 py-5 ${
                error.userName ? 'border-rose-600' : ''
              }`}
              placeholder="enter your user name"
              value={userName}
              onChange={(e) => {
                const value = e.target.value;
                setUserName(value);
                const err = validateField('userName', value);
                if (!err)
                  setError((prev) => ({ ...prev, userName: undefined }));
              }}
            />
          </div>
          {/* Password */}
          <div className="password mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className={`rounded-sm px-3 py-5 ${
                error.password ? 'border-rose-600' : ''
              }`}
              placeholder="enter your password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                const err = validateField('password', value);
                if (!err)
                  setError((prev) => ({ ...prev, password: undefined }));
              }}
            />
          </div>
          <p className="text-left text-rose-600 text-sm mt-1 h-[20px]">
            {error.userName || error.password
              ? `Please enter a valid ${[error.userName, error.password]
                  .filter(Boolean)
                  .join(' and ')}.`
              : ''}
            {loginError}
          </p>
          {/* Remember me */}
          {/* <div className="remember pt-3">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-sky-500"
              />
              Remember me
            </Label>
          </div> */}
          {/* Login btn*/}

          <Button
            onClick={handleLogin}
            className={`w-full mt-8 flex items-center justify-center gap-2 ${
              loading ? 'cursor-default' : ''
            }`}
            disabled={loading}
          >
            {loading ? Spinner : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
