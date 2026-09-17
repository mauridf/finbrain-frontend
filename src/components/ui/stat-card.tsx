import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  trend?: {
    value: string
    tone: 'up' | 'down' | 'neutral'
  }
  footer?: React.ReactNode
  className?: string
}

/**
 * KPI tile do design system:
 *  - Header: label em Inter medium 14px cinza + ícone opcional
 *  - Value: Sora semibold 28px tabular-nums
 *  - Footer: delta badge + micro text
 */
export function StatCard({ label, value, icon, trend, footer, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-(--radius-card) border border-border bg-card p-5 shadow-level-1 transition-shadow hover:shadow-level-1-hover',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-brand-neutral">{label}</span>
        {icon && <span className="text-brand-neutral [&_svg]:size-4">{icon}</span>}
      </div>

      <div className="font-display text-[1.75rem] font-semibold leading-9 tracking-tight text-foreground tabular-nums">
        {value}
      </div>

      {(trend || footer) && (
        <div className="flex items-center justify-between gap-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
                trend.tone === 'up' && 'bg-success/10 text-success',
                trend.tone === 'down' && 'bg-danger/10 text-danger',
                trend.tone === 'neutral' && 'bg-surface-container-low text-brand-neutral',
              )}
            >
              {trend.value}
            </span>
          )}
          {footer && <span className="text-xs text-brand-neutral">{footer}</span>}
        </div>
      )}
    </div>
  )
}