import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary: ", error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="max-w-2xl w-full mx-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                            {/* Error Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                                <svg
                                    className="h-10 w-10 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            {/* Error Title */}
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                Something went wrong
                            </h1>

                            {/* Error Message */}
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                We encountered an unexpected error. This has been logged and our team has been notified. 
                                Please try refreshing the page or return to the dashboard.
                            </p>

                            {/* Error Details (Development only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mb-6 text-left bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-auto">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Error Details (Development)
                                    </summary>
                                    <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack && (
                                            <div className="mt-2 text-gray-600 dark:text-gray-400">
                                                {this.state.errorInfo.componentStack}
                                            </div>
                                        )}
                                    </pre>
                                </details>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={this.handleReload}
                                    className="w-full sm:w-auto btn bg-violet-500 hover:bg-violet-600 text-white"
                                >
                                    <svg
                                        className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                                        />
                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                                    </svg>
                                    Reload Page
                                </button>

                                <Link
                                    to="/"
                                    onClick={this.handleGoHome}
                                    className="w-full sm:w-auto btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    <svg
                                        className="w-4 h-4 fill-current shrink-0 mr-2 inline-block"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                                    </svg>
                                    Go to Dashboard
                                </Link>
                            </div>

                            {/* Help Text */}
                            <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                                If the problem persists, please contact support or try logging out and back in.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
