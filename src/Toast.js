import React, { useState, useEffect } from 'react';

const Toast = ({ message, duration, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    return (
        <div
            className={`fixed bottom-20 right-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg ${
                visible ? 'block' : 'hidden'
            }`}
        >
            <div className="flex items-center justify-between">
                <p className="text-base">{message}</p>
                <button
                    className="ml-4 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Toast;
