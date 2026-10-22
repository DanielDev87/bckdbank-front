import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeftRight, ArrowRight, LoaderCircle, X } from 'lucide-react'
import type { Account, TransferValues } from '../lib/api'
import { formatMoney } from '../lib/formatters'

interface TransferDialogProps {
  accounts: Account[]
  initialAccount: string
  onClose: () => void
  onSubmit: (values: TransferValues) => Promise<void>
}

export default function TransferDialog({
  accounts,
  initialAccount,
  onClose,
  onSubmit,
}: TransferDialogProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const values: TransferValues = {
      sourceAccountNumber: String(form.get('sourceAccountNumber') ?? ''),
      destinationAccountNumber: String(form.get('destinationAccountNumber') ?? '').trim(),
      amount: Number(form.get('amount')),
      description: String(form.get('description') ?? '').trim(),
    }

    if (values.sourceAccountNumber === values.destinationAccountNumber) {
      setError('La cuenta de destino debe ser diferente a la cuenta de origen.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await onSubmit(values)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible realizar la transferencia.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <section className="transfer-dialog" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
        <div className="dialog-header">
          <div className="dialog-title-icon"><ArrowLeftRight size={19} /></div>
          <button className="icon-button dialog-close" onClick={onClose} aria-label="Cerrar"><X size={19} /></button>
        </div>
        <span className="eyebrow">MOVIMIENTO ENTRE CUENTAS</span>
        <h2 id="transfer-title">Nueva transferencia</h2>
        <p className="dialog-copy">Envía dinero de forma segura a otra cuenta Bckd.</p>
        <form className="transfer-form" onSubmit={submit}>
          <label>
            Cuenta de origen
            <select name="sourceAccountNumber" defaultValue={initialAccount} required>
              {accounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountType === 'SAVINGS' ? 'Ahorros' : account.accountType}
                  {' · •••• '}{account.accountNumber.slice(-4)}{' · '}{formatMoney(account.balance)}
                </option>
              ))}
            </select>
          </label>
          <label>Cuenta de destino<input name="destinationAccountNumber" required minLength={4} maxLength={30} placeholder="Número de cuenta" /></label>
          <label>
            Valor a transferir
            <div className="amount-input"><span>$</span><input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" /></div>
          </label>
          <label>Descripción <span className="optional-label">Opcional</span><input name="description" maxLength={120} placeholder="¿Cuál es el motivo?" /></label>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <div className="dialog-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="spin" size={17} /> : <>Confirmar envío <ArrowRight size={16} /></>}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
