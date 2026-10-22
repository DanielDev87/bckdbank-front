import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Transaction } from '../lib/api'
import { formatMoney, shortDate } from '../lib/formatters'

interface TransactionRowProps {
  transaction: Transaction
  outgoing: boolean
}

export default function TransactionRow({ transaction, outgoing }: TransactionRowProps) {
  const date = new Date(transaction.timestamp)

  return (
    <div className="transaction-row">
      <span className={`transaction-icon ${outgoing ? 'transaction-out' : 'transaction-in'}`}>
        {outgoing ? <ArrowUpRight size={17} /> : <ArrowDownLeft size={17} />}
      </span>
      <span className="transaction-details">
        <strong>{transaction.description || 'Transferencia entre cuentas'}</strong>
        <small>
          {outgoing
            ? `Para •••• ${transaction.destinationAccount.slice(-4)}`
            : `De •••• ${transaction.sourceAccountNumber.slice(-4)}`}
        </small>
      </span>
      <span className="transaction-date">
        {Number.isNaN(date.getTime()) ? '' : shortDate.format(date)}
      </span>
      <strong className={`transaction-amount ${outgoing ? 'amount-out' : 'amount-in'}`}>
        {outgoing ? '−' : '+'}{formatMoney(transaction.amount)}
      </strong>
    </div>
  )
}
