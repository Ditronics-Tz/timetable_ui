import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { AlertCircle } from "lucide-react";
import authService from "../../services/Authservice";
import { extractApiError } from "../../lib/apiError";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await authService.forgotPassword(email);
      setMessage(
        data?.message ||
          "If an account exists for that email, a reset code has been sent."
      );
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-4 bg-white">
        <h1 className="text-2xl font-bold text-center">Forgot password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your email and we&apos;ll send a reset code.
        </p>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-50 text-green-800 rounded text-sm">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset code"}
          </Button>
        </form>
        <div className="flex justify-between text-sm">
          <Link to="/login" className="underline">
            Login
          </Link>
          <Link
            to={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
            className="underline"
          >
            Have a code?
          </Link>
        </div>
      </Card>
    </div>
  );
}
