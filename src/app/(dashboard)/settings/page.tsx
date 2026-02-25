"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Bell,
  Shield,
  IndianRupee,
  Globe,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  usePlatformConfig,
  useUpdatePlatformConfig,
} from "@/lib/hooks/use-admin";

// ---------- Toggle Switch ----------

function ToggleSwitch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ---------- Loading Skeleton ----------

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-96" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-36" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Error State ----------

function SettingsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage platform configuration, commissions, and policies
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="text-destructive mb-4 size-12" />
          <h3 className="text-lg font-semibold">Failed to load settings</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            There was a problem fetching the platform configuration. Please try
            again.
          </p>
          <Button onClick={onRetry} className="mt-6 gap-2" variant="outline">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Component ----------

export default function SettingsPage() {
  const { data: config, isLoading, isError, refetch } = usePlatformConfig();
  const updateConfig = useUpdatePlatformConfig();

  // General
  const [platformName, setPlatformName] = useState("RepairAssist");
  const [supportEmail, setSupportEmail] = useState("support@repairassist.in");
  const [supportPhone, setSupportPhone] = useState("+91 1800-123-4567");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("INR");

  // Commission
  const [serviceCommission, setServiceCommission] = useState("15");
  const [partsCommission, setPartsCommission] = useState("10");
  const [lateNightEnabled, setLateNightEnabled] = useState(true);
  const [lateNightSurcharge, setLateNightSurcharge] = useState("25");
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  const [emergencySurcharge, setEmergencySurcharge] = useState("30");
  const [minimumFee, setMinimumFee] = useState("149");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Verification
  const [autoApprove, setAutoApprove] = useState(false);
  const [requireAadhaar, setRequireAadhaar] = useState(true);
  const [requirePAN, setRequirePAN] = useState(true);
  const [requireTradeLicense, setRequireTradeLicense] = useState(false);
  const [requirePhotoID, setRequirePhotoID] = useState(true);
  const [kycProvider, setKycProvider] = useState("digilocker");
  const [mechanicRadius, setMechanicRadius] = useState("15");

  // Initialize state from API data
  useEffect(() => {
    if (config) {
      setPlatformName(config.platformName || "RepairAssist");
      setSupportEmail(config.supportEmail || "");
      setSupportPhone(config.supportPhone || "");
      setLanguage(config.defaultLanguage || "en");
      setCurrency(config.defaultCurrency || "INR");
      setServiceCommission(String(config.serviceCommission ?? "15"));
      setPartsCommission(String(config.partsCommission ?? "10"));
      setLateNightEnabled(config.lateNightEnabled ?? true);
      setLateNightSurcharge(String(config.lateNightSurcharge ?? "25"));
      setEmergencyEnabled(config.emergencyEnabled ?? true);
      setEmergencySurcharge(String(config.emergencySurcharge ?? "30"));
      setMinimumFee(String(config.minimumServiceFee ?? "149"));
      setAutoApprove(config.autoApproveMechanics ?? false);
      setRequireAadhaar(config.requireAadhaar ?? true);
      setRequirePAN(config.requirePAN ?? true);
      setRequireTradeLicense(config.requireTradeLicense ?? false);
      setRequirePhotoID(config.requirePhotoID ?? true);
      setKycProvider(config.kycProvider || "digilocker");
      setMechanicRadius(String(config.mechanicRadiusKm ?? "15"));
    }
  }, [config]);

  // Save handlers
  const handleSaveGeneral = () => {
    updateConfig.mutate(
      {
        platformName,
        supportEmail,
        supportPhone,
        defaultLanguage: language,
        defaultCurrency: currency,
      },
      {
        onSuccess: () => {
          toast.success("Settings saved successfully");
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      }
    );
  };

  const handleSaveCommission = () => {
    updateConfig.mutate(
      {
        serviceCommission: Number(serviceCommission),
        partsCommission: Number(partsCommission),
        lateNightEnabled,
        lateNightSurcharge: Number(lateNightSurcharge),
        emergencyEnabled,
        emergencySurcharge: Number(emergencySurcharge),
        minimumServiceFee: Number(minimumFee),
      },
      {
        onSuccess: () => {
          toast.success("Settings saved successfully");
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      }
    );
  };

  const handleSaveNotifications = () => {
    // Save notification preferences to local storage for now
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "repair-assist-notif-prefs",
        JSON.stringify({ emailNotif, smsNotif, pushNotif, marketingEmails })
      );
    }
    toast.success("Notification preferences saved");
  };

  const handleSaveVerification = () => {
    updateConfig.mutate(
      {
        autoApproveMechanics: autoApprove,
        requireAadhaar,
        requirePAN,
        requireTradeLicense,
        requirePhotoID,
        kycProvider,
        mechanicRadiusKm: Number(mechanicRadius),
      },
      {
        onSuccess: () => {
          toast.success("Settings saved successfully");
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return <SettingsLoadingSkeleton />;
  }

  // Error state
  if (isError) {
    return <SettingsErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage platform configuration, commissions, and policies
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-1.5">
            <Globe className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="commission" className="gap-1.5">
            <IndianRupee className="size-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-1.5">
            <Shield className="size-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        {/* ========== General Tab ========== */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform information and defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      placeholder="e.g. RepairAssist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-phone">Support Phone</Label>
                    <Input
                      id="support-phone"
                      type="tel"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      placeholder="+91 1800-XXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="default-language" className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="default-currency" className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={handleSaveGeneral}
                    disabled={updateConfig.isPending}
                  >
                    {updateConfig.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ========== Commission Tab ========== */}
        <TabsContent value="commission">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Commission &amp; Pricing</CardTitle>
                <CardDescription>
                  Set platform commission rates and surcharges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Service Commission */}
                  <div className="space-y-2">
                    <Label htmlFor="service-commission">
                      Service Commission Rate (%)
                    </Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="service-commission"
                        type="range"
                        min="0"
                        max="50"
                        value={serviceCommission}
                        onChange={(e) => setServiceCommission(e.target.value)}
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                      />
                      <span className="w-12 text-center text-sm font-semibold">
                        {serviceCommission}%
                      </span>
                    </div>
                  </div>

                  {/* Parts Commission */}
                  <div className="space-y-2">
                    <Label htmlFor="parts-commission">
                      Parts Sale Commission Rate (%)
                    </Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="parts-commission"
                        type="range"
                        min="0"
                        max="50"
                        value={partsCommission}
                        onChange={(e) => setPartsCommission(e.target.value)}
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                      />
                      <span className="w-12 text-center text-sm font-semibold">
                        {partsCommission}%
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Surcharges */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Late Night Surcharge */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Late Night Surcharge
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Applied between 11 PM - 6 AM
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={lateNightEnabled}
                        onCheckedChange={setLateNightEnabled}
                      />
                    </div>
                    {lateNightEnabled && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="late-night-pct">Surcharge (%)</Label>
                        <Input
                          id="late-night-pct"
                          type="number"
                          value={lateNightSurcharge}
                          onChange={(e) =>
                            setLateNightSurcharge(e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>

                  {/* Emergency Surcharge */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Emergency Surcharge
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Applied for emergency priority requests
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={emergencyEnabled}
                        onCheckedChange={setEmergencyEnabled}
                      />
                    </div>
                    {emergencyEnabled && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="emergency-pct">Surcharge (%)</Label>
                        <Input
                          id="emergency-pct"
                          type="number"
                          value={emergencySurcharge}
                          onChange={(e) =>
                            setEmergencySurcharge(e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Minimum Fee */}
                <div className="max-w-sm space-y-2">
                  <Label htmlFor="min-fee">
                    Minimum Service Fee (INR)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {"\u20B9"}
                    </span>
                    <Input
                      id="min-fee"
                      type="number"
                      value={minimumFee}
                      onChange={(e) => setMinimumFee(e.target.value)}
                      className="w-40"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={handleSaveCommission}
                    disabled={updateConfig.isPending}
                  >
                    {updateConfig.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ========== Notifications Tab ========== */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when notifications are sent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Email Notifications */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-muted-foreground text-xs">
                      Send email alerts for breakdowns, updates, and reports
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={emailNotif}
                    onCheckedChange={setEmailNotif}
                  />
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">SMS Notifications</p>
                    <p className="text-muted-foreground text-xs">
                      Send SMS alerts to mechanics and customers
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={smsNotif}
                    onCheckedChange={setSmsNotif}
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-muted-foreground text-xs">
                      In-app push notifications for real-time updates
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={pushNotif}
                    onCheckedChange={setPushNotif}
                  />
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Marketing Emails</p>
                    <p className="text-muted-foreground text-xs">
                      Promotional emails, offers, and platform newsletters
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>

                <Separator />

                {/* Notification Templates */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Notification Templates</p>
                  <p className="text-muted-foreground text-xs">
                    Templates used for automated notifications. Changes apply to
                    all future notifications.
                  </p>
                  <div className="grid gap-3">
                    {[
                      { label: "Breakdown Alert", desc: "Sent when a new breakdown is created", defaultMsg: "New breakdown request #{id} from {rider} at {location}" },
                      { label: "Status Update", desc: "Sent when breakdown status changes", defaultMsg: "Your breakdown #{id} status changed to {status}" },
                      { label: "Mechanic Assigned", desc: "Sent when mechanic is assigned", defaultMsg: "Mechanic {mechanic} has been assigned to your request #{id}" },
                    ].map((tmpl) => (
                      <div key={tmpl.label} className="rounded-lg border p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{tmpl.label}</p>
                          <Badge variant="secondary" className="text-[10px]">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tmpl.desc}</p>
                        <p className="text-xs font-mono bg-muted rounded px-2 py-1.5">{tmpl.defaultMsg}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={handleSaveNotifications}
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ========== Verification Tab ========== */}
        <TabsContent value="verification">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Mechanic Verification</CardTitle>
                <CardDescription>
                  Configure mechanic onboarding and verification requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto-approve */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Auto-approve Mechanics
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Automatically approve mechanics after document
                      verification passes
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={autoApprove}
                    onCheckedChange={setAutoApprove}
                  />
                </div>

                <Separator />

                {/* Required Documents */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">
                      Required Documents
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Select which documents mechanics must provide during
                      registration
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Shield className="text-muted-foreground size-4" />
                        <span className="text-sm">Aadhaar Card</span>
                      </div>
                      <ToggleSwitch
                        checked={requireAadhaar}
                        onCheckedChange={setRequireAadhaar}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Shield className="text-muted-foreground size-4" />
                        <span className="text-sm">PAN Card</span>
                      </div>
                      <ToggleSwitch
                        checked={requirePAN}
                        onCheckedChange={setRequirePAN}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Shield className="text-muted-foreground size-4" />
                        <span className="text-sm">Trade License</span>
                      </div>
                      <ToggleSwitch
                        checked={requireTradeLicense}
                        onCheckedChange={setRequireTradeLicense}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Shield className="text-muted-foreground size-4" />
                        <span className="text-sm">Photo ID</span>
                      </div>
                      <ToggleSwitch
                        checked={requirePhotoID}
                        onCheckedChange={setRequirePhotoID}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* KYC Provider & Radius */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="kyc-provider">
                      KYC Verification Provider
                    </Label>
                    <Select value={kycProvider} onValueChange={setKycProvider}>
                      <SelectTrigger id="kyc-provider" className="w-full">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digilocker">DigiLocker</SelectItem>
                        <SelectItem value="aadhaar-bridge">
                          Aadhaar Bridge
                        </SelectItem>
                        <SelectItem value="signzy">Signzy</SelectItem>
                        <SelectItem value="hyperverge">HyperVerge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mechanic-radius">
                      Mechanic Radius Limit (km)
                    </Label>
                    <Input
                      id="mechanic-radius"
                      type="number"
                      value={mechanicRadius}
                      onChange={(e) => setMechanicRadius(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-40"
                    />
                    <p className="text-muted-foreground text-xs">
                      Maximum distance a mechanic can be assigned from the
                      breakdown location
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={handleSaveVerification}
                    disabled={updateConfig.isPending}
                  >
                    {updateConfig.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
