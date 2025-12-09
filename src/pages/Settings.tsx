import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Download, Save, Loader2, Upload, Shield, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load avatar on mount
  useState(() => {
    const loadAvatar = async () => {
      if (!user) return;
      
      const { data } = await supabase.storage
        .from("avatars")
        .list(user.id);
      
      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(`${user.id}/${data[0].name}`);
        setAvatarUrl(urlData.publicUrl);
      }
    };
    loadAvatar();
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    
    // Delete existing avatar first
    const { data: existingFiles } = await supabase.storage
      .from("avatars")
      .list(user.id);
    
    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage
        .from("avatars")
        .remove(existingFiles.map(f => `${user.id}/${f.name}`));
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error("Failed to upload avatar");
      console.error(error);
    } else {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      setAvatarUrl(urlData.publicUrl + `?t=${Date.now()}`);
      toast.success("Avatar uploaded successfully");
    }
    
    setUploading(false);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error("Failed to update password");
      console.error(error);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  const handleExport = async () => {
    setExporting(true);
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("deadline", { ascending: true });

    if (error) {
      toast.error("Failed to export tasks");
      setExporting(false);
      return;
    }

    const csvContent = [
      ["Title", "Description", "Category", "Priority", "Deadline", "Completed", "Created At"].join(","),
      ...(data || []).map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || "").replace(/"/g, '""')}"`,
        task.category || "general",
        task.priority,
        task.deadline,
        task.completed,
        task.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todoflow-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Tasks exported successfully");
    setExporting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader 
            title="Settings" 
            description="Manage your account and preferences"
          />

          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="shadow-soft border-border/50 animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profile</CardTitle>
                    <CardDescription>Your profile information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={avatarUrl || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50 h-11"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="shadow-soft border-border/50 animate-fade-in animation-delay-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/10 p-2.5">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 transition-smooth focus:shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 transition-smooth focus:shadow-soft"
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  disabled={saving || !newPassword || !confirmPassword}
                  className="w-full h-11 gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Data Section */}
            <Card className="shadow-soft border-border/50 animate-fade-in animation-delay-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-success/10 p-2.5">
                    <Database className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Data Management</CardTitle>
                    <CardDescription>Export your data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full h-11 gap-2"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export All Tasks (CSV)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
