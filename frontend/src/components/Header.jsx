import { useState } from "react";
import { login, signUp, logout, resendVerificationEmail, sendPasswordReset } from "../services/authService";

export default function Header({ user, emailVerified }) {
    const [emailPrefix, setEmailPrefix] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);

    let username = user ? (user.displayName || user.email) : "Guest";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);
        
        const fullEmail = `${emailPrefix}@lion.lmu.edu`;
        
        try {
            if (isSignUp) {
                await signUp(fullEmail, password);
                setSuccessMessage("Account created! Please check your email to verify your account before signing in.");
                setIsSignUp(false);
                setEmailPrefix("");
                setPassword("");
            } else {
                await login(fullEmail, password);
                setEmailPrefix("");
                setPassword("");
                setShowLoginForm(false);
            }
        } catch (err) {
            setError(err.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResendingVerification(true);
        setError("");
        try {
            await resendVerificationEmail();
            setSuccessMessage("Verification email sent! Please check your inbox.");
        } catch (err) {
            setError(err.message || "Failed to resend verification email. Please try again.");
        } finally {
            setIsResendingVerification(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setError("");
        try {
            await logout();
        } catch (err) {
            setError(err.message || "Logout failed. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSendingPasswordReset(true);
        
        const fullEmail = `${emailPrefix}@lion.lmu.edu`;
        
        try {
            await sendPasswordReset(fullEmail);
            setSuccessMessage("Password reset email sent! Please check your inbox and follow the instructions to reset your password.");
            setShowForgotPassword(false);
            setEmailPrefix("");
        } catch (err) {
            setError(err.message || "Failed to send password reset email. Please try again.");
        } finally {
            setIsSendingPasswordReset(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg border-b border-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
                            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg hover:scale-110 transition-transform duration-200 cursor-default">LMU</span>
                            <span className="text-white hover:scale-110 transition-transform duration-200 inline-block cursor-default">Hub</span>
                        </h1>
                        {user && (
                            <span className="hidden sm:inline text-sm sm:text-base text-blue-100">
                                Hello, <span className="font-semibold text-white">{username}</span>
                            </span>
                        )}
            </div>
            {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {!emailVerified && (
                        <button 
                            onClick={handleResendVerification}
                            disabled={isResendingVerification}
                            className="px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed disabled:opacity-70 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center space-x-1 sm:space-x-2"
                        >
                            {isResendingVerification ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Sending...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="hidden sm:inline">Resend Verification</span>
                                    <span className="sm:hidden">Resend</span>
                                </>
                            )}
                        </button>
                    )}
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="px-4 sm:px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center space-x-2"
                    >
                        {isLoggingOut ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Logging out...</span>
                            </>
                        ) : (
                            <span>Logout</span>
                        )}
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <button 
                        onClick={() => {
                            if (!showLoginForm) {
                                setIsSignUp(false);
                                setShowForgotPassword(false);
                                setError("");
                                setSuccessMessage("");
                                setEmailPrefix("");
                                setPassword("");
                            }
                            setShowLoginForm(!showLoginForm);
                        }}
                                className="px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                        Login
                    </button>
                    {showLoginForm && (
                                <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-2xl p-6 w-80 sm:w-96 z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {showForgotPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Sign In")}
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    setShowLoginForm(false);
                                                    setShowForgotPassword(false);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        {showForgotPassword ? (
                                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            value={emailPrefix}
                                                            onChange={(e) => setEmailPrefix(e.target.value)}
                                                            placeholder="your.email"
                                                            required
                                                            disabled={isSendingPasswordReset}
                                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all hover:border-gray-400 focus:shadow-sm"
                                                        />
                                                        <span className="px-3 py-2.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 text-sm font-medium whitespace-nowrap">
                                                            @lion.lmu.edu
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Enter your email address and we'll send you a link to reset your password.
                                                </p>
                                                {successMessage && (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                                                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                                                    </div>
                                                )}
                                                {error && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                                                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                                    </div>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={isSendingPasswordReset}
                                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                                                >
                                                    {isSendingPasswordReset ? (
                                                        <>
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span>Sending...</span>
                                                        </>
                                                    ) : (
                                                        <span>Send Reset Link</span>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowForgotPassword(false);
                                                        setError("");
                                                        setSuccessMessage("");
                                                        setEmailPrefix("");
                                                    }}
                                                    disabled={isSendingPasswordReset}
                                                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:text-gray-400"
                                                >
                                                    Back to Sign In
                                                </button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={emailPrefix}
                                            onChange={(e) => setEmailPrefix(e.target.value)}
                                            placeholder="your.email"
                                            required
                                                        disabled={isLoading}
                                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all hover:border-gray-400 focus:shadow-sm"
                                        />
                                                    <span className="px-3 py-2.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 text-sm font-medium whitespace-nowrap">
                                            @lion.lmu.edu
                                        </span>
                                    </div>
                                </div>
                                <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all hover:border-gray-400 focus:shadow-sm"
                                    />
                                    {!isSignUp && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForgotPassword(true);
                                                setError("");
                                                setSuccessMessage("");
                                                setPassword("");
                                            }}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                {successMessage && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                                disabled={isLoading}
                                                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>{isSignUp ? "Creating account..." : "Signing in..."}</span>
                                                    </>
                                                ) : (
                                                    <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                                                )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setShowForgotPassword(false);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                                disabled={isLoading}
                                                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:text-gray-400"
                                >
                                    {isSignUp 
                                        ? "Already have an account? Sign in" 
                                        : "Don't have an account? Sign up"}
                                </button>
                            </form>
                        )}
                        </div>
                    )}
                </div>
            )}
                </div>
            </div>
        </header>
    );
}
