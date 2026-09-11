import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';

const BuyerActivity = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Activity</h1>
          <p className="text-muted-foreground mt-1">
            View your rental history and ratings
          </p>
        </div>

        <div className="text-center py-16">
          <Star className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Your rental activity and ratings will appear here
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyerActivity;
