import React from 'react';
import { Item } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Tag } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onView: (item: Item) => void;
  showActions?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onView, 
  showActions = false,
  onEdit,
  onDelete 
}) => {
  return (
    <Card className="group overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.images[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <Badge 
          variant={item.availability ? "default" : "secondary"}
          className="absolute top-3 right-3"
        >
          {item.availability ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
          <Badge variant="outline" className="text-xs shrink-0">
            {item.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">₹{item.pricePerDay}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Qty: {item.quantity}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => onView(item)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
        {showActions && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(item)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete?.(item)}
            >
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
