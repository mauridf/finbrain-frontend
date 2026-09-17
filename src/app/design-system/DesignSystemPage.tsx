import { useState } from 'react'
import { Sparkles, Wallet, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoneyInput } from '@/components/ui/money-input'
import { DateInput } from '@/components/ui/date-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogConfirm } from '@/components/ui/dialog-confirm'
import { StatCard } from '@/components/ui/stat-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { AiRecommendationTag } from '@/components/ui/ai-tag'
import { FilterChip } from '@/components/ui/filter-chip'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableBody, TableCell, TableCellAmount, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { formatBRL } from '@/lib/formatters/currency'
import { toast } from 'sonner'
import { apiGet, apiPost } from '@/lib/api/http'
import { isApiException } from '@/lib/api/api-exception'

export function DesignSystemPage() {
  const [amount, setAmount] = useState(1234.5)
  const [date, setDate] = useState('2026-09-16')
  const [confirmed, setConfirmed] = useState(false)
  const [selectedChip, setSelectedChip] = useState('all')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [page, setPage] = useState(1)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8">
      <PageHeader
        title="Design System — Intelligent Financial Command"
        description="Showcase de todos os componentes base e customizados. Página apenas para inspeção durante o desenvolvimento."
        actions={<AiRecommendationTag pulse>Pronto para uso</AiRecommendationTag>}
      />

      {/* ---------- Buttons ---------- */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="ai"><Sparkles /> AI Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger"><Trash2 /> Excluir</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="icon" aria-label="Adicionar"><Plus /></Button>
        </div>
      </section>

      {/* ---------- StatCards ---------- */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Patrimônio líquido"
          value={formatBRL(45200)}
          icon={<Wallet />}
          trend={{ value: '+4.2% vs mês anterior', tone: 'up' }}
        />
        <StatCard
          label="Receitas do mês"
          value={formatBRL(8500)}
          trend={{ value: '+2.1%', tone: 'up' }}
        />
        <StatCard
          label="Despesas do mês"
          value={formatBRL(5300)}
          trend={{ value: '-8.4%', tone: 'down' }}
          footer="Meta: R$ 5.000"
        />
      </section>

      {/* ---------- Formulário ---------- */}
      <Card>
        <CardHeader><CardTitle>Formulário (valores tabulares)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-money">Valor (BRL)</Label>
            <MoneyInput id="ds-money" value={amount} onValueChange={setAmount} />
            <span className="text-xs text-brand-neutral tabular-nums">
              Valor numérico: {amount}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-date">Data</Label>
            <DateInput id="ds-date" value={date} onChange={(e) => setDate(e.target.value)} />
            <span className="text-xs text-brand-neutral">ISO enviado: {date}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-desc">Descrição</Label>
            <Input id="ds-desc" placeholder="Ex.: Prestação da casa" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoria</Label>
            <Select defaultValue="moradia">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moradia">Moradia</SelectItem>
                <SelectItem value="alimentacao">Alimentação</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="ds-check" checked={confirmed} onCheckedChange={(v) => setConfirmed(!!v)} />
            <Label htmlFor="ds-check" className="cursor-pointer">
              Consentimento LGPD
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="ds-switch" checked={confirmed} onCheckedChange={setConfirmed} />
            <Label htmlFor="ds-switch" className="cursor-pointer">
              Ativar 2FA
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Chips & Tags ---------- */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Chips & Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(['all', 'income', 'expense', 'transfer'] as const).map((c) => (
            <FilterChip key={c} selected={selectedChip === c} onClick={() => setSelectedChip(c)}>
              {c}
            </FilterChip>
          ))}
          <AiRecommendationTag>Meta 4 meses antes</AiRecommendationTag>
          <AiRecommendationTag pulse>Analisando...</AiRecommendationTag>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">Recorrente</Badge>
          <Badge variant="primary">Pro</Badge>
          <Badge variant="success">Pago</Badge>
          <Badge variant="warning">Vence em 3 dias</Badge>
          <Badge variant="danger">Atrasado</Badge>
          <Badge variant="ai">IA</Badge>
        </div>
      </section>

      {/* ---------- Tabs ---------- */}
      <Card>
        <CardHeader><CardTitle>Tabs</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="detail">Detalhe</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Conteúdo de visão geral</TabsContent>
            <TabsContent value="detail">Conteúdo de detalhe</TabsContent>
            <TabsContent value="history">Conteúdo de histórico</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ---------- Tabela ---------- */}
      <Card>
        <CardHeader><CardTitle>Tabela (valores à direita, tabular-nums)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Prestação da casa</TableCell>
                <TableCell><Badge variant="neutral">Moradia</Badge></TableCell>
                <TableCellAmount>{formatBRL(2200)}</TableCellAmount>
              </TableRow>
              <TableRow>
                <TableCell>Supermercado</TableCell>
                <TableCell><Badge variant="neutral">Alimentação</Badge></TableCell>
                <TableCellAmount>{formatBRL(1400)}</TableCellAmount>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination page={page} limit={20} total={57} onPageChange={setPage} />
        </CardContent>
      </Card>

      {/* ---------- Progress ---------- */}
      <Card>
        <CardHeader><CardTitle>Progresso de reserva</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ProgressBar
            value={45.7}
            label="Reserva de emergência"
            helper={`${formatBRL(13700)} de ${formatBRL(30000)}`}
          />
          <ProgressBar value={12} label="Carro novo" helper={`${formatBRL(4800)} de ${formatBRL(40000)}`} />
        </CardContent>
      </Card>

      {/* ---------- Dialogs, Empty, Skeleton ---------- */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Dialog padrão</CardTitle></CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Abrir dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar ação</DialogTitle>
                  <DialogDescription>Esta é uma descrição contextual do diálogo.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>DialogConfirm (destrutivo)</CardTitle></CardHeader>
          <CardContent>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              <Trash2 /> Excluir conta
            </Button>
            <DialogConfirm
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Excluir conta?"
              description="Esta ação é irreversível. O histórico será preservado por 30 dias (LGPD)."
              confirmLabel="Sim, excluir"
              tone="danger"
              onConfirm={() => {
                toast.success('Conta excluída (simulação).')
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>EmptyState</CardTitle></CardHeader>
          <CardContent>
            <EmptyState
              icon={<Wallet />}
              title="Nenhuma conta cadastrada"
              description="Cadastre sua primeira conta para começar a controlar seu dinheiro."
              action={<Button><Plus /> Nova conta</Button>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Skeleton (loading)</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>

      {/* ---------- Toasts ---------- */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Toasts</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => toast.success('Despesa salva com sucesso.')}>Sucesso</Button>
          <Button variant="secondary" onClick={() => toast.error('E-mail já cadastrado.')}>Erro</Button>
          <Button variant="secondary" onClick={() => toast.warning('Vence em 3 dias.')}>Warning</Button>
          <Button variant="secondary" onClick={() => toast.info('Exportação em andamento.')}>Info</Button>
        </div>
      </section>

      {/* ---------- Teste do cliente HTTP (temporário) ---------- */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Cliente HTTP (teste manual)
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                // Endpoint público — não exige token
                await apiGet('/accounts')
                toast.success('GET /accounts respondeu')
              } catch (e) {
                if (isApiException(e)) {
                  toast.error(`${e.code} (${e.status})`, { description: e.detail })
                } else {
                  toast.error(e instanceof Error ? e.message : 'Erro')
                }
              }
            }}
          >
            Testar GET /accounts
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                // Endpoint que exige auth → deve dar 401
                await apiPost('/auth/login', { email: 'invalido@test.com', senha: 'x' })
              } catch (e) {
                if (isApiException(e)) {
                  toast.error(`${e.code} (${e.status})`, { description: e.detail })
                } else {
                  toast.error(e instanceof Error ? e.message : 'Erro')
                }
              }
            }}
          >
            Testar POST /auth/login (erro esperado)
          </Button>
        </div>
      </section>

      <Separator />
      <p className="pb-8 text-xs text-brand-neutral">
        Fim do showcase. Esta página será removida antes do deploy.
      </p>
    </div>
  )
}