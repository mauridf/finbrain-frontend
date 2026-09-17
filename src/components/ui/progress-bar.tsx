import { cn } from '@/lib/utils/cn'
import { Progress } from './progress'

interface ProgressBarProps {
  value: number // 0..100
  label?: string
  helper?: string
  className?: string
}

export function ProgressBar({ value, label, helper, className }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || helper) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {helper && <span className="text-brand-neutral tabular-nums">{helper}</span>}
        </div>
      )}
      <Progress value={safe} />
    </div>
  )
}