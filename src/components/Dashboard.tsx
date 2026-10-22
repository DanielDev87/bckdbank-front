import { useState } from 'react'
import { Check, Clock3, RefreshCw, X } from 'lucide-react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type {
  Account, AuthResponse, CompanyProfile, Quote, Transaction, TransferValues,
} from '../lib/api'
import { shortDate } from '../lib/formatters'
import ActivityPanel from './ActivityPanel'
import AccountsPanel from './AccountsPanel'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import DashboardSummary from './DashboardSummary'
import MarketPanel from './MarketPanel'
import TransferDialog from './TransferDialog'

interface DashboardProps {
  session: AuthResponse
  accounts: Account[]
  transactions: Transaction[]
  selectedAccountId: number | null
  loading: boolean
  dashboardError: string
  quote: Quote | null
  profile: CompanyProfile | null
  symbol: string
  marketLoading: boolean
  marketError: string
  toast: string
  onSelectAccount: (id: number) => void
  onRefresh: () => void
  onLogout: () => void
  onSearchSymbol: (symbol: string) => void
  onRetryMarket: () => void
  onTransfer: (values: TransferValues) => Promise<void>
  onDismissToast: () => void
}

export default function Dashboard({
  session,
  accounts,
  transactions,
  selectedAccountId,
  loading,
  dashboardError,
  quote,
  profile,
  symbol,
  marketLoading,
  marketError,
  toast,
  onSelectAccount,
  onRefresh,
  onLogout,
  onSearchSymbol,
  onRetryMarket,
  onTransfer,
  onDismissToast,
}: DashboardProps) {
  const [transferOpen, setTransferOpen] = useState(false)
  const isOverview = useLocation().pathname === '/'
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const accountTransactions = selectedAccount
    ? transactions.filter((item) =>
      item.sourceAccountNumber === selectedAccount.accountNumber
      || item.destinationAccount === selectedAccount.accountNumber)
    : transactions
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0)
  const firstName = session.email.split('@')[0]?.split(/[._-]/)[0] ?? 'Usuario'

  async function transfer(values: TransferValues) {
    await onTransfer(values)
    setTransferOpen(false)
  }

  return (
    <div className="app-shell">
      <DashboardSidebar onLogout={onLogout} />
      <main className="main-area">
        <DashboardHeader email={session.email} onLogout={onLogout} />
        <div className="content-wrap">
          {dashboardError && (
            <div className="alert alert-error" role="alert">
              {dashboardError}
              <button onClick={onRefresh}><RefreshCw size={15} />Reintentar</button>
            </div>
          )}
          {isOverview && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">TU ESPACIO FINANCIERO</div>
                  <h1>Hola, {firstName}<span className="wave-mark">.</span></h1>
                  <p className="welcome-copy">Aquí tienes el estado de tus cuentas hoy.</p>
                </div>
                <div className="welcome-date"><Clock3 size={15} />{shortDate.format(new Date())}</div>
              </section>
              <DashboardSummary
                accountCount={accounts.length}
                totalBalance={totalBalance}
                transactionCount={transactions.length}
                loading={loading}
                onRefresh={onRefresh}
                onOpenTransfer={() => setTransferOpen(true)}
              />
            </>
          )}
          <section className="dashboard-grid">
            <div className="primary-column" id="overview">
              <Routes>
                <Route
                  path="/"
                  element={(
                    <>
                      <AccountsPanel
                        accounts={accounts}
                        loading={loading}
                        selectedAccountId={selectedAccount?.id ?? null}
                        onSelectAccount={onSelectAccount}
                      />
                      <ActivityPanel
                        account={selectedAccount}
                        transactions={accountTransactions}
                        loading={loading}
                        onOpenTransfer={() => setTransferOpen(true)}
                      />
                    </>
                  )}
                />
                <Route
                  path="/accounts"
                  element={(
                    <AccountsPanel
                      accounts={accounts}
                      loading={loading}
                      selectedAccountId={selectedAccount?.id ?? null}
                      onSelectAccount={onSelectAccount}
                    />
                  )}
                />
                <Route
                  path="/activity"
                  element={(
                    <ActivityPanel
                      account={selectedAccount}
                      transactions={accountTransactions}
                      loading={loading}
                      onOpenTransfer={() => setTransferOpen(true)}
                    />
                  )}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <aside className="secondary-column">
              <MarketPanel
                symbol={symbol}
                quote={quote}
                profile={profile}
                loading={marketLoading}
                error={marketError}
                onSearch={onSearchSymbol}
                onRetry={onRetryMarket}
              />
            </aside>
          </section>
          <footer className="app-footer">
            <span>Bckd Bank · Plataforma de demostración</span>
            <span>Cuentas en USD · Mercado según moneda de Finnhub</span>
          </footer>
        </div>
      </main>
      {transferOpen && selectedAccount && (
        <TransferDialog
          accounts={accounts}
          initialAccount={selectedAccount.accountNumber}
          onClose={() => setTransferOpen(false)}
          onSubmit={transfer}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-check"><Check size={15} /></span>
          {toast}
          <button onClick={onDismissToast} aria-label="Cerrar aviso"><X size={16} /></button>
        </div>
      )}
    </div>
  )
}
