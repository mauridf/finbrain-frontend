import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // base
        'flex h-10 w-full rounded-(--radius-control) border border-border bg-card px-3 py-2 text-sm text-foreground',
        'placeholder:text-brand-neutral/70',
        // focus (design system)
        'outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15',
        // disabled / invalid
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:ring-danger/15',
        // tabular para inputs numéricos
        'data-[numeric=true]:tabular-nums',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'