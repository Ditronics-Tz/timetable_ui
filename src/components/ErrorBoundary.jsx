import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.DEV) {
      console.error("SACAS ErrorBoundary caught error:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
          role="alert"
        >
          <Card className="max-w-lg w-full p-6 space-y-4 border shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-600">
              {this.state.error?.message ||
                "An unexpected error occurred while rendering this screen."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={this.handleReset}>
                Try again
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  this.handleReset();
                  if (typeof window !== "undefined") {
                    window.location.href = "/dashboard";
                  }
                }}
              >
                Return to dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
