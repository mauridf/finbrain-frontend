import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-20 w-full rounded-(--radius-control) border border-border bg-card px-3 py-2 text-sm text-foreground',
        'placeholder:text-brand-neutral/70',
        'outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:ring-danger/15',
        className,
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'