import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { insertSaleSchema } from '@shared/schema';
import { RecentSalesTable } from '@/components/recent-sales-table';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Sales() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products']
  });
  
  // Only show products that are in stock
  const availableProducts = products.filter(product => product.stock > 0);
  
  // Create schema for form
  const formSchema = z.object({
    productId: z.coerce.number().min(1, "Please select a product"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.string().min(1, "Price is required"),
    total: z.string().min(1, "Total is required"),
  });
  
  // Set up form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: 0,
      quantity: 1,
      price: "",
      total: "",
    },
  });
  
  // Get values from form
  const productId = form.watch("productId");
  const quantity = form.watch("quantity");
  
  // Update price and total when product or quantity changes
  const selectedProduct = products.find(p => p.id === productId);
  
  // Set price and total based on selected product
  useState(() => {
    if (selectedProduct) {
      form.setValue("price", selectedProduct.price);
      form.setValue(
        "total", 
        (parseFloat(selectedProduct.price) * quantity).toFixed(2)
      );
    }
  });
  
  // Handle product change
  const handleProductChange = (value: string) => {
    const id = parseInt(value);
    form.setValue("productId", id);
    
    const product = products.find(p => p.id === id);
    if (product) {
      form.setValue("price", product.price);
      const qty = form.getValues("quantity");
      form.setValue(
        "total", 
        (parseFloat(product.price) * qty).toFixed(2)
      );
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value) || 0;
    form.setValue("quantity", qty);
    
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue(
        "total", 
        (parseFloat(product.price) * qty).toFixed(2)
      );
    }
  };
  
  // Submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a valid product",
        variant: "destructive",
      });
      return;
    }
    
    if (quantity > selectedProduct.stock) {
      toast({
        title: "Error",
        description: `Not enough stock. Only ${selectedProduct.stock} units available.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/sales', values);
      toast({
        title: 'Success',
        description: 'Sale has been recorded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reports/dashboard'] });
      form.reset({
        productId: 0,
        quantity: 1,
        price: "",
        total: "",
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record sale',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Sales History */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sales History</h2>
            <RecentSalesTable limit={10} showHeader={false} showViewAll={false} />
          </div>
          
          {/* New Sale Form */}
          <div className="md:w-1/3">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Record New Sale</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Add a new sales transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Product</FormLabel>
                          <Select 
                            onValueChange={handleProductChange}
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableProducts.length === 0 ? (
                                <SelectItem value="0" disabled>
                                  No products in stock
                                </SelectItem>
                              ) : (
                                availableProducts.map(product => (
                                  <SelectItem 
                                    key={product.id} 
                                    value={product.id.toString()}
                                  >
                                    {product.name} (Stock: {product.stock})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max={selectedProduct?.stock || 1}
                                {...field}
                                onChange={handleQuantityChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="0.01"
                                step="0.01"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Calculate total when price changes
                                  const qty = form.getValues("quantity");
                                  const newPrice = parseFloat(e.target.value) || 0;
                                  form.setValue("total", (qty * newPrice).toFixed(2));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total ($)</FormLabel>
                          <FormControl>
                            <Input 
                              readOnly 
                              className="font-bold" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting || !selectedProduct || quantity < 1}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Sale'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
