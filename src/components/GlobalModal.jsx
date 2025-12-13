import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiCloseFill } from 'react-icons/ri';

const GlobalModal = ({
    isOpen,
    onClose,
    title,
    children,
    className = ''
}) => {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // If modal is not open, return null
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black opacity-50"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative z-50 w-full mx-auto my-auto transition-all duration-300 ease-in-out transform scale-100 max-h-[calc(100vh-2rem)] flex flex-col ${className}`}>
                {/* Modal Content */}
                <div className="relative flex flex-col w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-lg outline-none focus:outline-none max-h-full overflow-hidden">
                    {/* Header */}
                    {title && (
                        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-solid rounded-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 pr-4 break-words">{title}</h3>
                            <button
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                    )}

                    {/* Body - Scrollable */}
                    <div className="relative w-full flex-auto p-4 sm:p-6 overflow-y-auto overscroll-contain">
                        {children}
                    </div>

                    {/* Footer (optional) */}
                    {/* <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                        <button
                            className="px-4 py-2 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white"
                            type="button"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;