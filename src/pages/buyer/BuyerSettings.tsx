import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, BadgeCheck, Trash2, AlertTriangle } from 'lucide-react';

const BuyerSettings = () => {
  const { user } = useAuth();
  const { cleanupNonSvecwData } = useData();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isCleaning, setIsCleaning] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your profile has been updated.",
    });
  };

  const handleCleanup = async () => {
    if (!window.confirm("Are you sure? This will delete all users and items that do not belong to the @svecw.edu.in domain.")) return;

    setIsCleaning(true);
    try {
      const result = await cleanupNonSvecwData();
      toast({
        title: "Cleanup Complete",
        description: `Deleted ${result.deletedUsers} users and ${result.deletedItems} items.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cleanup failed",
        description: "An error occurred during cleanup.",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeId">College ID</Label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="collegeId"
                  value={user?.collegeId || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button variant="gradient" onClick={handleSave}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone / Admin Section */}
        <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
          <CardHeader className="border-b border-destructive/10 bg-destructive/5">
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Administrative actions for data maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Clean up Legacy Data</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all accounts and items that are not using SVECW emails.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleCleanup}
                disabled={isCleaning}
                className="shrink-0"
              >
                {isCleaning ? "Cleaning..." : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Run Cleanup
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BuyerSettings;
