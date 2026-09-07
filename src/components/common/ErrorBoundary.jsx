import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center shadow-2xl border border-red-500/20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-2">
              Something went sideways
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              We encountered an unexpected rendering condition. Your session and data are secure.
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-100 dark:bg-obsidian-800/80 p-3 rounded-xl text-xs font-mono text-red-500 dark:text-red-400 mb-6 text-left break-words">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-lg shadow-brand-600/25"
              >
                <RefreshCw className="w-4 h-4" />
                Reload View
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-obsidian-800 hover:bg-slate-300 dark:hover:bg-obsidian-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all"
              >
                <Home className="w-4 h-4" />
                Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
