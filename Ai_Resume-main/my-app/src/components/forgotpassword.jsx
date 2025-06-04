import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PasswordResetForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [stage, setStage] = useState('request') // 'request', 'reset', 'success'
  const [error, setError] = useState('')

  const handleResetRequest = (e) => {
    e.preventDefault()
    
    // Simulated email validation
    if (email) {
      setStage('reset')
      setError('')
    } else {
      setError('Please enter a valid email')
    }
  }

  const handlePasswordReset = (e) => {
    e.preventDefault()
    
    // Password validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Simulated successful password reset
    setStage('success')
    setError('')
  }

  const handleReturnToLogin = () => {
    // Navigate to login page
    navigate('/login')
  }

  const renderRequestStage = () => (
    <form 
      onSubmit={handleResetRequest} 
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Reset Your Password
      </h2>
      <div className="mb-4">
        <label 
          className="block text-gray-700 text-sm font-bold mb-2" 
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter your email"
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs italic mb-4">{error}</p>
      )}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send Reset Link
        </button>
      </div>
    </form>
  )

  const renderResetStage = () => (
    <form 
      onSubmit={handlePasswordReset} 
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Create New Password
      </h2>
      <div className="mb-4">
        <label 
          className="block text-gray-700 text-sm font-bold mb-2" 
          htmlFor="password"
        >
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter new password"
          required
        />
      </div>
      <div className="mb-4">
        <label 
          className="block text-gray-700 text-sm font-bold mb-2" 
          htmlFor="confirm-password"
        >
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Confirm new password"
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs italic mb-4">{error}</p>
      )}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reset Password
        </button>
      </div>
    </form>
  )

  const renderSuccessStage = () => (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        Password Reset Successful
      </h2>
      <p className="text-gray-700 mb-6">
        You can now log in with your new password.
      </p>
      <button
        onClick={handleReturnToLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Return to Login
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {stage === 'request' && renderRequestStage()}
      {stage === 'reset' && renderResetStage()}
      {stage === 'success' && renderSuccessStage()}
    </div>
  )
}