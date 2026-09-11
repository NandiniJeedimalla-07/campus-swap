import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Item, FreeItem, Category, CATEGORIES } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Phone,
  Tag,
  Package,
  User,
  Gift,
  Clock,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BuyerItems = () => {
  const { items, freeItems, createRequest } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedFreeItem, setSelectedFreeItem] = useState<FreeItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [requestDuration, setRequestDuration] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
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
      durationDays: requestDuration,
    });

    toast({
      title: "Request sent!",
      description: `The seller will review your request for ${requestDuration} day(s).`,
    });

    setSelectedItem(null);
    setRequestDuration(1);
  };

  const handleWhatsAppContact = (contact: string, itemName: string) => {
    const phone = contact.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi! I'm interested in renting your "${itemName}" listed on UniSwap.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleRequestFreeItem = () => {
    if (!selectedFreeItem || !user) return;

    toast({
      title: "Request sent!",
      description: `You've requested "${selectedFreeItem.name}" for free up to ${selectedFreeItem.freeDays} days.`,
    });

    setSelectedFreeItem(null);
  };

  // Filter free items based on search and category
  const filteredFreeItems = useMemo(() => {
    return freeItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [freeItems, searchQuery, selectedCategory]);

  // Combine all items for display
  const allItems = useMemo(() => {
    const freeItemsWithType = filteredFreeItems.map(item => ({ ...item, itemType: 'free' as const }));
    const pricedItemsWithType = filteredItems.map(item => ({ ...item, itemType: 'priced' as const }));
    return [...freeItemsWithType, ...pricedItemsWithType];
  }, [filteredFreeItems, filteredItems]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Search & Filter Navbar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 bg-muted/50 border-border/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle & Categories */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Badge
                  variant={selectedCategory === 'All' ? 'default' : 'outline'}
                  className="cursor-pointer shrink-0 hover:bg-primary/90"
                  onClick={() => setSelectedCategory('All')}
                >
                  All
                </Badge>
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer shrink-0 hover:bg-primary/90"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Browse Items</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Find and rent items from your campus community
          </p>
        </div>

        {/* Combined Items Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            All Items ({allItems.length})
          </h2>
          {allItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {allItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    onClick={() => item.itemType === 'free' ? setSelectedFreeItem(item as FreeItem) : setSelectedItem(item as Item)}
                    className={cn(
                      "cursor-pointer overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                      item.itemType === 'free'
                        ? "border-accent/30 hover:border-accent/50"
                        : "border-border/50 hover:border-primary/30"
                    )}
                  >
                    {/* Item Image */}
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.itemType === 'free' ? (
                            <Gift className="h-10 w-10 text-accent/50" />
                          ) : (
                            <Tag className="h-10 w-10 text-muted-foreground/30" />
                          )}
                        </div>
                      )}
                      {/* Free Badge Overlay */}
                      {item.itemType === 'free' && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent text-accent-foreground">
                            <Gift className="h-3 w-3 mr-1" />
                            FREE
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">{item.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {item.itemType === 'free' ? (
                          <div className="flex items-center gap-1 text-accent">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">Free for {(item as FreeItem).freeDays} days</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl font-bold text-primary">₹{(item as Item).pricePerDay}</span>
                            <span className="text-xs text-muted-foreground">/day</span>
                          </div>
                        )}
                        <Badge
                          variant={item.availability ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.availability ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>

        {/* Item Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

                    <div className="pt-2 space-y-2">
                      <label className="text-sm font-medium text-foreground">Rental Duration (Days)</label>
                      <Input
                        type="number"
                        min={1}
                        value={requestDuration}
                        onChange={(e) => setRequestDuration(parseInt(e.target.value) || 1)}
                        className="w-full"
                      />
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
                      onClick={() => handleWhatsAppContact(selectedItem.sellerContact, selectedItem.name)}
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

        {/* Free Item Detail Modal */}
        <Dialog open={!!selectedFreeItem} onOpenChange={() => setSelectedFreeItem(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedFreeItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    {selectedFreeItem.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Image */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {selectedFreeItem.images[0] ? (
                      <img
                        src={selectedFreeItem.images[0]}
                        alt={selectedFreeItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/10">
                        <Gift className="h-16 w-16 text-accent/50" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{selectedFreeItem.category}</Badge>
                      <Badge className="bg-accent/20 text-accent-foreground">
                        FREE for {selectedFreeItem.freeDays} days
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">{selectedFreeItem.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Quantity available: {selectedFreeItem.quantity}</span>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedFreeItem.sellerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedFreeItem.sellerContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="gradient"
                      className="flex-1"
                      onClick={handleRequestFreeItem}
                      disabled={!selectedFreeItem.availability}
                    >
                      Request Free Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsAppContact(selectedFreeItem.sellerContact, selectedFreeItem.name)}
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

export default BuyerItems;
