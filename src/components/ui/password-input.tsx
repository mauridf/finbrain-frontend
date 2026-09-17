import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils/cn'

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <Input ref={ref} type={visible ? 'text' : 'password'} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-brand-neutral hover:text-foreground"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'