import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, Sale } from '@shared/schema';
import { SalesSheet } from '@/components/reports/sales-sheet';

export default function Reports() {
  const { data: dashboardData } = useQuery({
    queryKey: ['/api/reports/dashboard']
  });
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });
  
  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ['/api/sales']
  });
  
  // Category distribution data
  const categoryData = products.reduce((acc: any[], product) => {
    const existingCategory = acc.find(item => item.name === product.category);
    if (existingCategory) {
      existingCategory.value++;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);
  
  // Sales by day data (for the current week)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6); // Last 7 days
  
  const dailySales = Array(7).fill(0).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      date,
      day: format(date, 'EEE'),
      value: 0,
      formattedDate: format(date, 'MMM dd')
    };
  });
  
  // Fill in sales data
  sales.forEach(sale => {
    const saleDate = new Date(sale.createdAt);
    if (saleDate >= startOfWeek && saleDate <= today) {
      const dayIndex = Math.floor((saleDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        dailySales[dayIndex].value += Number(sale.total);
      }
    }
  });
  
  // Colors for pie chart
  const COLORS = ['#4f46e5', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Business Reports</h2>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Sheet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalSales ? formatCurrency(dashboardData.totalSales) : 'Loading...'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalProfit ? formatCurrency(dashboardData.totalProfit) : 'Loading...'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.inventoryValue ? formatCurrency(dashboardData.inventoryValue) : 'Loading...'}
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="sales">
            <SalesSheet />
          </TabsContent>
        </Tabs>
        
        {/* Charts Section */}
        <Tabs defaultValue="sales" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailySales}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="day"
                        tickLine={false}
                        axisLine={true}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        tickLine={false}
                        axisLine={true}
                      />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                        labelFormatter={(index) => index !== undefined && dailySales[index] ? dailySales[index].formattedDate : ''}
                      />
                      <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [value, 'Items']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Revenue</h4>
                  <p className="text-2xl font-bold">{dashboardData?.totalSales ? formatCurrency(dashboardData.totalSales) : 'Loading...'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cost of Goods</h4>
                  <p className="text-2xl font-bold">
                    {dashboardData?.totalSales && dashboardData?.totalProfit
                      ? formatCurrency(dashboardData.totalSales - dashboardData.totalProfit)
                      : 'Loading...'}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500">Gross Profit</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.totalProfit ? formatCurrency(dashboardData.totalProfit) : 'Loading...'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
