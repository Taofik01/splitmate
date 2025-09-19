'use client';

import React, { FormEvent, useState } from 'react';
import { 
  Users, 
  Mail, 
  Lock, 
  User as LucideUser,  // so as not to clash with user authenthication  
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
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { toast } from 'react-toastify';
import { activatePendingGroupMembership } from '@/lib/actions/registerUser'
// import { extractUserInfo } from '../../utils/helpers'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User } from 'firebase/auth';



const SplitMateSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading] = useState(null);

  
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface Errors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
  } 

  

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(1); // 1: form, 2: success

  const router = useRouter();
    const notify = () => toast("Account created successfully! Welcome aboard!", {
    autoClose: 3000,
  });

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>

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



  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
     errors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  




const syncUserToFirestore = async (user: { uid: string; email: string | null; name: string }) => {
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name: user.name,
    createdAt: new Date().toISOString()
  }, { merge: true });
};
const extractUserInfo = (user: User) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName || 'Anonymous'
});


  const handleSubmit = async (e: FormEvent<HTMLButtonElement>): Promise <void> => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await setPersistence(auth, browserLocalPersistence);
       const result =  await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const userInfo = extractUserInfo(result.user);

      // sync to firestore

      await syncUserToFirestore(userInfo);


         await activatePendingGroupMembership(formData.email);
      

      setFormData({
        email: "",
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
      });
     

    setTimeout(() => {
      
      setStep(2);
    }, 1500);

      
    } catch (e) {
      console.error('Sign up error:', e)

      if (e instanceof Error) {
          if (e.message.includes('email-already-in-use')) {
            setErrors({ email: 'Email is already in use' });
            toast.error('Email is already in use', { autoClose: 3000 });
          } else if (e.message.includes('weak-password')) {
            setErrors({ password: 'Password is too weak' });
            toast.error('Password is too weak', { autoClose: 3000 });
          } else {
            setErrors({ email: 'An error occurred, please try again later' });
            toast.error('An error occurred, please try again later', { autoClose: 3000 });
          }
        }

    } finally {
       setIsLoading(false);
    }
    
  }
  };



  const handleGoogleSignUp = async (): Promise<void> => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const userInfo = extractUserInfo(result.user);

      // sync to firestore

      await syncUserToFirestore(userInfo);
      const email = result.user?.email;
      if (email) {
        await activatePendingGroupMembership(email);
      }

      notify();

       setTimeout(() => {
      
      setStep(2);
    }, 1500);

      
    } catch (e) {
      console.error('Google sign up error: ', e)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async (): Promise<void> => {

    const provider = new GithubAuthProvider();
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const userInfo = extractUserInfo(result.user);
      // sync to firestore

      await syncUserToFirestore(userInfo);

      const email = result.user?.email;
      if (email) {
        await activatePendingGroupMembership(email);
      }
      setTimeout(() => {
      
      setStep(2);
     }, 1500);
    } catch (e) {
      console.error('Github sign up error: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SplitMate!</h1>
          <p className="text-gray-600 mb-8">
            Your account has been created successfully. You can now start splitting expenses with your friends.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </button>
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
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors" >
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
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Start splitting expenses with your friends today</p>
          </div>

          {/* Social Sign Up Options */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleSignUp}
              disabled={socialLoading === 'google'}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:scale-105 active:scale-95 animate-slide-in-left"
              style={{ animationDelay: '0.1s' }}
            >
              {socialLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <Chrome className="w-5 h-5 text-red-500 mr-3" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {socialLoading === 'google' ? 'Signing up...' : 'Continue with Google'}
              </span>
            </button>

            <button
              onClick={handleGithubSignUp}
              disabled={socialLoading === 'github'}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:scale-105 active:scale-95 animate-slide-in-left"
              style={{ animationDelay: '0.2s' }}
            >
              {socialLoading === 'github' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <Github className="w-5 h-5 text-gray-800 mr-3" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {socialLoading === 'github' ? 'Signing up...' : 'Continue with GitHub'}
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
                Or create account with email
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <LucideUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <LucideUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
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
                  className={`w-full pl-12 pr-4 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
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
            <div className="animate-slide-in-left" style={{ animationDelay: '0.7s' }}>
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
                  className={`w-full pl-12 pr-12 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Min. 8 characters"
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

            {/* Confirm Password */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 text-black bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.9s' }}>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="animate-slide-in-left" style={{ animationDelay: '1s' }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
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

export default SplitMateSignUp;