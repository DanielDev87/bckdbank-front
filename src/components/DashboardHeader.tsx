import { ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface DashboardHeaderProps {
  email: string
  onLogout: () => void
}

export default function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  const { pathname } = useLocation()
  const pageName = pathname === '/accounts'
    ? 'Mis cuentas'
    : pathname === '/activity'
      ? 'Movimientos'
      : 'Resumen'

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Área personal</span><span className="breadcrumb-slash">/</span><strong>{pageName}</strong>
      </div>
      <div className="topbar-actions">
        <div className="status-pill"><span className="status-dot" />Sesión segura</div>
        <span className="avatar">{email.slice(0, 1).toUpperCase()}</span>
        <span className="profile-email">{email}</span>
        <button className="icon-button" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  )
}
