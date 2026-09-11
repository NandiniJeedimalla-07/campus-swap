import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ItemCard } from '@/components/items/ItemCard';
import { Item, Category, CATEGORIES } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, MessageCircle, Phone, Tag, Package, User, Calendar, Download, ExternalLink, ChevronDown, Clock, AlertCircle } from 'lucide-react';
import { addToGoogleCalendar, downloadICalendar, getTimeRemaining, isExpiringSoon } from '@/lib/calendar';

const categories: (Category | 'All')[] = ['All', ...CATEGORIES];

const BuyerHome = () => {
  const { user } = useAuth();
  const { items, createRequest, getBuyerRentals } = useData();
  const { toast } = useToast();

  const activeRentals = getBuyerRentals(user?.id || '').filter(r => r.status === 'active');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.availability;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleRequestItem = () => {
    if (!selectedItem || !user) return;

    createRequest({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      buyerId: user.id,
      buyerName: user.name,
      buyerContact: user.phone,
      sellerId: selectedItem.sellerId,
      requestedQuantity: 1,
    });

    toast({
      title: "Request sent!",
      description: "The seller will review your request.",
    });

    setSelectedItem(null);
  };

  const handleWhatsAppContact = () => {
    if (!selectedItem) return;
    const phone = selectedItem.sellerContact.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi! I'm interested in renting your "${selectedItem.name}" listed on UniSwap.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Find great items to rent from your campus community
          </p>
        </div>

        {/* Active Rentals Section */}
        {activeRentals.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Active Rentals</h2>
                </div>
                <Badge variant="outline" className="bg-background">
                  {activeRentals.length} active
                </Badge>
              </div>
              <div className="space-y-3">
                {activeRentals.slice(0, 3).map((rental) => {
                  const timeRemaining = getTimeRemaining(rental.endDate);
                  const expiringSoon = isExpiringSoon(rental.endDate);

                  return (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{rental.itemName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Return by {new Date(rental.endDate).toLocaleDateString()}
                          </p>
                          {expiringSoon && (
                            <Badge variant="destructive" className="text-xs h-5">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-primary font-medium mt-1">
                          {timeRemaining}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs flex items-center gap-1"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddToGoogleCalendar(rental)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Google Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadICalendar(rental)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download .ics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Navbar */}
        <div className="sticky top-14 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <Button
              variant="outline"
              className="sm:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Category Filter (Desktop) */}
            <div className="hidden sm:block">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as Category | 'All')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="mt-3 sm:hidden animate-fade-in">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as Category | 'All')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Available Items ({filteredItems.length})
          </h2>

          {filteredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ItemCard item={item} onView={setSelectedItem} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Item Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedItem.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Image */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {selectedItem.images[0] ? (
                      <img
                        src={selectedItem.images[0]}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{selectedItem.category}</Badge>
                      <Badge variant={selectedItem.availability ? "default" : "secondary"}>
                        {selectedItem.availability ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">{selectedItem.description}</p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        ₹{selectedItem.pricePerDay}
                      </span>
                      <span className="text-muted-foreground">per day</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Quantity available: {selectedItem.quantity}</span>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedItem.sellerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedItem.sellerContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="gradient"
                      className="flex-1"
                      onClick={handleRequestItem}
                      disabled={!selectedItem.availability}
                    >
                      Request Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleWhatsAppContact}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BuyerHome;
