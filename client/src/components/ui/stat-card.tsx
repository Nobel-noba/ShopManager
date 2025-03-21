import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  iconBgClass?: string;
  iconClass?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconBgClass = "bg-primary/10",
  iconClass = "text-primary"
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              {trend.label && <span className="text-xs text-gray-500 ml-2">{trend.label}</span>}
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconBgClass)}>
          <Icon className={cn("h-5 w-5", iconClass)} />
        </div>
      </div>
    </div>
  );
}
