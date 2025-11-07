import React, { useState } from 'react';
import { User } from '../types';
import { userDB } from '../db';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
    onAdminLoginSuccess: () => void;
    onSignUp: (name: string, email: string, pass: string) => User | null;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-sent';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, onAdminLoginSuccess, onSignUp }) => {
    const [view, setView] = useState<AuthView>('login');
    const [error, setError] = useState<string | null>(null);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const usernameOrEmail = formState.email;
        const password = formState.password;

        // Admin Login Check
        if (usernameOrEmail === 'jaisonvarghese7005' && password === '101488') {
            onAdminLoginSuccess();
            return;
        }

        // Regular User Login Check
        const user = userDB.getUserByEmail(usernameOrEmail);
        if (user && userDB.verifyPassword(user, password)) {
            onLoginSuccess(user);
        } else {
            setError('Invalid username/email or password.');
        }
    };
    
    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.password !== formState.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formState.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        const newUser = onSignUp(formState.name, formState.email, formState.password);
        if (!newUser) {
            setError("An account with this email already exists.");
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd trigger a backend service here.
        // For security, we always show the same message, whether the user exists or not,
        // to prevent email enumeration attacks.
        console.log(`Password reset requested for: ${formState.email}. If user exists, an email would be sent.`);
        setView('reset-sent');
        setError(null);
    }
    
    const renderContent = () => {
        switch(view) {
            case 'login':
                return (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
                         <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Username or Email</label>
                            <input type="text" name="email" id="login-email" value={formState.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="login-password"className="block text-sm font-medium text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => { setView('forgot-password'); setError(null); }}
                                    className="text-sm font-medium text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input type="password" name="password" id="login-password" value={formState.password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                            Login
                        </button>
                    </form>
                );
            case 'signup':
                return (
                     <form onSubmit={handleSignUp} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create an Account</h2>
                         <div>
                            <label htmlFor="signup-name"className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="signup-name" value={formState.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="signup-email"className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="signup-email" value={formState.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                         <div>
                            <label htmlFor="signup-password"className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" id="signup-password" value={formState.password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="signup-confirmPassword"className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="signup-confirmPassword" value={formState.confirmPassword} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                         {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                            Create Account
                        </button>
                    </form>
                );
            case 'forgot-password':
                return (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
                        <p className="text-center text-sm text-gray-500">Enter your email address and we'll send you a link to reset your password.</p>
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="reset-email" value={formState.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
                        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                            Send Reset Link
                        </button>
                        <button type="button" onClick={() => { setView('login'); setError(null); }} className="w-full text-center text-sm font-medium text-green-600 hover:text-green-800">
                           &larr; Back to Login
                        </button>
                    </form>
                );
            case 'reset-sent':
                 return (
                    <div className="text-center space-y-4">
                         <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800">Check your email</h2>
                        <p className="text-gray-600">
                            If an account exists for <span className="font-medium text-gray-800">{formState.email}</span>, you will receive an email with instructions on how to reset your password.
                        </p>
                        <button type="button" onClick={() => { setView('login'); setError(null); }} className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            Back to Login
                        </button>
                    </div>
                 );
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {(view === 'login' || view === 'signup') && (
                    <div className="flex border-b">
                        <button 
                            onClick={() => { setView('login'); setError(null); }}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors ${view === 'login' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => { setView('signup'); setError(null); }}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors ${view === 'signup' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
                
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;