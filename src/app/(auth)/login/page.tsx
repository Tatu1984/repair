"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Phone,
  ShieldCheck,
  Bike,
  Building2,
  UserCog,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const roleIcons = {
  rider: Bike,
  mechanic: Wrench,
  workshop: Building2,
  admin: UserCog,
};

const roleDescriptions = {
  rider: "Get roadside assistance in minutes",
  mechanic: "Accept jobs and earn on the go",
  workshop: "Manage your workshop and parts",
  admin: "Full platform administration",
};

export default function LoginPage() {
  const [role, setRole] = useState<"rider" | "mechanic" | "workshop" | "admin">("rider");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { sendOtp: sendOtpApi, verifyOtp: verifyOtpApi } = useAuth();

  useEffect(() => {
    if (otpSent && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [otpSent]);

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setError("");
    try {
      await sendOtpApi(phone, role);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;
    setIsLoading(true);
    setError("");
    try {
      await verifyOtpApi(phone, otpValue, role);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const RoleIcon = roleIcons[role];

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" as const }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-foreground/10" />

        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-16 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        />
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-32 left-24 w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-60 right-32 w-12 h-12 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-white/5"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Repair Assist</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4">
              Roadside assistance,
              <br />
              <span className="text-white/80">reimagined.</span>
            </h1>

            <p className="text-lg text-white/70 mb-10 max-w-md">
              Connect with verified mechanics instantly. From flat tyres to engine
              trouble, help is just a tap away across 500+ cities in India.
            </p>

            <div className="space-y-4">
              {[
                { text: "Verified mechanics within 15 mins", icon: ShieldCheck },
                { text: "Transparent pricing, no hidden charges", icon: ChevronRight },
                { text: "Real-time tracking and updates", icon: ChevronRight },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Repair Assist</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Role Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Label className="mb-2 text-muted-foreground text-xs uppercase tracking-wider">
              Login as
            </Label>
            <Tabs
              value={role}
              onValueChange={(v) => {
                setRole(v as typeof role);
                setOtpSent(false);
                setOtp(["", "", "", "", "", ""]);
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="rider" className="flex-1 gap-1.5">
                  <Bike className="h-3.5 w-3.5" />
                  Rider
                </TabsTrigger>
                <TabsTrigger value="mechanic" className="flex-1 gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  Mechanic
                </TabsTrigger>
                <TabsTrigger value="workshop" className="flex-1 gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  Workshop
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex-1 gap-1.5">
                  <UserCog className="h-3.5 w-3.5" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Role Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3"
            >
              <RoleIcon className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {roleDescriptions[role]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* Phone Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground shrink-0">
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={otpSent}
                  className="flex-1"
                />
              </div>
            </div>

            {!otpSent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Enter OTP</Label>
                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp(["", "", "", "", "", ""]);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Change number
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      OTP sent to +91 {phone}
                    </p>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Input
                            ref={(el) => {
                              otpRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="h-12 w-12 text-center text-lg font-semibold"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Didn&apos;t receive OTP?
                      </span>
                      <button
                        className="text-primary hover:underline font-medium"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleVerifyOtp}
                    disabled={otp.join("").length !== 6 || isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                      />
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Quick Demo Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <Button
              variant="secondary"
              className="w-full gap-2"
              size="lg"
              onClick={async () => {
                setIsLoading(true);
                setError("");
                try {
                  await sendOtpApi("9999999999", "admin");
                  await verifyOtpApi("9999999999", "123456", "admin");
                  router.push("/dashboard");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Demo login failed");
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
              Quick Demo Login (Skip OTP)
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Button variant="outline" className="w-full" size="lg">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </motion.div>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Register here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
