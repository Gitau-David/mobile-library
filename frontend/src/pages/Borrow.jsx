import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Borrow() {
    const { token } = useContext(AuthContext);
    const [studentId, setStudentId] = useState('');
    const [bookId, setBookId]       = useState('');
    const [schoolId, setSchoolId]   = useState('');
    const [schools, setSchools]     = useState([]);
    const [toast, setToast]         = useState(null);

    useEffect(() => {
        apiFetch('/api/schools', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            setSchools(data);
            if (data.length > 0) setSchoolId(data[0].id);
        });
    }, [token]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!studentId || !bookId || !schoolId) {
            setToast({ message: 'All fields are required.', type: 'error' });
            return;
        }
        try {
            const res = await apiFetch('/api/transactions/checkout', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body:    JSON.stringify({ student_id: studentId, book_id: bookId, school_id: schoolId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Checkout failed');
            setToast({ message: 'Book issued successfully.', type: 'success' });
            setBookId('');
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Issue Asset</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                    Link a book to a student at a school node.
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Current School Node
                        </label>
                        <select
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        >
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Student Token ID
                        </label>
                        <input
                            type="text"
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. STU001"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Book Barcode / Asset Code
                        </label>
                        <input
                            type="text"
                            value={bookId}
                            onChange={e => setBookId(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. BKP001"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        Issue Book
                    </button>
                </form>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
