import React from 'react';

export default function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</p>
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>}
        </div>
    );
}
