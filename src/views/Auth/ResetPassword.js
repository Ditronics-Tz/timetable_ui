import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { AlertCircle } from "lucide-react";
import authService from "../../services/Authservice";
import { extractApiError } from "../../lib/apiError";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword({
        email,
        otp,
        new_password: newPassword,
      });
      navigate("/login");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-4 bg-white">
        <h1 className="text-2xl font-bold text-center">Reset password</h1>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            {error}
          </div>
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
          <div>
            <Label htmlFor="otp">Reset code (OTP)</Label>
            <Input id="otp" required value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Reset password"}
          </Button>
        </form>
        <p className="text-center text-sm">
          <Link to="/login" className="underline">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}
