import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-retro-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-neon-red font-pixel text-xl mb-4">
              SYSTEM ERROR
            </h1>
            <p className="text-white font-pixel text-sm">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              className="mt-4 arcade-btn"
              onClick={() => window.location.reload()}
            >
              RELOAD SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
