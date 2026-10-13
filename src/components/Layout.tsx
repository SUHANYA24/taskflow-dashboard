import { LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  FolderKanban,
  KanbanSquare,
  ListTodo,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  X,
} from 'lucide-react'

interface LayoutProps {
  darkMode: boolean
  onToggleTheme: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/kanban', label: 'Kanban', icon: KanbanSquare },
]

export default function Layout({ darkMode, onToggleTheme }: LayoutProps) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
  await supabase.auth.signOut()
}

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">T</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Project Workspace</span>
          </div>
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={to === '/'}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
  <button className="nav-link button-reset">
    <Settings size={19} />
    <span>Settings</span>
  </button>

  <button
    className="nav-link button-reset"
    onClick={handleLogout}
  >
    <LogOut size={19} />
    <span>Logout</span>
  </button>
</div>
      </aside>

      {open && <button className="backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={21} />
            </button>
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Search projects and tasks..." />
            </div>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="avatar">PL</div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
