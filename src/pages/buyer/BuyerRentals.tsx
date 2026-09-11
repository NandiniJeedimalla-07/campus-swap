import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, Clock, CheckCircle, Calendar, Download, ExternalLink, ChevronDown } from 'lucide-react';
import { addToGoogleCalendar, downloadICalendar, getTimeRemaining } from '@/lib/calendar';
import { useToast } from '@/hooks/use-toast';

const BuyerRentals = () => {
  const { user } = useAuth();
  const { getBuyerRentals, items } = useData();
  const [now, setNow] = useState(new Date());
  const { toast } = useToast();

  const rentals = getBuyerRentals(user?.id || '');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-accent/10 text-accent';
      case 'active': return 'bg-primary/10 text-primary';
      case 'returned': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'active': return Package;
      case 'returned': return CheckCircle;
      default: return Package;
    }
  };

  const handleAddToGoogleCalendar = (rental: any) => {
    const item = items.find(i => i.id === rental.itemId);
    addToGoogleCalendar(rental, item?.sellerName, item?.sellerContact);
    toast({
      title: "Calendar Opened",
      description: "Add the rental reminder to your Google Calendar.",
    });
  };

  const handleDownloadICalendar = (rental: any) => {
    const item = items.find(i => i.id === rental.itemId);
    downloadICalendar(rental, item?.sellerName, item?.sellerContact);
    toast({
      title: "Calendar File Downloaded",
      description: "Open the .ics file to add to your calendar app.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Rentals</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your rented items
            </p>
          </div>
        </div>

        {rentals.length > 0 ? (
          <div className="grid gap-4">
            {rentals.map((rental, index) => {
              const StatusIcon = getStatusIcon(rental.status);
              const timeRemaining = rental.endDate ? getTimeRemaining(rental.endDate) : null;

              return (
                <Card
                  key={rental.id}
                  className="border-border/50 hover:shadow-card transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${getStatusColor(rental.status)} flex items-center justify-center shrink-0`}>
                          <StatusIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rental.itemName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {rental.quantity} • ₹{rental.pricePerDay}/day
                          </p>
                          {rental.status === 'active' && rental.endDate && (
                            <div className="flex items-center gap-1.5 mt-1 text-primary font-medium text-xs">
                              <Clock className="h-3 w-3" />
                              {timeRemaining}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">End Date</p>
                          <p className="font-medium text-foreground">
                            {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(rental.status)}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </Badge>
                          {rental.status === 'active' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs flex items-center gap-2"
                                >
                                  <Calendar className="h-3.5 w-3.5" />
                                  Add to Calendar
                                  <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAddToGoogleCalendar(rental)}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Google Calendar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadICalendar(rental)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download .ics file
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No rentals yet</h3>
            <p className="text-muted-foreground">
              Start browsing items to find something to rent!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BuyerRentals;
