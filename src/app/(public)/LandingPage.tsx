import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, PiggyBank, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiRecommendationTag } from '@/components/ui/ai-tag'

export function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 py-8">
      <section className="flex flex-col items-center gap-6 text-center">
        <AiRecommendationTag pulse>Assistente financeiro com IA</AiRecommendationTag>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          O cérebro financeiro pessoal que entende o seu dinheiro.
        </h1>
        <p className="max-w-2xl text-base text-brand-neutral">
          Centralize contas, cofres, receitas e despesas, e receba orientação com IA
          baseada nos seus dados reais — com premissas transparentes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">Começar grátis</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/login">Já tenho conta</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Feature icon={<Wallet />} title="Contas e cofres" description="Bancos, poupança e dinheiro em espécie." />
        <Feature icon={<TrendingUp />} title="Fluxo projetado" description="Receitas e despesas dos próximos 12 meses." />
        <Feature icon={<PiggyBank />} title="Metas com aporte" description="Reserva de emergência, carro, viagem." />
        <Feature icon={<ShieldCheck />} title="LGPD" description="Consentimento granular, exportação e exclusão." />
      </section>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-card p-5 shadow-level-1">
      <div className="flex size-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary [&_svg]:size-5">
        {icon}
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-brand-neutral">{description}</p>
    </div>
  )
}