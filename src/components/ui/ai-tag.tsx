import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AiTagProps {
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

/**
 * Tag pill para recomendações da IA.
 * Fundo teal translúcido, ícone sparkle, borda teal suave.
 * Conforme §"AI Recommendation Tag" do design system.
 */
export function AiRecommendationTag({ children, className, pulse = false }: AiTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-brand-accent/25 bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary',
        className,
      )}
    >
      <Sparkles className={cn('size-3', pulse && 'animate-pulse')} />
      {children}
    </span>
  )
}