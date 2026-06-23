import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Students() {
    const { token } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [schools, setSchools]   = useState([]);
    const [search, setSearch]     = useState('');
    const [id, setId]             = useState('');
    const [name, setName]         = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [toast, setToast]       = useState(null);

    const loadStudents = () => {
        apiFetch(`/api/students?search=${search}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setStudents(data));
    };

    useEffect(() => {
        loadStudents();
        apiFetch('/api/schools', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            setSchools(data);
            if (data.length > 0) setSchoolId(data[0].id);
        });
    }, [search, token]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!id || !name || !schoolId) {
            setToast({ message: 'All fields are required.', type: 'error' });
            return;
        }
        try {
            const res = await apiFetch('/api/students', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body:    JSON.stringify({ id, name, school_id: schoolId }),
            });
            if (!res.ok) throw new Error('Failed to register student');
            setToast({ message: 'Student registered successfully.', type: 'success' });
            setId(''); setName('');
            loadStudents();
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    const handleDelete = async (targetId) => {
        if (!window.confirm(`Remove student ${targetId}?`)) return;
        await apiFetch(`/api/students/${targetId}`, {
            method:  'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        setToast({ message: 'Student removed.', type: 'success' });
        loadStudents();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registration form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Register Student</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Student ID / Barcode</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. STU004" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. Mary Atieno" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">School Node</label>
                        <select value={schoolId} onChange={e => setSchoolId(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800">
                            {schools.map(sch => <option key={sch.id} value={sch.id}>{sch.name}</option>)}
                        </select>
                    </div>
                    <button type="submit"
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-lg transition-all">
                        Register Student
                    </button>
                </form>
            </div>

            {/* Students table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Active Students</h3>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        className="text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        placeholder="🔍 Search ID or name…" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="p-3">Token ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">School Node</th>
                                <th className="p-3">Status</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(std => (
                                <tr key={std.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-mono font-bold text-slate-600">{std.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{std.name}</td>
                                    <td className="p-3 text-slate-500">{std.school_name}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase">
                                            {std.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDelete(std.id)}
                                            className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-400">No students found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
