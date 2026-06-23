import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Layout({ children, setPage, currentPage }) {
    const { user, logout } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'borrow',    label: '📤 Issue Asset' },
        { id: 'return',    label: '📥 Distributed Return' },
        { id: 'students',  label: '👥 Students' },
        { id: 'schools',   label: '🏫 School Nodes' },
        { id: 'books',     label: '📚 Asset Inventory' },
        { id: 'reports',   label: '📈 Audit Reports' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">

            {/* ── Mobile overlay ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`w-64 bg-emerald-950 text-slate-100 flex-shrink-0 flex flex-col
                fixed md:relative z-30 h-full transition-transform duration-200
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

                <div className="p-6 border-b border-emerald-900">
                    <span className="text-lg font-bold tracking-tight text-white block">Mobile Library</span>
                    <span className="text-xs text-emerald-400 mt-0.5 font-mono block">Asset Tracker v2.0</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setPage(item.id); setMobileOpen(false); }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                ${currentPage === item.id
                                    ? 'bg-emerald-800 text-white shadow-inner'
                                    : 'text-slate-300 hover:bg-emerald-900/50 hover:text-white'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-emerald-900 bg-emerald-950/50 flex justify-between items-center text-xs">
                    <div>
                        <p className="font-semibold text-slate-200">{user?.name}</p>
                        <p className="text-emerald-500 font-mono text-[10px] uppercase">{user?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-1.5 bg-emerald-900 rounded hover:bg-red-900/50 text-white transition-colors"
                        title="Logout"
                    >
                        🚪
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:justify-end shadow-sm">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-slate-700 font-bold p-2 text-xl"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            OFFLINE-FIRST CORE: SYNCED
                        </span>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
