import { ArrowLeftRight, LayoutDashboard, LogOut, ShieldCheck, Wallet } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import BrandMark from './BrandMark'

interface DashboardSidebarProps {
  onLogout: () => void
}

export default function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="Bckd Bank, inicio">
        <BrandMark /><span className="brand-name">bckd<span>bank</span></span>
      </Link>
      <div className="sidebar-label">MENÚ PRINCIPAL</div>
      <nav className="side-nav" aria-label="Navegación principal">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
          <LayoutDashboard size={18} />Resumen
        </NavLink>
        <NavLink to="/accounts" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
          <Wallet size={18} />Mis cuentas
        </NavLink>
        <NavLink to="/activity" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
          <ArrowLeftRight size={18} />Movimientos
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="secure-note">
          <ShieldCheck size={17} /><span>Conexión segura<br /><strong>Sesión protegida</strong></span>
        </div>
        <button className="nav-link logout-link" onClick={onLogout}><LogOut size={18} />Cerrar sesión</button>
        <span className="sidebar-version">Bckd Bank · Demo</span>
      </div>
    </aside>
  )
}
