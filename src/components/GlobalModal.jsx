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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-hidden outline-none focus:outline-none"
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black opacity-50"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative z-50 w-full mx-auto my-6 transition-all duration-300 ease-in-out transform scale-100 max-h-screen ${className}`}>
                {/* Modal Content */}
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    {/* Header */}
                    {title && (
                        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                            <h3 className="text-2xl font-semibold">{title}</h3>
                            <button
                                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="block w-6 h-6 text-2xl text-black bg-transparent hover:opacity-75">
                                    <IoClose />
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Body */}
                    <div className="relative w-full flex-auto p-6 overflow-y-auto max-h-[70vh] ">
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