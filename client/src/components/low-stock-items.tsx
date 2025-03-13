import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Shirt, 
  Footprints, 
  Glasses, 
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface LowStockItemsProps {
  limit?: number;
  threshold?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export function LowStockItems({ 
  limit = 5, 
  threshold = 5,
  showHeader = true,
  showViewAll = true
}: LowStockItemsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/reports/low-stock', { threshold }]
  });
  
  // Limit the number of items to display
  const limitedItems = products.slice(0, limit);
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Clothing':
        return <Shirt className="text-gray-500" />;
      case 'Footwear':
        return <Footprints className="text-gray-500" />;
      case 'Accessories':
        return <Glasses className="text-gray-500" />;
      default:
        return <ShoppingBag className="text-gray-500" />;
    }
  };
  
  // Handle restock button click
  const handleRestock = async (productId: number) => {
    try {
      // Simulate adding 10 more units to stock
      await apiRequest('PATCH', `/api/products/${productId}`, { 
        stock: (products.find(p => p.id === productId)?.stock || 0) + 10 
      });
      
      toast({
        title: 'Success',
        description: 'Product has been restocked',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reports/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reports/dashboard'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to restock product',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      {showHeader && (
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Low Stock Items</h3>
          {showViewAll && (
            <a href="/inventory" className="text-sm text-primary font-medium hover:underline">
              View All
            </a>
          )}
        </div>
      )}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="ml-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : limitedItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No low stock items found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {limitedItems.map(item => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Stock: <span className="text-red-500 font-medium">{item.stock}</span>
                    </p>
                  </div>
                </div>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleRestock(item.id)}
                >
                  Restock
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
