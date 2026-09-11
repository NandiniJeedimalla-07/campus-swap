import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ItemCard } from '@/components/items/ItemCard';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SellerListings = () => {
  const { user } = useAuth();
  const { getSellerItems, deleteItem, updateItem } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const items = getSellerItems(user?.id || '');

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditDescription(item.description);
    setEditPrice(item.pricePerDay.toString());
    setEditQuantity(item.quantity.toString());
  };

  const handleSaveEdit = () => {
    if (!editItem) return;

    updateItem(editItem.id, {
      name: editName,
      description: editDescription,
      pricePerDay: parseFloat(editPrice),
      quantity: parseInt(editQuantity),
    });

    toast({
      title: "Item updated",
      description: "Your changes have been saved.",
    });

    setEditItem(null);
  };

  const handleDelete = () => {
    if (!deleteItemId) return;

    deleteItem(deleteItemId);
    toast({
      title: "Item deleted",
      description: "The item has been removed from your listings.",
    });

    setDeleteItemId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your listed items
            </p>
          </div>
          <Button variant="gradient" onClick={() => navigate('/seller/add-item')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ItemCard
                  item={item}
                  onView={() => {}}
                  showActions
                  onEdit={handleEdit}
                  onDelete={(item) => setDeleteItemId(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-4">
              Start listing items to earn money from rentals
            </p>
            <Button variant="gradient" onClick={() => navigate('/seller/add-item')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price per Day (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditItem(null)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The item will be permanently removed from your listings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default SellerListings;
