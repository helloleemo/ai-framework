import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import validateField from '../utils/validators';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    setError({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log('login', { email, password });
      // TODO: call API
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
          {/* Email */}
          <div className="email pt-5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className={`rounded-sm px-3 py-5 ${
                error.email ? 'border-rose-600' : ''
              }`}
              placeholder="enter your email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                const err = validateField('email', value);
                if (!err) setError((prev) => ({ ...prev, email: undefined }));
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
            {(() => {
              if (error.email && error.password) {
                return `Please enter a valid ${error.email} and ${error.password}.`;
              } else if (
                (error.email && !error.password) ||
                (!error.email && error.password)
              ) {
                return `Please enter a valid ${error.email || error.password}.`;
              } else {
                return '';
              }
            })()}
          </p>
          {/* Remember me */}
          <div className="remember pt-3">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-sky-500"
              />
              Remember me
            </Label>
          </div>
          {/* Login btn*/}
          <Button onClick={handleLogin} className="w-full mt-4">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
