import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ClipboardList, DollarSign, Plus, ArrowRight } from 'lucide-react';

const SellerHome = () => {
  const { user } = useAuth();
  const { getSellerItems, getSellerRequests } = useData();
  const navigate = useNavigate();
  
  const items = getSellerItems(user?.id || '');
  const requests = getSellerRequests(user?.id || '');
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const stats = [
    {
      label: 'Listed Items',
      value: items.length,
      icon: Package,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Pending Requests',
      value: pendingRequests,
      icon: ClipboardList,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Total Earned',
      value: '₹0',
      icon: DollarSign,
      color: 'bg-secondary text-secondary-foreground',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your listings and rental requests
            </p>
          </div>
          <Button variant="gradient" size="lg" onClick={() => navigate('/seller/add-item')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="border-border/50 hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all duration-300 border-border/50"
              onClick={() => navigate('/seller/add-item')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Add New Item</h3>
                  <p className="text-sm text-muted-foreground">List something for rent</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all duration-300 border-border/50"
              onClick={() => navigate('/seller/listings')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Package className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Listings</h3>
                  <p className="text-sm text-muted-foreground">Manage your items</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all duration-300 border-border/50"
              onClick={() => navigate('/seller/requests')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Manage Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    {pendingRequests > 0 ? `${pendingRequests} pending` : 'View requests'}
                  </p>
                </div>
                {pendingRequests > 0 && (
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center">
                    {pendingRequests}
                  </span>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerHome;
