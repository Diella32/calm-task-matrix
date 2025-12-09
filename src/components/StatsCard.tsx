import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) => {
  return (
    <Card className={cn("shadow-soft border-border/50 transition-all duration-300 hover:shadow-elegant", className)}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trendUp ? "text-green-600" : "text-muted-foreground"
                )}>
                  {trend}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
