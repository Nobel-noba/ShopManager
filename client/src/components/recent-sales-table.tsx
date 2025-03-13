import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Shirt, 
  Footprints, 
  Glasses, 
  ShoppingBag
} from 'lucide-react';
import { Sale, Product } from '@shared/schema';

interface RecentSalesProps {
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export function RecentSalesTable({ 
  limit = 5, 
  showHeader = true,
  showViewAll = true 
}: RecentSalesProps) {
  const { data: sales = [], isLoading: isSalesLoading } = useQuery<Sale[]>({
    queryKey: ['/api/sales']
  });
  
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });
  
  const isLoading = isSalesLoading || isProductsLoading;
  
  // Sort sales by date (newest first) and limit
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  
  // Helper to get product details
  const getProduct = (productId: number) => {
    return products.find(p => p.id === productId);
  };
  
  // Helper to get icon for category
  const getCategoryIcon = (category?: string) => {
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
  
  // Format date
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateObj = new Date(date);
    
    if (dateObj.toDateString() === today.toDateString()) {
      return `Today, ${format(dateObj, 'h:mm a')}`;
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(dateObj, 'h:mm a')}`;
    } else {
      return format(dateObj, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      {showHeader && (
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Sales</h3>
          {showViewAll && (
            <a href="/sales" className="text-sm text-primary font-medium hover:underline">
              View All
            </a>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading recent sales...
                  </TableCell>
                </TableRow>
              ) : recentSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No sales records found.
                  </TableCell>
                </TableRow>
              ) : (
                recentSales.map(sale => {
                  const product = getProduct(sale.productId);
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                            {getCategoryIcon(product?.category)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">
                              {product?.name || 'Unknown Product'}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {sale.quantity}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        ${parseFloat(sale.total).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(new Date(sale.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
