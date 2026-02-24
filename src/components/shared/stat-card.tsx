"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      <CardContent className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="size-4 text-emerald-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  isPositive && "text-emerald-500",
                  isNegative && "text-red-500"
                )}
              >
                {isPositive ? "+" : ""}
                {trend}%
              </span>
              {trendLabel && (
                <span className="text-muted-foreground text-xs">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-primary/20">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
