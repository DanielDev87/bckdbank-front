import { ArrowLeftRight, ArrowRight, LoaderCircle } from 'lucide-react'
import type { Account, Transaction } from '../lib/api'
import TransactionRow from './TransactionRow'

interface ActivityPanelProps {
  account: Account | undefined
  transactions: Transaction[]
  loading: boolean
  onOpenTransfer: () => void
}

export default function ActivityPanel({
  account,
  transactions,
  loading,
  onOpenTransfer,
}: ActivityPanelProps) {
  return (
    <section className="panel activity-panel" id="activity">
      <div className="section-heading activity-heading">
        <div><span className="eyebrow">TU CUENTA</span><h2>Actividad reciente</h2></div>
        <span className="activity-account-label">
          {account ? `•••• ${account.accountNumber.slice(-4)}` : 'Selecciona una cuenta'}
        </span>
      </div>
      {loading ? (
        <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando movimientos...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state empty-activity">
          <ArrowLeftRight size={23} />
          <p>Tus transferencias aparecerán aquí.</p>
          <button onClick={onOpenTransfer} disabled={!account}>
            Hacer una transferencia <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.slice(0, 6).map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              outgoing={transaction.sourceAccountNumber === account?.accountNumber}
            />
          ))}
        </div>
      )}
    </section>
  )
}
