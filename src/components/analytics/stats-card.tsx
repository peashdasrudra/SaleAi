import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
  color?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'bg-slate-100 text-slate-600',
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
              {trend !== undefined && (
                <span
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-slate-600"
                  )}
                >
                  {trend > 0 ? (
                    <ArrowUpRight className="mr-0.5 h-3 w-3" />
                  ) : trend < 0 ? (
                    <ArrowDownRight className="mr-0.5 h-3 w-3" />
                  ) : null}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn("rounded-full p-3", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
