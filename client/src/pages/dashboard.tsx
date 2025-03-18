import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingCart, 
  Store, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardChart } from '@/components/ui/dashboard-chart';
import { RecentSalesTable } from '@/components/recent-sales-table';
import { LowStockItems } from '@/components/low-stock-items';
import { useAuth } from '@/hooks/use-auth';

export default function Dashboard() {
  const { user } = useAuth();
  // Get dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/reports/dashboard']
  });
  
  // Generate mock chart data (in a real app, this would come from the API)
  const [chartData, setChartData] = useState({
    daily: [] as { name: string; value: number }[],
    weekly: [] as { name: string; value: number }[],
    monthly: [] as { name: string; value: number }[],
    yearly: [] as { name: string; value: number }[]
  });
  
  useEffect(() => {
    // Generate some sample chart data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    const generateValues = (array: string[], min: number, max: number) => {
      return array.map(name => ({
        name,
        value: Math.floor(Math.random() * (max - min + 1)) + min
      }));
    };
    
    setChartData({
      daily: generateValues(days, 500, 3000),
      weekly: generateValues(weeks, 2000, 10000),
      monthly: generateValues(months, 5000, 30000),
      yearly: generateValues(quarters, 20000, 80000)
    });
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Quick Stats Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Sales"
              value={isLoading ? "Loading..." : `$${dashboardData?.totalSales.toFixed(2)}`}
              icon={ShoppingCart}
              trend={{ value: 12.5, isPositive: true, label: "vs last month" }}
            />
            
            <StatCard
              label="Inventory Value"
              value={isLoading ? "Loading..." : `$${dashboardData?.inventoryValue.toFixed(2)}`}
              icon={Store}
              trend={{ value: 5.8, isPositive: true, label: "vs last month" }}
              iconBgClass="bg-blue-100"
              iconClass="text-blue-600"
            />
            
            <StatCard
              label="Net Profit"
              value={isLoading ? "Loading..." : `$${dashboardData?.totalProfit.toFixed(2)}`}
              icon={BarChart3}
              trend={{ value: 3.2, isPositive: false, label: "vs last month" }}
              iconBgClass="bg-purple-100"
              iconClass="text-purple-600"
            />
            
            <StatCard
              label="Low Stock Items"
              value={isLoading ? "Loading..." : dashboardData?.lowStockCount}
              icon={AlertTriangle}
              trend={{ value: 0, isPositive: false, label: "Needs attention" }}
              iconBgClass="bg-yellow-100"
              iconClass="text-yellow-600"
            />
          </div>
        </section>
        
        {/* Recent Activity & Low Stock */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sales */}
          <div className="lg:col-span-2">
            <RecentSalesTable />
          </div>
          
          {/* Low Stock Items - Only show for admin users */}
          {user?.role === 'admin' && (
            <div>
              <LowStockItems />
            </div>
          )}
        </section>
        
        {/* Sales Performance Chart */}
        <section className="mb-8">
          <DashboardChart data={chartData} />
        </section>
      </div>
    </div>
  );
}
