// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('/api/auth/profile', {
                    headers: { 'x-auth-token': token },
                });
                setUser(res.data);
            } catch (err) {
                setMessage(err.response?.data?.message || 'Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading profile...</div>;
    if (!user) return <div className="text-center mt-8 text-red-500">{message}</div>;

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-8 border rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default ProfilePage;