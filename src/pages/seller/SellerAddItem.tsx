import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, Category } from '@/types';
import { Upload, X, ArrowLeft, Gift, IndianRupee } from 'lucide-react';

const SellerAddItem = () => {
  const { user } = useAuth();
  const { addItem, addFreeItem } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [quantity, setQuantity] = useState('1');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Free item options
  const [isFreeItem, setIsFreeItem] = useState(false);
  const [freeDays, setFreeDays] = useState('7');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !category || !quantity) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (!isFreeItem && !pricePerDay) {
      toast({
        variant: "destructive",
        title: "Missing price",
        description: "Please enter the price per day for priced items.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFreeItem) {
        addFreeItem({
          name,
          description,
          category: category as Category,
          images,
          sellerId: user?.id || '',
          sellerName: user?.name || '',
          sellerContact: user?.phone || '',
          availability: true,
          quantity: parseInt(quantity),
          freeDays: parseInt(freeDays),
        });

        toast({
          title: "Free item added!",
          description: "Your free item is now available for others to request.",
        });
      } else {
        addItem({
          name,
          description,
          pricePerDay: parseFloat(pricePerDay),
          category: category as Category,
          images,
          sellerId: user?.id || '',
          sellerName: user?.name || '',
          sellerContact: user?.phone || '',
          availability: true,
          quantity: parseInt(quantity),
        });

        toast({
          title: "Item listed!",
          description: "Your item is now available for rent.",
        });
      }

      navigate('/seller/listings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/seller')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Item</h1>
            <p className="text-muted-foreground mt-1">
              List an item for rent or give away for free
            </p>
          </div>
        </div>

        {/* Item Type Selection */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Item Type</CardTitle>
            <CardDescription>Choose whether to list for money or give for free</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsFreeItem(false)}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  !isFreeItem 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  !isFreeItem ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">For Rent</p>
                  <p className="text-xs text-muted-foreground">Charge per day</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsFreeItem(true)}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  isFreeItem 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isFreeItem ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Gift className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">For Free</p>
                  <p className="text-xs text-muted-foreground">Lend for limited days</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images Upload */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="h-6 w-6 text-background" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Engineering Textbook"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item, its condition, and any relevant details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pricing Section - Conditional */}
              {isFreeItem ? (
                <div className="space-y-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 text-accent">
                    <Gift className="h-5 w-5" />
                    <span className="font-medium">Free Item Settings</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Available *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeDays">Free for (days) *</Label>
                      <Input
                        id="freeDays"
                        type="number"
                        min="1"
                        max="365"
                        placeholder="7"
                        value={freeDays}
                        onChange={(e) => setFreeDays(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Free items can be borrowed without any rental fee for up to {freeDays} days.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary">
                    <IndianRupee className="h-5 w-5" />
                    <span className="font-medium">Pricing Settings</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Day (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        placeholder="50"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Available *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {isFreeItem ? 'Adding...' : 'Listing...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isFreeItem ? <Gift className="h-4 w-4" /> : <IndianRupee className="h-4 w-4" />}
                      {isFreeItem ? 'Add Free Item' : 'List Item'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SellerAddItem;
