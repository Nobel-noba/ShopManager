import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@shared/schema';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { 
  Pencil, 
  Trash2, 
  Search,
  ShoppingBag, 
  Shirt, 
  Footprints,
  Glasses
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { AddProductModal } from './add-product-modal';
import { EditProductModal } from './edit-product-modal';

const ITEMS_PER_PAGE = 10;

export function ProductTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all-categories');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });
  
  // Filter & sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all-categories' || categoryFilter === '' || product.category === categoryFilter;
    
    const productStatus = getProductStatus(product.stock);
    const matchesStatus = statusFilter === 'all-status' || statusFilter === '' || productStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return Number(a.price) - Number(b.price);
      case 'price-desc':
        return Number(b.price) - Number(a.price);
      case 'stock-asc':
        return a.stock - b.stock;
      default:
        return 0;
    }
  });
  
  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  function getProductStatus(stock: number): string {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  }
  
  function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'In Stock':
        return 'default';
      case 'Low Stock':
        return 'secondary';
      case 'Out of Stock':
        return 'destructive';
      default:
        return 'outline';
    }
  }
  
  function getCategoryIcon(category: string) {
    switch (category) {
      case 'Clothing':
        return <Shirt className="h-4 w-4 text-gray-400" />;
      case 'Footwear':
        return <Footprints className="h-4 w-4 text-gray-400" />;
      case 'Accessories':
        return <Glasses className="h-4 w-4 text-gray-400" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-gray-400" />;
    }
  }
  
  async function handleDeleteProduct(id: number) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await apiRequest('DELETE', `/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        toast({
          title: 'Success',
          description: 'Product has been deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        queryClient.invalidateQueries({ queryKey: ['/api/reports/dashboard'] });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  }
  
  async function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  }
  
  function resetFilters() {
    setSearchQuery('');
    setCategoryFilter('all-categories');
    setStatusFilter('all-status');
    setSortBy('name-asc');
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Inventory Management</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          {isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add Product
            </Button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 md:flex md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="dark:text-gray-100">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Footwear">Footwear</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 md:mb-0 md:w-1/4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="dark:text-gray-100">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 md:mb-0 md:w-1/4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="dark:text-gray-100">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-1/4 flex items-end">
          <Button 
            variant="outline" 
            className="w-full dark:text-gray-300 dark:hover:text-white" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Product Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="text-gray-600 dark:text-gray-300">Product</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Category</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">SKU</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Price</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Stock</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Status</TableHead>
                {isAdmin && <TableHead className="text-gray-600 dark:text-gray-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
                const status = getProductStatus(product.stock);
                return (
                  <TableRow key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{product.name}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(product.category)}
                        {product.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{product.sku}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-gray-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(p => Math.max(p - 1, 1));
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(p => Math.min(p + 1, totalPages));
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      {isAdmin && (
        <>
          <AddProductModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)}
          />
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
