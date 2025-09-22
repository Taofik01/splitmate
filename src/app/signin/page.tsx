'use client';

import React, { FormEvent, useState } from 'react';
import {
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
  Chrome,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { toast } from 'react-toastify';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';


const SplitMateSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  interface FormData {
    email: string;
    password: string;
  }

  interface Errors {
    email?: string;
    password?: string;
    general?: string;
    [key: string]: string | undefined;
  }

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const notify = () => toast("Welcome back!", {
    autoClose: 3000,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(1); // 1: form, 2: success

  const router = useRouter();

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

  const handleInputChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCred = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        if (!userCred) {
          throw new Error('Login failed');
        }

        notify();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTimeout(() => {

          setStep(2);
        }, 1500);

      } catch (error) {
        console.error('Sign in error: ', error);
        setErrors({ email: 'Invalid email or password' });
        toast.error('Invalid email or password', {
          autoClose: 300,
        });
      } finally {
        setIsLoading(false);
        setFormData({
          email: '',
          password: ','
        })
      }
    }
  };


  const handleGoogleSignUp = async (): Promise<void> => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      setTimeout(() => {

        setStep(2);
      }, 1500);

    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGithubSignUp = async (): Promise<void> => {
    const provider = new GithubAuthProvider();

    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      setTimeout(() => {

        setStep(2);
      }, 1500);
    } catch (error) {
      console.error('Github sign in error: ', error);
    } finally {
      setIsLoading(false);
    }

  }



  const SuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome back!</h1>
          <p className="text-gray-600 mb-8">
            You&apos;ve successfully signed in to your SplitMate account.
          </p>
          <Link href='/dashboard' className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300" >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  if (step === 2) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href='/' className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={handleHomeClick}>
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">SplitMate</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href='/signup' className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your SplitMate account</p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in-up">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Social Sign In Options */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleSignUp}
             
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:scale-105 active:scale-95 animate-slide-in-left"
              style={{ animationDelay: '0.1s' }}
            >
              {socialLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <Chrome className="w-5 h-5 text-red-500 mr-3" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            <button
              onClick={handleGithubSignUp}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:scale-105 active:scale-95 animate-slide-in-left"
              style={{ animationDelay: '0.2s' }}
            >
              {socialLoading === 'github' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <Github className="w-5 h-5 text-gray-800 mr-3" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {socialLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-500">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.7s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 active:scale-95'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
// day 1 of oeak fooling i know this will be short though! 
export default SplitMateSignIn;