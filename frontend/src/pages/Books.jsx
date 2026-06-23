import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { apiFetch } from '../utils/api';

export default function Books() {
    const { token } = useContext(AuthContext);
    const [books, setBooks]   = useState([]);
    const [search, setSearch] = useState('');
    const [id, setId]         = useState('');
    const [title, setTitle]   = useState('');
    const [author, setAuthor] = useState('');
    const [toast, setToast]   = useState(null);

    const loadBooks = () => {
        apiFetch(`/api/books?search=${search}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setBooks(data));
    };

    useEffect(() => { loadBooks(); }, [search, token]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!id || !title || !author) {
            setToast({ message: 'All fields are required.', type: 'error' });
            return;
        }
        try {
            const res = await apiFetch('/api/books', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body:    JSON.stringify({ id, title, author }),
            });
            if (!res.ok) throw new Error('Failed to add book');
            setToast({ message: 'Book added to inventory.', type: 'success' });
            setId(''); setTitle(''); setAuthor('');
            loadBooks();
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add book form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Add Book to Inventory</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Barcode / ISBN</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. BKP005" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. Blossoms of the Savannah" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Author</label>
                        <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            placeholder="e.g. H.R. Ole Kulet" required />
                    </div>
                    <button type="submit"
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-lg transition-all">
                        Add to Inventory
                    </button>
                </form>
            </div>

            {/* Books table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Book Inventory</h3>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        className="text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        placeholder="🔍 Filter books…" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="p-3">Barcode</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Author</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {books.map(bk => (
                                <tr key={bk.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-mono font-bold text-slate-600">{bk.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{bk.title}</td>
                                    <td className="p-3 text-slate-500">{bk.author}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase
                                            ${bk.status === 'Available'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'}`}>
                                            {bk.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && (
                                <tr><td colSpan="4" className="p-4 text-center text-slate-400">No books found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
