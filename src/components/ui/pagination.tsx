import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, limit, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-t border-border px-2 py-3',
        className,
      )}
    >
      <span className="text-xs text-brand-neutral tabular-nums">
        Página {page} de {totalPages} · {total} registro{total === 1 ? '' : 's'}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}