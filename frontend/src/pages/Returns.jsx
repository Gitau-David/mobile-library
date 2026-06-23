import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Returns() {
    const { token } = useContext(AuthContext);
    const [bookId, setBookId]             = useState('');
    const [returnSchoolId, setReturnSchoolId] = useState('');
    const [schools, setSchools]           = useState([]);
    const [toast, setToast]               = useState(null);

    useEffect(() => {
        apiFetch('/api/schools', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            setSchools(data);
            if (data.length > 0) setReturnSchoolId(data[0].id);
        });
    }, [token]);

    const handleReturn = async (e) => {
        e.preventDefault();
        if (!bookId || !returnSchoolId) {
            setToast({ message: 'Please provide a book barcode and receiving school.', type: 'error' });
            return;
        }
        try {
            const res = await apiFetch('/api/transactions/return', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body:    JSON.stringify({ book_id: bookId, return_school_id: returnSchoolId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Return failed');
            setToast({ message: 'Book returned successfully. Status updated to Recovered.', type: 'success' });
            setBookId('');
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Distributed Cross-Node Return</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                    Accept a book at any school node, regardless of where it was originally borrowed.
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleReturn} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Receiving School Node
                        </label>
                        <select
                            value={returnSchoolId}
                            onChange={e => setReturnSchoolId(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                        >
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                            Book Barcode
                        </label>
                        <input
                            type="text"
                            value={bookId}
                            onChange={e => setBookId(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                            placeholder="Scan or enter barcode…"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        Process Return
                    </button>
                </form>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
