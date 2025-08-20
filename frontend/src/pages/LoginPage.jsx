// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required.";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!formData.password) newErrors.password = "Password is required.";
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage();
            return;
        }

        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setMessage('Login successful! You will be redirected shortly.');
            setErrors({});
            // Optional: Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-light-gray p-4 font-sans">
            <div className="flex bg-white rounded-2xl shadow-soft-lg w-full max-w-5xl overflow-hidden animate-fade-in-up">
                {/* Login Form (Left Side) */}
                <div className="w-full lg:w-1/2 md:w-1/2 p-5">
                    <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-1">Log in to your account</h1>
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">Sign in with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex space-x-4 mb-6">
                        <button className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                            <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5 mr-1" />
                            Google
                        </button>
                        <button className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                            <img src="https://www.apple.com/favicon.ico" alt="Apple logo" className="w-5 h-5 mr-2" />
                            Apple
                        </button>
                        <button className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                            <img src="https://www.facebook.com/favicon.ico" alt="Facebook logo" className="w-5 h-5 mr-2" />
                            Facebook
                        </button>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-blue hover:bg-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                        >
                            Log in
                        </button>
                        {message && <p className={`mt-2 text-center text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account yet?{' '}
                            <a href="/register" className="font-medium text-primary-blue hover:text-dark-blue transition-colors duration-200">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Image Section (Right Side) */}
                <div className="hidden lg:block md:block w-1/2">
                    <img
                        src="/src/assets/banner.webp"
                        alt="Login banner"
                        className="w-full h-full object-fill rounded-r-2xl"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1000x1200/f0f4f8/808696?text=Welcome+Back"; }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;