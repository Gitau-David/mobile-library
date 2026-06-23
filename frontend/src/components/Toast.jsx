import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass = type === 'error' ? 'bg-red-600' : 'bg-emerald-800';

    return (
        <div className={`fixed bottom-5 right-5 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl ${bgClass} z-50`}>
            {message}
        </div>
    );
}
