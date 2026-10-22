import { ArrowRight, CreditCard, LoaderCircle, Wallet } from 'lucide-react'
import type { Account } from '../lib/api'
import { formatMoney } from '../lib/formatters'

interface AccountsPanelProps {
  accounts: Account[]
  loading: boolean
  selectedAccountId: number | null
  onSelectAccount: (id: number) => void
}

export default function AccountsPanel({
  accounts,
  loading,
  selectedAccountId,
  onSelectAccount,
}: AccountsPanelProps) {
  return (
    <section className="panel accounts-panel" id="accounts">
      <div className="section-heading">
        <div><span className="eyebrow">PRODUCTOS</span><h2>Tus cuentas</h2></div>
        <span className="section-count">{accounts.length.toString().padStart(2, '0')}</span>
      </div>
      {loading ? (
        <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando tus cuentas...</div>
      ) : accounts.length === 0 ? (
        <div className="empty-state"><Wallet size={24} /><p>Aún no hay cuentas para mostrar.</p></div>
      ) : (
        <div className="accounts-list">
          {accounts.map((account, index) => {
            const selected = selectedAccountId === account.id
            return (
              <button
                className={`account-row ${selected ? 'account-row-selected' : ''}`}
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                aria-pressed={selected}
              >
                <span className={`account-icon account-icon-${index % 3}`}><CreditCard size={19} /></span>
                <span className="account-details">
                  <strong>{account.accountType === 'SAVINGS' ? 'Cuenta de ahorros' : account.accountType}</strong>
                  <small>Cuenta {account.accountNumber}</small>
                </span>
                <span className="account-balance">{formatMoney(account.balance)}</span>
                <ArrowRight className="account-chevron" size={16} />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
