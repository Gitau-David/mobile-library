import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Login() {
    const { setToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast]       = useState(null);
    const [loading, setLoading]   = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setToast({ message: 'Please fill in both fields.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const res  = await apiFetch('/api/auth/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            setToken(data.token);
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-slate-100">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">📚</div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">NGO Mobile Library</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Circulation Engine — Authentication</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="Enter username"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white text-sm font-semibold py-3 px-4 rounded-lg shadow-md transition-all"
                    >
                        {loading ? 'Authenticating…' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Default: <span className="font-mono">librarian</span> / <span className="font-mono">password123</span>
                </p>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
