import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Terjadi Kesalahan Sistem</h2>
          <p className="text-slate-600 mb-4">Aplikasi mengalami kendala pemuatan komponen.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;