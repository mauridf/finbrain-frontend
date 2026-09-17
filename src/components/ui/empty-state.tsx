import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-(--radius-card) border border-dashed border-border bg-surface-container-lowest px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary [&_svg]:size-6">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-brand-neutral">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}