import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { AlertCircle, Mail } from "lucide-react";
import authService from "../../services/Authservice";
import { extractApiError } from "../../lib/apiError";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    "Check your email for a verification code, then enter it below."
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.verifyEmail({ email, otp });
      // Auto-login after successful verification
      if (password) {
        await authService.login({ email, password });
        navigate("/dashboard");
      } else {
        setInfo("Email verified. Please sign in.");
        navigate(`/login?redirect=/dashboard`);
      }
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Enter your email to resend the code.");
      return;
    }
    setResending(true);
    setError("");
    try {
      await authService.resendVerification(email);
      setInfo("A new verification code has been sent.");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-4 bg-white">
        <div className="text-center">
          <Mail className="mx-auto h-10 w-10 text-gray-700" />
          <h1 className="text-2xl font-bold mt-2">Verify your email</h1>
          <p className="text-sm text-gray-600 mt-1">{info}</p>
        </div>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
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
            <Label htmlFor="otp">Verification code (OTP)</Label>
            <Input
              id="otp"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
            />
          </div>
          <div>
            <Label htmlFor="password">Password (to sign in after verify)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Optional — leave blank to login manually"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify & continue"}
          </Button>
        </form>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend code"}
        </Button>
        <p className="text-center text-sm">
          <Link to="/login" className="underline">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}
