import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function Reports() {
    const { token } = useContext(AuthContext);
    const [reportType, setReportType] = useState('outstanding');
    const [data, setData]             = useState([]);

    useEffect(() => {
        apiFetch(`/api/reports/data?type=${reportType}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(d => setData(d));
    }, [reportType, token]);

    const handleExport = () => {
        const headers = reportType === 'outstanding'
            ? ['TX ID', 'Book ID', 'Title', 'Student', 'Checkout School']
            : ['TX ID', 'Title', 'Student', 'Checkout School', 'Return School', 'Date', 'Status'];

        const rows = data.map(row =>
            reportType === 'outstanding'
                ? [`#TX-${row.id}`, row.book_id, row.title, row.student_name, row.checkout_school]
                : [`#TX-${row.id}`, row.title, row.student_name, row.checkout_school,
                   row.return_school || '—', new Date(row.borrow_date).toLocaleDateString(), row.status]
        );

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `report_${reportType}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Audit Reports</h3>
                    <p className="text-xs text-slate-500 font-medium">Track outstanding loans and full circulation history.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setReportType('outstanding')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${reportType === 'outstanding' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        ⚠️ Outstanding Loans
                    </button>
                    <button
                        onClick={() => setReportType('historical')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${reportType === 'historical' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        📜 Full History
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-all">
                        📊 Export CSV
                    </button>
                </div>
            </div>

            {/* Report table */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    {reportType === 'outstanding' ? (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                    <th className="p-3">TX ID</th>
                                    <th className="p-3">Book Barcode</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Student</th>
                                    <th className="p-3">Checkout Node</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map(row => (
                                    <tr key={row.id} className="hover:bg-red-50/20">
                                        <td className="p-3 font-mono text-slate-400">#TX-{row.id}</td>
                                        <td className="p-3 font-mono font-bold text-slate-600">{row.book_id}</td>
                                        <td className="p-3 font-semibold text-slate-900">{row.title}</td>
                                        <td className="p-3 font-medium text-slate-700">{row.student_name}</td>
                                        <td className="p-3 text-slate-500">🏢 {row.checkout_school}</td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-400 font-medium">
                                            ✅ All assets accounted for — no outstanding loans.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                    <th className="p-3">TX ID</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Student</th>
                                    <th className="p-3">Checkout Node</th>
                                    <th className="p-3">Return Node</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-mono text-slate-400">#TX-{row.id}</td>
                                        <td className="p-3 font-semibold text-slate-900">{row.title}</td>
                                        <td className="p-3 font-medium text-slate-600">{row.student_name}</td>
                                        <td className="p-3 text-slate-500">{row.checkout_school}</td>
                                        <td className="p-3 text-slate-500">{row.return_school || '—'}</td>
                                        <td className="p-3 font-mono text-slate-400">
                                            {new Date(row.borrow_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase
                                                ${row.status === 'Recovered'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-amber-100 text-amber-800'}`}>
                                                {row.status === 'Issued' ? 'Outstanding' : 'Recovered'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-center text-slate-400">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
