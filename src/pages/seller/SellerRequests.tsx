import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Check, X, User, Phone, Package } from 'lucide-react';

const SellerRequests = () => {
  const { user } = useAuth();
  const { getSellerRequests, updateRequest, items } = useData();
  const { toast } = useToast();

  const requests = getSellerRequests(user?.id || '');

  const handleAccept = (requestId: string) => {
    updateRequest(requestId, 'accepted');
    toast({
      title: "Request accepted",
      description: "The buyer has been notified.",
    });
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, 'rejected');
    toast({
      title: "Request rejected",
      description: "The buyer has been notified.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-accent/10 text-accent';
      case 'accepted': return 'bg-primary/10 text-primary';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Requests</h1>
          <p className="text-muted-foreground mt-1">
            Review and respond to rental requests
          </p>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Pending Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.map((request, index) => {
              const item = items.find(i => i.id === request.itemId);
              return (
                <Card 
                  key={request.id}
                  className="border-border/50 border-l-4 border-l-accent animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{request.itemName}</span>
                          <Badge className={getStatusColor(request.status)}>
                            Pending
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{request.buyerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{request.buyerContact}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Quantity requested: {request.requestedQuantity}
                          {item && ` • Available: ${item.quantity}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                          disabled={item && item.quantity < request.requestedQuantity}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              History ({processedRequests.length})
            </h2>
            {processedRequests.map((request, index) => (
              <Card 
                key={request.id}
                className="border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{request.itemName}</span>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested by {request.buyerName}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {requests.length === 0 && (
          <div className="text-center py-16">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
            <p className="text-muted-foreground">
              Rental requests from buyers will appear here
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerRequests;
