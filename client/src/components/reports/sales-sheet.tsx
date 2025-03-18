import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Sale } from '@shared/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function SalesSheet() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ['/api/sales']
  });

  // Filter sales based on search term
  const filteredSales = sales.filter(sale =>
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.products.some(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Handle export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Customer', 'Products', 'Total', 'Payment Method'];
    const csvData = filteredSales.map(sale => [
      format(new Date(sale.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      sale.customer,
      sale.products.map(p => p.name).join(', '),
      formatCurrency(sale.total),
      sale.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>
                  {sale.products.map(p => p.name).join(', ')}
                </TableCell>
                <TableCell>{formatCurrency(sale.total)}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}