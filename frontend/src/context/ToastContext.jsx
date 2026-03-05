import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import socket from '../socket';
import { Bell, Info, CheckCircle, AlertCircle, X } from 'lucide-react';
import '../components/Toast/Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, onClose }) => {
    const icons = {
        newItem: <Bell size={20} color="var(--primary)" />,
        itemResolved: <CheckCircle size={20} color="var(--success)" />,
        info: <Info size={20} color="var(--info)" />,
        error: <AlertCircle size={20} color="var(--danger)" />
    };

    return (
        <div className={`toastItem toast-${type}`}>
            <div className="toastIcon">{icons[type] || icons.info}</div>
            <div className="toastContent">
                <p>{message}</p>
            </div>
            <button onClick={onClose} className="toastClose">
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('globalActivity', (data) => {
                if (data.type === 'newItem') {
                    addToast(`New ${data.item.type} item: "${data.item.title}" in ${data.item.location}`, 'newItem');
                } else if (data.type === 'itemResolved') {
                    addToast(`Success! Item reunited: "${data.item.title}"`, 'itemResolved');
                }
            });

            return () => socket.off('globalActivity');
        }
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toastContainer">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
