import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Schools() {
    const { token } = useContext(AuthContext);
    const [schools, setSchools]   = useState([]);
    const [name, setName]         = useState('');
    const [location, setLocation] = useState('');
    const [toast, setToast]       = useState(null);

    const loadSchools = () => {
        apiFetch('/api/schools', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setSchools(data));
    };

    useEffect(() => { loadSchools(); }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name || !location) {
            setToast({ message: 'Name and location are required.', type: 'error' });
            return;
        }
        try {
            const res = await apiFetch('/api/schools', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body:    JSON.stringify({ name, location }),
            });
            if (!res.ok) throw new Error('Failed to add school');
            setToast({ message: 'School node registered.', type: 'success' });
            setName(''); setLocation('');
            loadSchools();
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add school form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Add School Node</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Institution Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. Gede Primary School" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. Gede, Kilifi" required />
                    </div>
                    <button type="submit"
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-lg transition-all">
                        Register Node
                    </button>
                </form>
            </div>

            {/* Schools table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Configured Deployments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="p-3">Node ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schools.map(sch => (
                                <tr key={sch.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-mono text-slate-500">#{sch.id}</td>
                                    <td className="p-3 font-bold text-slate-900">{sch.name}</td>
                                    <td className="p-3 font-medium text-slate-500">📍 {sch.location}</td>
                                </tr>
                            ))}
                            {schools.length === 0 && (
                                <tr><td colSpan="3" className="p-4 text-center text-slate-400">No schools registered yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
