import { useState, type FormEvent } from 'react'
import {
  ArrowRight, Building2, CircleHelp, LoaderCircle, RefreshCw, Search,
  ShieldCheck, TrendingUp,
} from 'lucide-react'
import type { CompanyProfile, Quote } from '../lib/api'
import { formatMarketMoney } from '../lib/formatters'

interface MarketPanelProps {
  symbol: string
  quote: Quote | null
  profile: CompanyProfile | null
  loading: boolean
  error: string
  onSearch: (symbol: string) => void
  onRetry: () => void
}

export default function MarketPanel({
  symbol,
  quote,
  profile,
  loading,
  error,
  onSearch,
  onRetry,
}: MarketPanelProps) {
  const [symbolInput, setSymbolInput] = useState(symbol)
  const isPositive = (quote?.dp ?? 0) >= 0

  function submitSymbol(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = symbolInput.trim().toUpperCase()
    if (normalized) onSearch(normalized)
  }

  return (
    <>
      <section className="panel market-panel">
        <div className="market-heading">
          <div><span className="eyebrow">MERCADO</span><h2>En seguimiento</h2></div>
          <span className="market-live"><span className="status-dot" />FINNHUB</span>
        </div>
        <form className="symbol-search" onSubmit={submitSymbol}>
          <Search size={16} />
          <input
            aria-label="Símbolo bursátil"
            value={symbolInput}
            onChange={(event) => setSymbolInput(event.target.value)}
            maxLength={20}
            placeholder="Símbolo, ej. AAPL"
          />
          <button type="submit" aria-label="Buscar símbolo" title="Buscar"><ArrowRight size={15} /></button>
        </form>
        {loading ? (
          <div className="market-loading"><LoaderCircle className="spin" size={21} />Consultando Finnhub...</div>
        ) : error ? (
          <div className="market-error" role="alert">
            {error}
            <button onClick={onRetry} aria-label="Reintentar consulta" title="Reintentar">
              <RefreshCw size={15} />
            </button>
          </div>
        ) : quote ? (
          <div className="quote-content">
            <div className="company-identity">
              <div className="company-logo">
                {profile?.logo
                  ? <img src={profile.logo} alt={`${profile.name ?? symbol} logo`} />
                  : <Building2 size={20} />}
              </div>
              <div className="company-name">
                <strong>{profile?.name ?? symbol}</strong>
                <small>{profile?.exchange ?? 'Mercado'} · {profile?.ticker ?? symbol}</small>
              </div>
            </div>
            <div className="quote-price-row">
              <strong>{formatMarketMoney(quote.c, profile?.currency)}</strong>
              <span className={`quote-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
              </span>
            </div>
            <div className="quote-change-detail">
              {isPositive ? '+' : ''}{formatMarketMoney(quote.d, profile?.currency)} hoy
            </div>
            <div className="quote-divider" />
            <div className="quote-stats">
              <span><small>Máximo</small><strong>{formatMarketMoney(quote.h, profile?.currency)}</strong></span>
              <span><small>Mínimo</small><strong>{formatMarketMoney(quote.l, profile?.currency)}</strong></span>
              <span><small>Cierre anterior</small><strong>{formatMarketMoney(quote.pc, profile?.currency)}</strong></span>
            </div>
            <div className="quote-source"><TrendingUp size={14} />Datos de mercado por Finnhub</div>
          </div>
        ) : (
          <div className="market-loading">Busca un símbolo para consultar datos.</div>
        )}
      </section>
      <section className="security-panel">
        <div className="security-icon"><ShieldCheck size={19} /></div>
        <div><strong>Tu banca, protegida</strong><p>Las operaciones se validan de forma segura.</p></div>
        <CircleHelp className="security-help" size={16} />
      </section>
    </>
  )
}
