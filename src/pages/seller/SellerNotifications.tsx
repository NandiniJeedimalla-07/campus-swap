import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Bell } from 'lucide-react';

const SellerNotifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your rental activity
          </p>
        </div>

        <div className="text-center py-16">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerNotifications;
