import { Toaster as Sonner } from 'sonner'

/**
 * Toaster global (sonner) configurado com os tokens do design system.
 * Envolve cantos, cores de sucesso/erro e tipografia.
 */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'rounded-(--radius-card) border border-border bg-card text-foreground shadow-level-2 font-sans text-sm',
          title: 'font-medium text-foreground',
          description: 'text-brand-neutral',
          success: 'border-success/30',
          error: 'border-danger/30',
          warning: 'border-warning/30',
          info: 'border-brand-accent/30',
          actionButton: 'rounded-(--radius-control)',
        },
      }}
    />
  )
}