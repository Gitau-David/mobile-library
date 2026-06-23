import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
    const { token } = useContext(AuthContext);
    const [metrics, setMetrics] = useState({
        totalBooks: 0, borrowedBooks: 0,
        totalStudents: 0, totalSchools: 0, recoveryRate: 100,
    });

    useEffect(() => {
        apiFetch('/api/reports/metrics', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setMetrics(data))
        .catch(err => console.error(err));
    }, [token]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mission Operations Overview</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                    Real-time indicators across structural deployments in Kilifi County.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Asset Units"     value={metrics.totalBooks}      subtitle="Active physical books" />
                <StatCard title="Outbound Loans"        value={metrics.borrowedBooks}   subtitle="Currently in field rotation" />
                <StatCard title="Recovery Efficiency"   value={`${metrics.recoveryRate}%`} subtitle="Target baseline: >95%" />
                <StatCard title="Learners Tracked"      value={metrics.totalStudents}   subtitle="Registered active profiles" />
                <StatCard title="Active Deployments"    value={metrics.totalSchools}    subtitle="Operational school nodes" />
            </div>
        </div>
    );
}
