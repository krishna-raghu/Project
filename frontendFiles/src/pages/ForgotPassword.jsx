import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // step 1: Email collection, step 2: OTP, step 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:8080/api/auth";

  // Step 1: Submit email to generate & trigger 4-digit code email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${BACKEND_URL}/forgot-password?email=${email}`, { method: 'POST' });
      if (response.ok) {
        setMessage({ type: 'success', text: 'A 4-digit verification code has been sent to your email.' });
        setStep(2);
      } else {
        setMessage({ type: 'error', text: 'Email address not registered.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server connectivity failure.' });
    }
    setLoading(false);
  };

  // Step 2: Validate the user's entered OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/verify-otp?email=${email}&otp=${otp}`, { method: 'POST' });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Identity verified. Please update your password.' });
        setStep(3);
      } else {
        setMessage({ type: 'error', text: 'Invalid or expired verification code.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification request timed out.' });
    }
    setLoading(false);
  };

  // Step 3: Change database entry to new credentials
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset successfully! Redirecting...' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: 'Session expired. Please restart the request.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to execute password update.' });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1d] flex items-center justify-center text-white font-sans">

      {/* Brand Navbar Tag positioned top-left exactly like Login page */}
      <div className="absolute top-6 left-8 flex items-center gap-3">
        <img
          src="/nervix-logo.png"
          alt="Nervix Logo"
          style={{ height: '32px', width: 'auto' }}
          className="filter invert brightness-200"
        />
        <span className="text-xl font-semibold tracking-wide text-gray-100">nervix</span>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-[#111827]/50 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-md">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter Code"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {step === 1 && "Enter your registered email below to receive a validation code."}
            {step === 2 && "We sent a 4-digit verification code to your email inbox."}
            {step === 3 && "Choose a strong password to secure your account access."}
          </p>
        </div>

        {/* Dynamic Status Notification Alert Callouts */}
        {message.text && (
          <div className={`p-3 rounded-lg text-sm mb-4 text-center ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.text}
          </div>
        )}

        {/* STEP 1: Request Verification Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0d1424] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              {loading ? 'Sending Code...' : 'Get Code'}
            </button>
          </form>
        )}

        {/* STEP 2: Submit 4-digit numeric verification box */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-center font-semibold tracking-wide">4-Digit Code</label>
              <input
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0000"
                className="w-full text-center tracking-widest text-2xl font-bold bg-[#0d1424] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              Verify Identity
            </button>
          </form>
        )}

        {/* STEP 3: Setup final credentials input */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1424] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1424] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              Reset Password
            </button>
          </form>
        )}

        {/* Footer Navigation Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Remember password? <Link to="/" className="text-blue-500 hover:underline font-medium">Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;