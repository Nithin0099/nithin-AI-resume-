import React, { useState, useMemo } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    };
  };

  const passwordValidation = useMemo(() => 
    validatePassword(formData.password), 
    [formData.password]
  );

  const isPasswordValid = useMemo(() => 
    Object.values(passwordValidation).every(condition => condition),
    [passwordValidation]
  );

  const isFormValid = useMemo(() => {
    return (
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password === formData.confirmPassword &&
      isPasswordValid
    );
  }, [formData, isPasswordValid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mark all fields as touched to show validation errors
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
  
    // Exit if form is invalid
    if (!isFormValid) {
      return;
    }
  
    try {
      // Send form data to the backend
      const response = await fetch('http://localhost:5000/api/auth/createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log('Signup successful');
        // Optional: Redirect to login page or show a success message
        alert('Account created successfully! Please log in.');
        // Example redirect: window.location.href = '/login';
      } else {
        console.error('Signup error:', data.error);
        alert(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('An error occurred. Please check your connection and try again.');
    }
  };

  // New function to check if any validation is failing
  const hasPasswordErrors = () => {
    return !Object.values(passwordValidation).every(condition => condition) || 
           formData.password !== formData.confirmPassword;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        {/* Social Signup Buttons */}
        <div className="space-y-3 mb-4">
          <button 
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="mr-2 text-xl" />
            Continue with Google
          </button>
          
          <button 
            className="w-full flex items-center justify-center bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaLinkedin className="mr-2 text-xl" />
            Continue with LinkedIn
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                ${touched.username && formData.username.trim() === '' 
                  ? 'border-red-500' 
                  : 'border-gray-300'
                }`}
            />
            {touched.username && formData.username.trim() === '' && (
              <p className="text-red-500 text-xs mt-1">Username is required</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                ${touched.email && formData.email.trim() === '' 
                  ? 'border-red-500' 
                  : 'border-gray-300'
                }`}
            />
            {touched.email && formData.email.trim() === '' && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                ${touched.password && !isPasswordValid 
                  ? 'border-red-500' 
                  : 'border-gray-300'
                }`}
            />
            {touched.password && (
              <div className="mt-2 text-xs text-gray-600">
                Password must contain:
                <ul className="list-disc list-inside">
                  <li className={!passwordValidation.length ? 'text-red-500' : 'text-green-500'}>
                    At least 8 characters
                  </li>
                  <li className={!passwordValidation.lowercase ? 'text-red-500' : 'text-green-500'}>
                    At least 1 lowercase letter
                  </li>
                  <li className={!passwordValidation.uppercase ? 'text-red-500' : 'text-green-500'}>
                    At least 1 uppercase letter
                  </li>
                  <li className={!passwordValidation.number ? 'text-red-500' : 'text-green-500'}>
                    At least 1 number
                  </li>
                  <li className={!passwordValidation.specialChar ? 'text-red-500' : 'text-green-500'}>
                    At least 1 special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                ${touched.confirmPassword && formData.password !== formData.confirmPassword 
                  ? 'border-red-500' 
                  : 'border-gray-300'
                }`}
            />
            {touched.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            disabled={formData.password.length === 0 || hasPasswordErrors()}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${formData.password.length > 0 && !hasPasswordErrors()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 hover:bg-gray-300'
              }`}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;