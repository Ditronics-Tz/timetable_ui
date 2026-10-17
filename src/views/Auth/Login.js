import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/Authservice";
import { extractApiError } from "../../lib/apiError";
import { isAuthenticated } from "../../lib/auth";
import "../../styles/Login.css";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigate(redirect, { replace: true });
    }
  }, [navigate, searchParams]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigate(redirect);
    } catch (err) {
      setError(extractApiError(err) || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center auth-heading-enter">
          <h2 className="mt-6 text-center text-5xl font-bold text-white tracking-tight">
            SACAS
          </h2>
          <p className="mt-2 text-center text-xl text-gray-300">Timetable Generator</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 bg-white/95 backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked })
                  }
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-black hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link to="/register" className="font-medium text-black hover:underline">
              Register
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <Link to="/register-institution" className="font-medium text-black hover:underline">
              Register an institution
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Demo Accounts (Password: <code className="text-gray-800">password</code>)
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { label: "Super Admin", email: "admin@example.com", role: "super_admin" },
                { label: "Institution Admin", email: "instadmin@sacas.local", role: "administrator" },
                { label: "Academic Coordinator", email: "academic@sacas.local", role: "academic_coordinator" },
                { label: "Exam Coordinator", email: "exam@sacas.local", role: "exam_coordinator" },
                { label: "Lecturer (Staff)", email: "lecturer@sacas.local", role: "user" },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      email: acc.email,
                      password: "password",
                    }));
                    if (error) setError("");
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-100 text-left transition-colors"
                >
                  <span className="font-medium text-gray-800">{acc.label}</span>
                  <span className="text-gray-500 font-mono">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
